import { PlayerCard } from '@/components/players/PlayerCard';

const players = [
    {
        name: "David Raya",
        role: "Goalkeeper",
        image: "/players/david_raya.webp",
        stats: [
            { label: "Distribution", value: "Elite" },
            { label: "Clean Sheets", value: "12" }
        ]
    },
    {
        name: "William Saliba",
        role: "Central Defender",
        image: "/players/saliba.png",
        stats: [
            { label: "Recovery", value: "92%" },
            { label: "Duels Won", value: "74%" }
        ]
    },
    {
        name: "Gabriel Magalhães",
        role: "Central Defender",
        image: "/players/gabriel_magalhães.avif",
        stats: [
            { label: "Aerial Wins", value: "88%" },
            { label: "Tackles", value: "2.1" }
        ]
    },
    {
        name: "Ben White",
        role: "Right Back",
        image: "/players/ben_white.avif",
        stats: [
            { label: "Ball Progression", value: "High" },
            { label: "Cross Accuracy", value: "76%" }
        ]
    },
    {
        name: "Martin Ødegaard",
        role: "Creative Midfielder",
        image: "/players/odegaard.avif",
        stats: [
            { label: "Vision", value: "Elite" },
            { label: "xA p90", value: "0.42" }
        ]
    },
    {
        name: "Declan Rice",
        role: "Box-to-Box Midfielder",
        image: "/players/rice.webp",
        stats: [
            { label: "Coverage", value: "12.4km" },
            { label: "Interceptions", value: "3.2" }
        ]
    },
    {
        name: "Bukayo Saka",
        role: "Right Winger",
        image: "/players/saka.webp",
        stats: [
            { label: "1v1 Success", value: "58%" },
            { label: "Goal Contributions", value: "18" }
        ]
    },
    {
        name: "Gabriel Martinelli",
        role: "Left Winger",
        image: "/players/martinelli.webp",
        stats: [
            { label: "Dribble Success", value: "62%" },
            { label: "Goals", value: "8" }
        ]
    },
    {
        name: "Kai Havertz",
        role: "Attacking Midfielder",
        image: "/players/kai_havertz.webp",
        stats: [
            { label: "Pressing", value: "High" },
            { label: "Aerial Wins", value: "71%" }
        ]
    },
    {
        name: "Leandro Trossard",
        role: "Forward/Winger",
        image: "/players/leandro_trossard.avif",
        stats: [
            { label: "Versatility", value: "Elite" },
            { label: "Assists", value: "6" }
        ]
    }
];

export default function PlayersPage() {
    return (
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-60px)] flex flex-col animate-in fade-in duration-500">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {players.map((player) => (
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
