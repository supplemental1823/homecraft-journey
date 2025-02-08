
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery({
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

  if (isLoading) {
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
      </div>
    </div>
  );
};

export default ProjectDetail;
