
export interface GeneratedProject {
  name: string;
  description: string;
  tools_and_materials: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number;
  category: string;
  tasks: {
    title: string;
    description: string;
    order_index: number;
  }[];
}
