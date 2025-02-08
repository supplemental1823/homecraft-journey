
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { prompt, userId } = await req.json();
    
    // Check rate limit
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    const { count } = await supabase
      .from('project_templates')
      .select('id', { count: 'exact' })
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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a home improvement project generator. Generate a detailed project based on the user's prompt. 
            The response must be a valid JSON object with the following structure:
            {
              "name": "Project name (3-7 words)",
              "description": "Detailed project description (100-200 words)",
              "tools_and_materials": ["item1", "item2", "item3"],
              "difficulty": "beginner" | "intermediate" | "advanced",
              "estimated_hours": number (1-48),
              "category": "appliances" | "electrical" | "floors" | "general" | "home-safety" | "kitchen" | "outdoor" | "painting" | "plumbing" | "stairs" | "storage" | "windows-and-doors"
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
    const projectData = JSON.parse(completion.choices[0].message.content);

    // Create project template
    const { data: template, error: templateError } = await supabase
      .from('project_templates')
      .insert({
        name: projectData.name,
        description: projectData.description,
        difficulty: projectData.difficulty,
        estimated_hours: projectData.estimated_hours,
        category: projectData.category,
        visibility: 'private',
        status: 'published'
      })
      .select()
      .single();

    if (templateError) throw templateError;

    // Create project instance
    const { data: instance, error: instanceError } = await supabase
      .from('project_instances')
      .insert({
        template_id: template.id,
        user_id: userId,
        title: projectData.name,
        description: projectData.description,
        status: 'active'
      })
      .select()
      .single();

    if (instanceError) throw instanceError;

    // Create tool entries
    const toolPromises = projectData.tools_and_materials.map(async (item: string) => {
      const { data: tool } = await supabase
        .from('tools_and_materials')
        .insert({
          name: item,
          user_id: userId
        })
        .select()
        .single();

      if (tool) {
        await supabase
          .from('template_tools_and_materials')
          .insert({
            template_id: template.id,
            item_id: tool.id,
            quantity: 1,
            unit: 'piece'
          });
      }
    });

    await Promise.all(toolPromises);

    return new Response(
      JSON.stringify({ success: true, project: instance }),
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
