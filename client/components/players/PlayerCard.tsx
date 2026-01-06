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
            className="group relative overflow-hidden border transition-all duration-300 hover:border-red-600/50 hover:shadow-lg cursor-pointer bg-card"
            onClick={handleCardClick}
        >
            <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                        <TrendingUp className="w-16 h-16" />
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 space-y-2">
                    <Button
                        variant="secondary"
                        className="w-full h-8 rounded-full text-xs font-bold"
                        onClick={handleExplore}
                        size="sm"
                    >
                        <Search className="w-3 h-3 mr-1" />
                        Explore
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-8 rounded-full text-xs font-bold bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={handleAsk}
                        size="sm"
                    >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Ask
                    </Button>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-red-600 text-white p-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3" />
                    </div>
                </div>
            </div>

            <CardHeader className="p-3 pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold tracking-tight leading-tight">{name}</CardTitle>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                            {role}
                        </p>
                    </div>
                </div>
            </CardHeader>

            {stats && (
                <CardContent className="p-3 pt-0">
                    <div className="grid grid-cols-2 gap-2 mt-2 py-2 border-t">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {stat.label}
                                </span>
                                <span className="text-xs font-bold text-foreground">
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
