
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedProject } from "@/types/project";
import { capitalizeFirstLetter } from "@/utils/string";

interface ProjectPreviewProps {
  project: GeneratedProject;
}

export function ProjectPreview({ project }: ProjectPreviewProps) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Project Title</h3>
          <p>{project.name}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>

        <div className="flex gap-4">
          <div>
            <h3 className="font-semibold mb-2">Difficulty</h3>
            <Badge
              variant={
                project.difficulty === "beginner"
                  ? "default"
                  : project.difficulty === "intermediate"
                  ? "secondary"
                  : "destructive"
              }
            >
              {capitalizeFirstLetter(project.difficulty)}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Estimated Time</h3>
            <p>{project.estimated_hours} hours</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <Badge variant="outline">{project.category}</Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Tools & Materials Needed</h3>
          <ul className="list-disc pl-4 space-y-1">
            {project.tools_and_materials?.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
}
