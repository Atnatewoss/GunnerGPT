import { HeroSection } from "@/components/landing/HeroSection";

export default function LandingPage() {
  return (
    <div className="relative h-[calc(100vh-48px)] w-full overflow-hidden">
      {/* Root Background Image */}
      <div
        className="absolute inset-0 -z-10 bg-white"
        style={{
          backgroundImage: 'url("/stadium.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Subtle Light Overlay for branding contrast */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
      </div>

      <HeroSection />
    </div>
  );
}
