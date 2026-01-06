'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    ArrowLeftRight,
    History,
    Library,
    Search
} from 'lucide-react';

const navItems = [
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Players', href: '/players', icon: Users },
    { name: 'Compare', href: '/compare', icon: ArrowLeftRight },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#E30613]/20 bg-[#E30613] text-white">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
                            <span className="text-[#E30613] font-black text-lg">G</span>
                        </div>
                        <span className="font-bold text-xl hidden md:inline-block tracking-tight">GunnerGPT</span>
                    </Link>

                    <div className="flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href === '/explore' && pathname === '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-2 px-3 py-2 rounded-md transition-all font-bold text-sm",
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/20 bg-white/5 hidden sm:block">
                        Technical Build v4.2
                    </div>
                </div>
            </div>
        </nav>
    );
}
