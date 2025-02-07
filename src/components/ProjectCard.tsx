
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProjectCardProps {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  progress?: number;
  imageUrl: string;
}

export function ProjectCard({ title, description, difficulty, progress = 0, imageUrl }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden hover-scale">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <Badge 
          className="absolute top-4 right-4"
          variant={
            difficulty === "Easy" ? "default" : 
            difficulty === "Medium" ? "secondary" : 
            "destructive"
          }
        >
          {difficulty}
        </Badge>
      </div>
      <CardHeader className="space-y-1">
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardFooter>
    </Card>
  );
}
