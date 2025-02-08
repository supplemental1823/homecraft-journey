
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProjectFormProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ProjectForm({ prompt, onPromptChange, onGenerate, isGenerating }: ProjectFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="prompt">Project Description</Label>
        <Input
          id="prompt"
          placeholder="e.g., Install a modern kitchen backsplash"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
      </div>
      <Button
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isGenerating ? "Generating..." : "Generate Project"}
      </Button>
    </div>
  );
}
