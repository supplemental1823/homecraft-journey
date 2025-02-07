
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List } from "lucide-react";

export const ActiveProjects = () => {
  // Fetch active projects and their tasks
  const { data: projects, isLoading } = useQuery({
    queryKey: ['activeProjects'],
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
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return projectInstances;
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
          <CardTitle className="text-xl font-bold">Active Projects</CardTitle>
          <List className="h-5 w-5 text-primary" />
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
        <CardTitle className="text-xl font-bold">Active Projects</CardTitle>
        <List className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title || project.project_templates?.name || 'Untitled Project'}
              description={project.description || 'No description available'}
              difficulty={project.project_templates?.difficulty || 'Easy'}
              progress={calculateProgress(project.user_instance_tasks)}
              imageUrl="/placeholder.svg"
            />
          ))}
          {(!projects || projects.length === 0) && (
            <div className="col-span-full text-center text-muted-foreground">
              No active projects found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
