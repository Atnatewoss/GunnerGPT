import { PlayerCard } from '@/components/players/PlayerCard';

const starters = [
    {
        name: "Martin Ødegaard",
        role: "Creative Engine / Captain",
        stats: [
            { label: "Vision", value: "Elite" },
            { label: "xA p90", value: "0.42" }
        ]
    },
    {
        name: "Bukayo Saka",
        role: "Inverted Winger",
        stats: [
            { label: "1v1 Success", value: "58%" },
            { label: "Impact", value: "High" }
        ]
    },
    {
        name: "William Saliba",
        role: "Central Defender",
        stats: [
            { label: "Recovery", value: "92%" },
            { label: "Duels Won", value: "74%" }
        ]
    },
    {
        name: "Declan Rice",
        role: "Box-to-Box Midfielder",
        stats: [
            { label: "Coverage", value: "12.4km" },
            { label: "Interceptions", value: "3.2" }
        ]
    }
];

export default function PlayersPage() {
    return (
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">First Team Squad</h1>
                    <p className="text-muted-foreground mt-2">
                        Intelligence-driven profiles for the current Arsenal starters.
                    </p>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    Last Sync: Today 14:00
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {starters.map((player) => (
                        <PlayerCard key={player.name} {...player} />
                    ))}
                </div>

                <div className="rounded-2xl border bg-card/50 p-12 shadow-sm text-center space-y-4">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-xl font-bold">Deep Archive Syncing</h2>
                        <p className="text-muted-foreground text-sm mt-2">
                            We are currently indexing historical player data from the 2003/04 Invincibles era
                            and the 90s defensive records. Full squad availability expected in 14h.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
