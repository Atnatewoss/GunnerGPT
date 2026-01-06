'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    Box,
    ShieldCheck,
    Database,
    Users,
    GitBranch,
    Trophy,
    Zap,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const modules = [
    {
        title: "Squad Evolution",
        description: "Arteta era trajectories.",
        icon: Users,
        href: "/players",
    },
    {
        title: "Tactical Patterns",
        description: "System archetypes.",
        icon: GitBranch,
        href: "/compare",
    },
    {
        title: "Project Milestones",
        description: "Strategic growth pivots.",
        icon: Trophy,
        href: "/explore",
    },
    {
        title: "Direct Analytics",
        description: "Intelligence layer access.",
        icon: Zap,
        href: "/explore",
    }
];

export function HeroSection() {
    return (
        <div className="relative h-[calc(100vh-64px)] w-full flex flex-col justify-between overflow-hidden bg-white text-black px-6">
            {/* Full-width Background Image with Light Overlay */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    backgroundImage: 'url("/stadium.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Subtle Light Overlay for branding contrast */}
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            </div>

            {/* Top/Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto pt-10">
                <div className="space-y-6 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="flex justify-center mb-6">
                        <Badge variant="outline" className="px-4 py-1.5 border-[#E30613]/20 bg-[#E30613]/5 text-[#E30613] font-black tracking-[0.3em] uppercase text-[10px]">
                            <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                            Tactical Intelligence
                        </Badge>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter balance leading-[0.85] uppercase text-[#E30613]">
                        GUNNERGPT
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-black/70 leading-relaxed font-medium">
                        The definitive technical archive for the <span className="text-[#E30613] font-black italic">Mikel Arteta Project</span>.
                        Verifiable tactical benchmarks and squad evolution.
                    </p>

                    <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button asChild size="lg" className="h-16 px-12 bg-[#E30613] hover:bg-[#BE2632] text-white rounded-none font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                            <Link href="/explore">
                                START EXPLORATION
                                <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Integrated Intelligence Nodes (Bottom Grid) */}
            <div className="w-full max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {modules.map((module, i) => {
                        const Icon = module.icon;
                        return (
                            <Link key={i} href={module.href} className="group">
                                <div className="h-full bg-white border border-[#E30613]/10 p-6 hover:bg-[#E30613]/5 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md">
                                    <div className="absolute top-0 left-0 w-1 h-0 bg-[#E30613] group-hover:h-full transition-all duration-300" />
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-8 h-8 rounded bg-[#E30613]/10 flex items-center justify-center group-hover:bg-[#E30613] transition-colors">
                                            <Icon className="w-4 h-4 text-[#E30613] group-hover:text-white" />
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-[#E30613]/20 group-hover:text-[#E30613] transition-all" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-tight text-black mb-1 group-hover:text-[#E30613]">
                                        {module.title}
                                    </h3>
                                    <p className="text-[10px] text-black/50 font-bold uppercase tracking-wider">
                                        {module.description}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
