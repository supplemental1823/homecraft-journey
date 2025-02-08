
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ProjectInstanceDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: projectInstance, isLoading } = useQuery({
    queryKey: ['projectInstance', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_instances')
        .select(`
          *,
          project_templates (
            name,
            description,
            difficulty,
            estimated_hours
          ),
          user_instance_tasks (
            id,
            title,
            description,
            completed,
            completed_at,
            order_index
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const calculateProgress = (tasks: { completed: boolean }[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  if (isLoading) {
    return <div className="p-8">Loading project details...</div>;
  }

  if (!projectInstance) {
    return <div className="p-8">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Project Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{projectInstance.title || projectInstance.project_templates?.name}</h1>
          <div className="flex gap-2 flex-wrap">
            {projectInstance.project_templates?.difficulty && (
              <Badge 
                variant={
                  projectInstance.project_templates.difficulty === "beginner" ? "default" : 
                  projectInstance.project_templates.difficulty === "intermediate" ? "secondary" : 
                  "destructive"
                }
              >
                {projectInstance.project_templates.difficulty.charAt(0).toUpperCase() + 
                 projectInstance.project_templates.difficulty.slice(1)}
              </Badge>
            )}
            <Badge variant="outline">
              Status: {projectInstance.status.charAt(0).toUpperCase() + projectInstance.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {projectInstance.description || projectInstance.project_templates?.description}
          </p>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={calculateProgress(projectInstance.user_instance_tasks)} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {calculateProgress(projectInstance.user_instance_tasks)}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectInstance.user_instance_tasks
                ?.sort((a, b) => a.order_index - b.order_index)
                .map((task) => (
                  <div 
                    key={task.id} 
                    className="p-4 border rounded-lg bg-card"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          {task.order_index}. {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={task.completed ? "default" : "secondary"}>
                        {task.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectInstanceDetail;
