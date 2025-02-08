
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectGenerationDialog({
  open,
  onOpenChange,
}: ProjectGenerationDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const generateProject = async () => {
    if (!session?.user.id) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-project", {
        body: {
          prompt,
          userId: session.user.id,
        },
      });

      if (error) throw error;

      toast({
        title: "Project Generated!",
        description: "Your new project has been added to your dashboard.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error generating project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate project. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Project</DialogTitle>
          <DialogDescription>
            Describe the home improvement project you'd like to create. Our AI will generate a detailed project plan for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Project Description</Label>
            <Input
              id="prompt"
              placeholder="e.g., Install a modern kitchen backsplash"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={generateProject}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isGenerating ? "Generating..." : "Generate Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>);
}
