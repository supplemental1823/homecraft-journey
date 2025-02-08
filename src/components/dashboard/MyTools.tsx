
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  unit: string | null;
}

export const MyTools = () => {
  const { data: tools, isLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools_and_materials")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Tool[];
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">My Tools</CardTitle>
        <Wrench className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <p>Loading tools...</p>
          ) : !tools?.length ? (
            <p className="text-muted-foreground col-span-2">No tools added yet.</p>
          ) : (
            tools.map((tool) => (
              <Card key={tool.id} className="p-4">
                <h3 className="font-semibold">{tool.name}</h3>
                {tool.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {tool.description}
                  </p>
                )}
                {(tool.category || tool.unit) && (
                  <div className="flex gap-2 mt-2 text-sm">
                    {tool.category && (
                      <span className="bg-secondary px-2 py-1 rounded-md">
                        {tool.category}
                      </span>
                    )}
                    {tool.unit && (
                      <span className="bg-secondary px-2 py-1 rounded-md">
                        {tool.unit}
                      </span>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
