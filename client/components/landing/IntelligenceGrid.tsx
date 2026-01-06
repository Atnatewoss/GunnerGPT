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
    Trophy,
    GitBranch,
    Zap,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";

const modules = [
    {
        title: "Players",
        description: "Deep dive into career trajectories, impact metrics, and performance consistency.",
        icon: Users,
        href: "/players",
        color: "bg-blue-500",
        discovery: "Analyzing Career Arcs"
    },
    {
        title: "Tactics",
        description: "Deconstruct transition phases, pressing structures, and positional hierarchies.",
        icon: GitBranch,
        href: "/compare",
        color: "bg-purple-500",
        discovery: "Decrypting Game Patterns"
    },
    {
        title: "Seasons",
        description: "Relive campaigns through data-rich archives and defining historical records.",
        icon: Trophy,
        href: "/timeline",
        color: "bg-amber-500",
        discovery: "Indexing Historical Peaks"
    },
    {
        title: "Arteta",
        description: "Track the evolution of the technical project and tactical milestones.",
        icon: Zap,
        href: "/explore",
        color: "bg-red-500",
        discovery: "Tracing Philosophy Evolution"
    }
];

export function IntelligenceGrid() {
    return (
        <section className="py-24 bg-card/20 border-y">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Intelligence Nodes</h2>
                    <p className="text-muted-foreground text-center max-w-xl">
                        Select an entry point to begin your exploration. Each node provides a unique
                        vector into the Arsenal knowledge base.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        return (
                            <Link key={module.title} href={module.href} className="group flex">
                                <Card className="relative overflow-hidden flex-1 border-2 transition-all duration-300 group-hover:border-red-600/50 group-hover:shadow-lg group-hover:-translate-y-1">
                                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                        <Icon className="w-24 h-24" />
                                    </div>

                                    <CardHeader>
                                        <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center mb-4`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <CardTitle className="text-xl flex items-center justify-between">
                                            {module.title}
                                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </CardTitle>
                                        <CardDescription className="text-sm leading-relaxed min-h-[60px]">
                                            {module.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="h-1 w-4 bg-red-600 animate-pulse" />
                                            <span>{module.discovery}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
