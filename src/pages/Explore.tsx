
import { TrendingBlueprints } from "@/components/explore/TrendingBlueprints";
import { AllBlueprints } from "@/components/explore/AllBlueprints";

const Explore = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Trending Section */}
      <section className="mb-12">
        <TrendingBlueprints />
      </section>

      {/* All Blueprints Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Explore Projects</h2>
        <AllBlueprints />
      </section>
    </div>
  );
};

export default Explore;
