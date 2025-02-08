
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_REQUESTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { prompt, userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check rate limit
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    const { count } = await supabase
      .from('project_templates')
      .select('id', { count: 'exact' })
      .eq('created_by', userId)
      .eq('visibility', 'private')
      .gte('created_at', new Date(windowStart * 1000).toISOString());

    if (count && count >= RATE_LIMIT_REQUESTS) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate project with OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a home improvement project generator. Generate a detailed project based on the user's prompt. 
            Keep descriptions concise (50-75 words max). Generate a sequential list of tasks (maximum 12) needed to complete the project.
            Tasks should be ordered logically and represent clear, actionable steps. Each task must have a title and description.
            Tasks must be numbered sequentially starting from 1. The response must be a valid JSON object with the following structure:
            {
              "name": "Project name (3-7 words)",
              "description": "Detailed but concise project description (50-75 words)",
              "tools_and_materials": ["item1", "item2", "item3"],
              "difficulty": "beginner" | "intermediate" | "advanced",
              "estimated_hours": number (1-48),
              "category": "appliances" | "electrical" | "floors" | "general" | "home-safety" | "kitchen" | "outdoor" | "painting" | "plumbing" | "stairs" | "storage" | "windows-and-doors",
              "tasks": [
                {
                  "title": "Clear, actionable task title",
                  "description": "Detailed task description explaining what needs to be done",
                  "order_index": number (starting from 1)
                }
              ]
            }`
          },
          {
            role: 'user',
            content: prompt || 'Generate a home improvement project'
          }
        ],
        temperature: 0.7,
      }),
    });

    const completion = await openAIResponse.json();
    
    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const projectData = JSON.parse(completion.choices[0].message.content);

    // Validate the response contains all required fields
    const requiredFields = ['name', 'description', 'tools_and_materials', 'difficulty', 'estimated_hours', 'category', 'tasks'];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate tasks
    if (!Array.isArray(projectData.tasks) || projectData.tasks.length === 0 || projectData.tasks.length > 12) {
      throw new Error('Invalid tasks array: must contain between 1 and 12 tasks');
    }

    // Validate task order and required fields
    const seenOrderIndices = new Set();
    for (const task of projectData.tasks) {
      if (!task.title || !task.description || typeof task.order_index !== 'number') {
        throw new Error('Invalid task: missing required fields');
      }
      if (task.order_index < 1 || task.order_index > projectData.tasks.length) {
        throw new Error('Invalid task order_index: must be sequential starting from 1');
      }
      if (seenOrderIndices.has(task.order_index)) {
        throw new Error('Invalid task order_index: duplicate values found');
      }
      seenOrderIndices.add(task.order_index);
    }

    // Sort tasks by order_index to ensure they're in the correct sequence
    projectData.tasks.sort((a, b) => a.order_index - b.order_index);

    return new Response(
      JSON.stringify({ project: projectData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
