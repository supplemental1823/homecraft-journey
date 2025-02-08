
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileCheck, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  imageUrl,
  status = 'active',
}: ProjectCardProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleStartProject = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing

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

  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
        instanceId && status === 'active' ? 'border-blue-500' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {instanceId ? (
              <FileCheck className="h-5 w-5 text-blue-500" />
            ) : (
              <LayoutTemplate className="h-5 w-5 text-gray-500" />
            )}
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          {estimatedHours && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {estimatedHours}h
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {category && (
            <Badge variant="outline" className="w-fit">
              {category}
            </Badge>
          )}
          <Badge 
            variant={
              difficulty === "beginner" ? "default" : 
              difficulty === "intermediate" ? "secondary" : 
              "destructive"
            }
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
          {status && (
            <Badge 
              variant={status === 'active' ? "default" : "secondary"}
              className="ml-auto"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
        </div>
        {instanceId && (
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {progress}% Complete
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>
      </CardContent>
      <CardFooter>
        {instanceId ? (
          <Button 
            className="w-full"
            onClick={handleStatusToggle}
            disabled={toggleProjectStatus.isPending}
          >
            {status === 'active' ? 'Complete' : 'Make Active'}
          </Button>
        ) : (
          <Button 
            className="w-full"
            onClick={handleStartProject}
          >
            Start Project
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
