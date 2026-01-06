import { ComparisonPanel } from '@/components/compare/ComparisonPanel';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft } from 'lucide-react';

export default function ComparePage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col h-[calc(100vh-50px)] space-y-4 animate-in fade-in duration-700">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-3">
                        <div className="bg-red-600 text-white p-2 rounded-lg">
                            <ArrowRightLeft className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Intelligence Cross-Reference</h1>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                                Symmetric Analysis Engine
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="h-6 font-bold tracking-widest border-red-200 text-red-600 px-3">
                        DUAL-MODE ACTIVE
                    </Badge>
                </div>

                <div className="flex-1 flex border rounded-2xl overflow-hidden bg-card/50 shadow-2xl divide-x-2 divide-red-600/10">
                    <div className="flex-1 min-w-0">
                        <ComparisonPanel
                            side="left"
                            placeholder="e.g. Bukayo Saka 2023 performance"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <ComparisonPanel
                            side="right"
                            placeholder="e.g. Gabriel Martinelli 2023 performance"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
