
import { Clock, FileCheck, LayoutTemplate } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardHeader } from "@/components/ui/card";

interface ProjectHeaderProps {
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category?: string;
  estimatedHours?: number | null;
  instanceId?: string;
}

export function ProjectHeader({
  title,
  difficulty,
  category,
  estimatedHours,
  instanceId,
}: ProjectHeaderProps) {
  const difficultyVariant = 
    difficulty === "beginner" ? "default" : 
    difficulty === "intermediate" ? "secondary" : 
    "destructive";

  return (
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
      <div className="flex items-center gap-2">
        {category && (
          <Badge variant="outline">
            {category}
          </Badge>
        )}
        <Badge variant={difficultyVariant}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
      </div>
    </CardHeader>
  );
}
