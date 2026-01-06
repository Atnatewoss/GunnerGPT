'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Box, ShieldCheck, Database } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1599818816694-857c7c34f07a?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto backdrop-blur-md bg-background/30 border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-in fade-in zoom-in duration-1000">
                    <div className="flex justify-center mb-8">
                        <Badge variant="outline" className="px-4 py-1.5 border-white/20 bg-white/5 text-white backdrop-blur-sm font-bold tracking-[0.2em] uppercase text-[10px]">
                            <ShieldCheck className="w-3.5 h-3.5 mr-2 text-red-500" />
                            Verifiable Intel
                        </Badge>
                    </div>

                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white balance leading-[1.1]">
                            Arsenal <br />
                            <span className="text-red-500">Intelligence</span>
                        </h1>

                        <p className="max-w-xl mx-auto text-lg text-white/80 leading-relaxed font-medium">
                            Tactical and squad evolution under <span className="text-white">Mikel Arteta</span> (2019–2024).
                            Evidence-based analysis from the core intelligence layer.
                        </p>

                        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="h-14 px-10 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-base shadow-xl shadow-red-600/20 transition-all hover:scale-105">
                                <Link href="/explore">
                                    Begin Analysis
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Minimalist Metadata */}
                    <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 border-t border-white/10 pt-10">
                        <div className="flex items-center space-x-3">
                            <Database className="w-4 h-4 text-red-500" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest font-black text-white/40">Knowledge Base</p>
                                <p className="text-xs font-bold text-white/90">@[arsenal_kb]</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Box className="w-4 h-4 text-red-500" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase tracking-widest font-black text-white/40">Scope</p>
                                <p className="text-xs font-bold text-white/90">2019 — 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
