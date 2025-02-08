
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface ProjectActionsProps {
  instanceId?: string;
  status?: 'active' | 'completed';
  onStart: (e: React.MouseEvent) => void;
  onStatusToggle: (e: React.MouseEvent) => void;
  isStatusUpdating: boolean;
}

export function ProjectActions({
  instanceId,
  status,
  onStart,
  onStatusToggle,
  isStatusUpdating
}: ProjectActionsProps) {
  return (
    <CardFooter>
      {instanceId ? (
        <Button 
          className="w-full"
          onClick={onStatusToggle}
          disabled={isStatusUpdating}
        >
          {status === 'active' ? 'Complete' : 'Make Active'}
        </Button>
      ) : (
        <Button 
          className="w-full"
          onClick={onStart}
        >
          Start Project
        </Button>
      )}
    </CardFooter>
  );
}
