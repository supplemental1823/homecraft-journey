
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wrench } from "lucide-react";

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
            estimated_hours,
            tools_and_materials (
              id,
              name,
              description,
              category
            )
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

  const isTemplate = !window.location.pathname.includes('/instance/');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
            {!isTemplate && (
              <Badge variant="outline">
                Status: {projectInstance.status.charAt(0).toUpperCase() + projectInstance.status.slice(1)}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {projectInstance.description || projectInstance.project_templates?.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-4 gap-6">
          {/* Tasks Section - 3/4 width */}
          <div className="col-span-3">
            {!isTemplate && (
              <Card className="mb-6">
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
            )}

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
                          {!isTemplate && (
                            <Badge variant={task.completed ? "default" : "secondary"}>
                              {task.completed ? "Completed" : "In Progress"}
                            </Badge>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Section - 1/4 width */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Tools & Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectInstance.project_templates?.tools_and_materials?.map((tool) => (
                    <div key={tool.id} className="p-3 border rounded-lg">
                      <h3 className="font-medium">{tool.name}</h3>
                      {tool.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {tool.description}
                        </p>
                      )}
                      {tool.category && (
                        <Badge variant="secondary" className="mt-2">
                          {tool.category}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {(!projectInstance.project_templates?.tools_and_materials || 
                    projectInstance.project_templates.tools_and_materials.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      No tools or materials specified.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInstanceDetail;
