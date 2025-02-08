
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectFilters {
  category: string;
  difficulty: string;
}

interface ProjectSearchProps {
  onSearchChange?: (search: string) => void;
  onFiltersChange?: (filters: ProjectFilters) => void;
}

export const ProjectSearch = ({ onSearchChange, onFiltersChange }: ProjectSearchProps) => {
  const [filters, setFilters] = useState<ProjectFilters>({
    category: "all",
    difficulty: "all",
  });

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search projects..."
        className="max-w-xl"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
      <div className="flex gap-4">
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="bathroom">Bathroom</SelectItem>
            <SelectItem value="outdoor">Outdoor</SelectItem>
            <SelectItem value="garage">Garage</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.difficulty}
          onValueChange={(value) => handleFilterChange("difficulty", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
