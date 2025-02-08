
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";

export const TrendingBlueprints = () => {
  const { data: trendingProjects, isLoading } = useQuery({
    queryKey: ["trending-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_templates")
        .select("*")
        .eq("status", "published")
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Trending Blueprints</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading trending projects...</p>
        ) : (
          trendingProjects?.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description || ""}
              difficulty={project.difficulty}
              imageUrl="/placeholder.svg"
              estimatedHours={project.estimated_hours}
              category={project.category || "Uncategorized"}
            />
          ))
        )}
      </div>
    </div>
  );
};
