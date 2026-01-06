'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    MessageSquare,
    ArrowUpRight,
    TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
    name: string;
    role: string;
    image?: string;
    stats?: {
        label: string;
        value: string;
    }[];
}

export function PlayerCard({ name, role, image, stats }: PlayerCardProps) {
    const router = useRouter();

    const handleExplore = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/explore?query=${encodeURIComponent(`${name} role and tactical analysis`)}`);
    };

    const handleAsk = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/explore?query=${encodeURIComponent(`Ask about ${name}`)}`);
    };

    const handleCardClick = () => {
        router.push(`/explore?query=${encodeURIComponent(name)}`);
    };

    return (
        <Card
            className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-red-600/50 hover:shadow-xl cursor-pointer bg-card"
            onClick={handleCardClick}
        >
            <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                        <TrendingUp className="w-24 h-24" />
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 space-y-3">
                    <Button
                        variant="secondary"
                        className="w-full h-10 rounded-full font-bold text-xs uppercase tracking-wider"
                        onClick={handleExplore}
                    >
                        <Search className="w-3.5 h-3.5 mr-2" />
                        Explore Role
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-10 rounded-full font-bold text-xs uppercase tracking-wider bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={handleAsk}
                    >
                        <MessageSquare className="w-3.5 h-3.5 mr-2" />
                        Ask About Player
                    </Button>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-red-600 text-white p-1.5 rounded-full">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold tracking-tight">{name}</CardTitle>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                            {role}
                        </p>
                    </div>
                </div>
            </CardHeader>

            {stats && (
                <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-t">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {stat.label}
                                </span>
                                <span className="text-sm font-bold text-foreground">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
