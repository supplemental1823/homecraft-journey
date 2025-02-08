
import { ProjectSearch } from "@/components/explore/ProjectSearch";
import { TrendingBlueprints } from "@/components/explore/TrendingBlueprints";
import { AllBlueprints } from "@/components/explore/AllBlueprints";

const Explore = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      
      {/* Trending Section */}
      <section className="mb-12">
        <TrendingBlueprints />
      </section>

      {/* Search and Filters Section */}
      <section className="mb-12">
        <ProjectSearch />
      </section>

      {/* All Blueprints Section */}
      <section>
        <AllBlueprints />
      </section>
    </div>
  );
};

export default Explore;
