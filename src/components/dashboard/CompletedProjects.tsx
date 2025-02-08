
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";
import { toast } from "sonner";

export const CompletedProjects = () => {
  const queryClient = useQueryClient();
  
  // Fetch completed projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['completedProjects'],
    queryFn: async () => {
      const { data: projectInstances, error } = await supabase
        .from('project_instances')
        .select(`
          *,
          project_templates (
            name,
            difficulty
          ),
          user_instance_tasks (
            id,
            completed
          )
        `)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      return projectInstances;
    }
  });

  // Mutation to make a project active
  const makeActiveMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('project_instances')
        .update({ 
          status: 'active',
          completed_at: null,
        })
        .eq('id', projectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate both completed and active projects queries
      queryClient.invalidateQueries({ queryKey: ['completedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['activeProjects'] });
      toast.success('Project moved to active projects');
    },
    onError: (error) => {
      console.error('Error making project active:', error);
      toast.error('Failed to move project to active projects');
    }
  });

  const calculateProgress = (tasks: { completed: boolean }[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Completed Projects</CardTitle>
          <CheckSquare className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Loading projects...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Completed Projects</CardTitle>
        <CheckSquare className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects && projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title || project.project_templates?.name || 'Untitled Project'}
              description={project.description || 'No description available'}
              difficulty={project.project_templates?.difficulty || 'beginner'}
              progress={100}
              imageUrl="/placeholder.svg"
              instanceId={project.id}
              status="completed"
            />
          ))}
          {(!projects || projects.length === 0) && (
            <div className="text-center text-muted-foreground">
              No completed projects found
            </div>
          )}
        </div>
        {projects && projects.length === 2 && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              View More Projects
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

