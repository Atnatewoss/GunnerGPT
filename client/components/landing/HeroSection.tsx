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
        <div className="relative h-full w-full flex flex-col justify-between px-6 pt-4 pb-8">
            {/* Top/Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                <div className="space-y-4 animate-in fade-in slide-in-from-top-6 duration-1000">
                    <div className="flex justify-center mb-2">
                        <Badge variant="outline" className="px-3 py-1 border-[#E30613]/30 bg-[#E30613]/5 text-[#E30613] font-bold tracking-[0.3em] uppercase text-[9px]">
                            <ShieldCheck className="w-3 h-3 mr-1.5" />
                            Tactical Intelligence
                        </Badge>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter balance leading-[0.8] uppercase text-[#E30613] drop-shadow-sm">
                        GUNNERGPT
                    </h1>

                    <p className="max-w-xl mx-auto text-lg md:text-xl text-black/80 leading-snug font-bold tracking-tight">
                        The definitive technical archive for the <span className="text-[#E30613] italic">Mikel Arteta Project</span>.
                        Verifiable tactical benchmarks and squad evolution.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="h-12 px-8 bg-[#E30613] hover:bg-[#BE2632] text-white rounded-none font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 group border-b-2 border-black/20">
                            <Link href="/explore">
                                START EXPLORATION
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Integrated Intelligence Nodes (Bottom Grid) */}
            <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {modules.map((module, i) => {
                        const Icon = module.icon;
                        return (
                            <Link key={i} href={module.href} className="group">
                                <div className="h-full bg-white/80 backdrop-blur-sm border border-[#E30613]/10 p-4 hover:bg-[#E30613]/5 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md">
                                    <div className="absolute top-0 left-0 w-0.5 h-0 bg-[#E30613] group-hover:h-full transition-all duration-300" />
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-6 h-6 rounded bg-[#E30613]/10 flex items-center justify-center group-hover:bg-[#E30613] transition-colors">
                                            <Icon className="w-3 h-3 text-[#E30613] group-hover:text-white" />
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 text-[#E30613]/20 group-hover:text-[#E30613] transition-all" />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-tight text-black mb-0.5 group-hover:text-[#E30613]">
                                        {module.title}
                                    </h3>
                                    <p className="text-[9px] text-black/50 font-bold uppercase tracking-wider">
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
