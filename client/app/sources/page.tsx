export default function SourcesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Intelligence Sources</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                    { name: "Official Match Reports", status: "Synced" },
                    { name: "Player Performance Data", status: "Live" },
                    { name: "Club Documentation", status: "Draft" },
                    { name: "Tactical Analysis Archive", status: "Synced" },
                ].map((source, i) => (
                    <div key={i} className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{source.name}</h3>
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] uppercase font-bold tracking-wider">
                                {source.status}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Comprehensive access to {source.name.toLowerCase()} with high-fidelity retrieval.
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
