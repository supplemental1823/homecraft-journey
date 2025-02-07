
import { ProjectCard } from "./ProjectCard";

const FEATURED_PROJECTS = [
  {
    title: "Kitchen Cabinet Refresh",
    description: "Update your kitchen cabinets with a fresh coat of paint and new hardware.",
    difficulty: "Medium" as const,
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80",
  },
  {
    title: "Bathroom Tile Installation",
    description: "Learn how to install new bathroom tiles like a pro.",
    difficulty: "Hard" as const,
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80",
  },
  {
    title: "Wall Painting Basics",
    description: "Master the basics of interior wall painting.",
    difficulty: "Easy" as const,
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80",
  },
];

export function FeaturedSection() {
  return (
    <section className="py-16 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular DIY projects and start transforming your home today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
