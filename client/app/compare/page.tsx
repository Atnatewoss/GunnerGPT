export default function ComparePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Comparison Engine</h1>
            </div>
            <div className="rounded-xl border border-dashed bg-card/50 min-h-[500px] flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                    <p className="font-medium">Selected Subjects for Comparison</p>
                    <p className="text-sm">Add players or seasonal data to begin analysis</p>
                </div>
            </div>
        </div>
    );
}
