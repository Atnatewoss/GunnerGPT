'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Box, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
        <div className="relative overflow-hidden py-24 lg:py-32">
            {/* Background patterns */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center mb-6">
                    <Badge variant="outline" className="px-4 py-1.5 border-red-200 bg-red-50/50 text-red-700 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                        <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                        Verifiable Football Intelligence
                    </Badge>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 balance">
                    Explore Arsenal's <br className="hidden md:block" />
                    <span className="text-red-600">Intelligence Layer</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
                    Evidence-based analysis from match statistics, historical records, and
                    tactical archives. No fluff. Just intelligence.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white rounded-full">
                        <Link href="/explore">
                            Begin Exploration
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-8 rounded-full border-2">
                        <Box className="mr-2 w-4 h-4" />
                        View Documentation
                    </Button>
                </div>

                {/* Discovery Language Cues */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t pt-12 text-left opacity-60">
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold mb-1">Retrieval</p>
                        <p className="text-sm font-medium">Deep Neural Search</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold mb-1">Verify</p>
                        <p className="text-sm font-medium">Source Attribution</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold mb-1">Update</p>
                        <p className="text-sm font-medium">Real-time Sync</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-widest font-bold mb-1">Analysis</p>
                        <p className="text-sm font-medium">Multi-modal Insights</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
