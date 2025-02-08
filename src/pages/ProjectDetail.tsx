
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_templates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["template-tasks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_tasks")
        .select("*")
        .eq("template_id", id)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoadingProject || isLoadingTasks) {
    return <div className="p-8">Loading...</div>;
  }

  if (!project) {
    return <div className="p-8">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Row A: Project Details */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
          <div className="flex gap-3 items-center flex-wrap">
            {project.category && (
              <Badge variant="outline" className="text-sm">
                {project.category}
              </Badge>
            )}
            <Badge
              variant={
                project.difficulty === "beginner"
                  ? "default"
                  : project.difficulty === "intermediate"
                  ? "secondary"
                  : "destructive"
              }
              className="text-sm"
            >
              {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
            </Badge>
            {project.estimated_hours && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {project.estimated_hours}h
              </div>
            )}
          </div>
        </div>

        {/* Component B: Tasks Section */}
        <div className="space-y-4 mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Project Tasks</h2>
            <span className="text-sm text-muted-foreground">
              {tasks?.length || 0} tasks
            </span>
          </div>
          <Progress value={0} className="h-2" />

          {/* Task List */}
          <div className="space-y-6 mt-6">
            {tasks?.map((task) => (
              <div key={task.id} className="space-y-2">
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

