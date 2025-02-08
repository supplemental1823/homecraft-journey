
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours?: number | null;
  category?: string;
  templateId?: string;
}

export function ProjectCard({
  title,
  description,
  difficulty,
  estimatedHours,
  category,
  templateId,
}: ProjectCardProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleStartProject = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a project",
        variant: "destructive",
      });
      return;
    }

    if (!templateId) {
      toast({
        title: "Error",
        description: "Invalid project template",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_instances')
        .insert({
          template_id: templateId,
          user_id: session.user.id,
          title,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Project started successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error starting project:', error);
      toast({
        title: "Error",
        description: "Failed to start project. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleStartProject}
        >
          Start Project
        </Button>
      </CardFooter>
    </Card>
  );
}
