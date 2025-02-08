
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  progress?: number;
  imageUrl: string;
  estimatedHours?: number | null;
  category?: string;
}

export function ProjectCard({
  title,
  description,
  difficulty,
  progress = 0,
  imageUrl,
  estimatedHours,
  category,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{title}</h3>
          {estimatedHours && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {estimatedHours}h
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {category && (
            <Badge variant="outline" className="w-fit">
              {category}
            </Badge>
          )}
          <Badge 
            variant={
              difficulty === "beginner" ? "default" : 
              difficulty === "intermediate" ? "secondary" : 
              "destructive"
            }
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>
      </CardContent>
      {typeof progress === "number" && (
        <CardFooter>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
