import { HeroSection } from "@/components/landing/HeroSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-white">
      <HeroSection />
    </div>
  );
}
