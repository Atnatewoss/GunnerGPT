export default function TimelinePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Arsenal Timeline</h1>
            </div>
            <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border">
                {[
                    { date: "Oct 2025", event: "Arteta reaches 300 games managed" },
                    { date: "Aug 2025", event: "New stadium sponsorship announced" },
                    { date: "May 2025", event: "Premier League Season Finale" },
                ].map((item, i) => (
                    <div key={i} className="relative pl-10">
                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-background bg-red-600" />
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm font-semibold text-muted-foreground">{item.date}</span>
                            <span className="font-medium">{item.event}</span>
                        </div>
                    </div>
                ))}
                <div className="pl-10 text-muted-foreground italic text-sm">
                    Loading more historical data...
                </div>
            </div>
        </div>
    );
}
