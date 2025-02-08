
import { Progress } from "@/components/ui/progress";

interface ProjectProgressProps {
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

export function ProjectProgress({ 
  progress,
  totalTasks,
  completedTasks
}: ProjectProgressProps) {
  return (
    <div className="mt-4">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground mt-1">
        {completedTasks}/{totalTasks} Tasks Complete
      </p>
    </div>
  );
}
