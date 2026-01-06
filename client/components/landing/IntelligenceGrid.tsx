'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Users,
    GitBranch,
    Trophy,
    Zap,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";

const modules = [
    {
        title: "Squad Evolution",
        description: "Deep dive into career trajectories and impact metrics of the Arteta era squad.",
        icon: Users,
        href: "/players",
        color: "bg-red-600",
        discovery: "Profile Development"
    },
    {
        title: "Tactical Patterns",
        description: "Deconstruct transition phases and pressing structures established by Mikel Arteta.",
        icon: GitBranch,
        href: "/compare",
        color: "bg-red-600",
        discovery: "System Archetypes"
    },
    {
        title: "Project Milestones",
        description: "Relive strategic pivots and pivotal transitions through the technical project.",
        icon: Trophy,
        href: "/explore",
        color: "bg-red-600",
        discovery: "Strategic Growth"
    },
    {
        title: "Direct Analytics",
        description: "Query the core intelligence layer for direct insights into technical decisions.",
        icon: Zap,
        href: "/explore",
        color: "bg-red-600",
        discovery: "Intelligence Scanning"
    }
];

export function IntelligenceGrid() {
    return (
        <section className="py-24 bg-background border-t">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <Link key={module.title} href={module.href} className="group">
                                <Card className="h-full border-white/5 bg-card/10 hover:bg-card/30 transition-all duration-300 rounded-2xl overflow-hidden group-hover:border-red-600/30">
                                    <CardHeader className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center">
                                                <Icon className="w-4 h-4 text-red-600" />
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <CardTitle className="text-base font-bold tracking-tight mb-2">
                                            {module.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-2">
                                            {module.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="px-6 pb-6">
                                        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-red-600">
                                            <div className="h-px w-3 bg-red-600" />
                                            <span>{module.discovery}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
