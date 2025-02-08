
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectSearch } from "./ProjectSearch";

export const AllBlueprints = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    difficulty: "all",
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", search, filters],
    queryFn: async () => {
      let query = supabase
        .from("project_templates")
        .select("*")
        .eq("status", "published")
        .eq("visibility", "public");

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      if (filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      if (filters.difficulty !== "all") {
        query = query.eq("difficulty", filters.difficulty);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">All Blueprints</h2>
      <div className="mb-8">
        <ProjectSearch
          onSearchChange={setSearch}
          onFiltersChange={setFilters}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading projects...</p>
        ) : !projects?.length ? (
          <p className="col-span-full text-center text-muted-foreground">
            No projects found.
          </p>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              templateId={project.id}
              title={project.name}
              description={project.description || ""}
              difficulty={project.difficulty}
              estimatedHours={project.estimated_hours}
              category={project.category || "Uncategorized"}
            />
          ))
        )}
      </div>
    </div>
  );
}
