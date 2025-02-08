
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectHeader } from "./project-card/ProjectHeader";
import { ProjectProgress } from "./project-card/ProjectProgress";
import { ProjectActions } from "./project-card/ProjectActions";

interface ProjectCardProps {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours?: number | null;
  category?: string;
  templateId?: string;
  instanceId?: string;
  progress?: number;
  imageUrl?: string;
  status?: 'active' | 'completed';
}

export function ProjectCard({
  title,
  description,
  difficulty,
  estimatedHours,
  category,
  templateId,
  instanceId,
  progress = 0,
  status = 'active',
}: ProjectCardProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleStartProject = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a project",
        variant: "destructive",
      });
      return;
    }

    if (!templateId) {
      toast({
        title: "Error",
        description: "Invalid project template",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_instances')
        .insert({
          template_id: templateId,
          user_id: session.user.id,
          title,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Project started successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error starting project:', error);
      toast({
        title: "Error",
        description: "Failed to start project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleProjectStatus = useMutation({
    mutationFn: async () => {
      if (!instanceId) throw new Error("No instance ID provided");
      
      const newStatus = status === 'active' ? 'completed' : 'active';
      const { error } = await supabase
        .from('project_instances')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', instanceId);

      if (error) throw error;
      return newStatus;
    },
    onSuccess: (newStatus) => {
      queryClient.invalidateQueries({ queryKey: ['activeProjects'] });
      queryClient.invalidateQueries({ queryKey: ['completedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projectInstance', instanceId] });
      toast({
        title: "Success!",
        description: `Project ${newStatus === 'completed' ? 'completed' : 'made active'} successfully`,
      });
    },
    onError: (error) => {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCardClick = () => {
    if (instanceId) {
      navigate(`/project/instance/${instanceId}`);
    } else if (templateId) {
      navigate(`/project/${templateId}`);
    }
  };

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleProjectStatus.mutate();
  };

  // Calculate task counts
  const totalTasks = 10; // This should come from your data
  const completedTasks = Math.round((progress || 0) / 10);

  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
        instanceId && status === 'active' ? 'border-blue-500' : ''
      }`}
      onClick={handleCardClick}
    >
      <ProjectHeader
        title={title}
        difficulty={difficulty}
        category={category}
        estimatedHours={estimatedHours}
        instanceId={instanceId}
      />
      <CardContent>
        <p className="text-muted-foreground">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>
        {instanceId && (
          <ProjectProgress
            progress={progress || 0}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
          />
        )}
      </CardContent>
      <ProjectActions
        instanceId={instanceId}
        status={status}
        onStart={handleStartProject}
        onStatusToggle={handleStatusToggle}
        isStatusUpdating={toggleProjectStatus.isPending}
      />
    </Card>
  );
}
