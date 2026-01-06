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
    { name: 'Timeline', href: '/timeline', icon: History },
    { name: 'Sources', href: '/sources', icon: Library },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">G</span>
                        </div>
                        <span className="font-bold text-xl hidden md:inline-block">GunnerGPT</span>
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
                                        "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                                        isActive
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Theme Toggle placeholder or other actions */}
                    <div className="text-xs text-muted-foreground hidden sm:block">
                        Pro Dashboard
                    </div>
                </div>
            </div>
        </nav>
    );
}
