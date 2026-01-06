import { HeroSection } from "@/components/landing/HeroSection";
import { IntelligenceGrid } from "@/components/landing/IntelligenceGrid";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col space-y-0 pb-16">
      <HeroSection />

      <div className="container mx-auto px-4 -mt-12 mb-12 flex justify-center">
        <div className="bg-background border rounded-full px-6 py-3 shadow-xl flex items-center space-x-6 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>82.4GB Intelligence Indexed</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="hidden sm:flex items-center space-x-2">
            <Activity className="w-4 h-4 text-red-600" />
            <span>Real-time Tactical Sync Active</span>
          </div>
        </div>
      </div>

      <IntelligenceGrid />

      {/* Subtle Discovery CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Ready to verify?</h2>
          <p className="text-muted-foreground">
            Our neural search engine provides direct citations for every analysis,
            ensuring the integrity of your football exploration.
          </p>
          <div className="pt-4 flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground">12k+</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Documents</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground">450+</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Player Profiles</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-foreground">100ms</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Query Latency</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
