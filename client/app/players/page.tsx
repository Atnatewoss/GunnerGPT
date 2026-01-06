import { Navbar } from '@/components/layout/Navbar';

export default function PlayersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Player Analytics</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Squad Value</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">€1.12B</div>
                        <p className="text-xs text-muted-foreground">+4.5% from last month</p>
                    </div>
                </div>
                {/* Placeholder cards */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border bg-card text-card-foreground shadow h-32 animate-pulse" />
                ))}
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="text-muted-foreground text-center space-y-2">
                    <p className="font-semibold text-lg">Detailed Stats Module Locked</p>
                    <p className="text-sm max-w-[250px]">Data synchronization with Arsenal Database in progress...</p>
                </div>
            </div>
        </div>
    );
}
