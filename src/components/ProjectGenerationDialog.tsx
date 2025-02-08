
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectForm } from "./project/ProjectForm";
import { ProjectPreview } from "./project/ProjectPreview";
import { GeneratedProject } from "@/types/project";

interface ProjectGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectGenerationDialog({
  open,
  onOpenChange,
}: ProjectGenerationDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<GeneratedProject | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateProject = async () => {
    if (!session?.user.id) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-project", {
        body: {
          prompt,
          userId: session.user.id,
        },
      });

      if (error) throw error;
      
      setGeneratedProject(data.project);
    } catch (error) {
      console.error("Error generating project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate project. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveProject = async () => {
    if (!session?.user.id || !generatedProject) return;
    
    setIsGenerating(true);
    try {
      const { data: template, error: templateError } = await supabase
        .from('project_templates')
        .insert({
          name: generatedProject.name,
          description: generatedProject.description,
          difficulty: generatedProject.difficulty,
          estimated_hours: generatedProject.estimated_hours,
          category: generatedProject.category,
          visibility: 'private',
          status: 'published',
          created_by: session.user.id
        })
        .select()
        .single();

      if (templateError) throw templateError;

      const { error: instanceError } = await supabase
        .from('project_instances')
        .insert({
          template_id: template.id,
          user_id: session.user.id,
          title: generatedProject.name,
          description: generatedProject.description,
          status: 'active'
        });

      if (instanceError) throw instanceError;

      // Create tool entries
      const toolPromises = generatedProject.tools_and_materials.map(async (item: string) => {
        const { data: tool } = await supabase
          .from('tools_and_materials')
          .insert({
            name: item,
            user_id: session.user.id
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

      // Invalidate the active projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['activeProjects'] });

      toast({
        title: "Project Added!",
        description: "Your new project has been added to your dashboard.",
      });
      
      // Reset the form and close the dialog
      setPrompt("");
      setGeneratedProject(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save project. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartOver = () => {
    setPrompt("");
    setGeneratedProject(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Project</DialogTitle>
          <DialogDescription>
            Describe the home improvement project you'd like to create. Our AI will generate a detailed project plan for you.
          </DialogDescription>
        </DialogHeader>

        {!generatedProject ? (
          <ProjectForm 
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={generateProject}
            isGenerating={isGenerating}
          />
        ) : (
          <ProjectPreview project={generatedProject} />
        )}

        <DialogFooter>
          {generatedProject && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleStartOver}
                disabled={isGenerating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <Button
                onClick={saveProject}
                disabled={isGenerating}
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isGenerating ? "Adding Project..." : "Add to My Projects"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
