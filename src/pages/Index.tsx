
import { Button } from "@/components/ui/button";
import { FeaturedSection } from "@/components/FeaturedSection";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-brand-100" />
        <div className="relative z-10 text-center px-6 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Home Projects,{" "}
            <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plan, track, and complete your DIY home improvement projects with confidence.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Explore Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <FeaturedSection />

      {/* How It Works */}
      <section className="py-16 px-6 bg-brand-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Choose a Project",
                description: "Browse our curated collection of DIY projects.",
              },
              {
                title: "Follow the Guide",
                description: "Step-by-step instructions and material lists.",
              },
              {
                title: "Track Progress",
                description: "Monitor your progress and share your success.",
              },
            ].map((step, i) => (
              <div key={i} className="p-6 glass-card rounded-lg">
                <div className="text-4xl font-bold text-primary mb-4">{i + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
