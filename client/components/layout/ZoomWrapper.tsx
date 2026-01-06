'use client';

import { usePathname } from 'next/navigation';

interface ZoomWrapperProps {
  children: React.ReactNode;
}

export function ZoomWrapper({ children }: ZoomWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  return (
    <main 
      className="flex-1"
      style={!isHomePage ? { 
        transform: 'scale(0.9)', 
        transformOrigin: 'top left',
        width: '111.11%', // Compensate for the scale to prevent empty space
        height: '111.11%' // Compensate for the scale to prevent empty space
      } : {}}
    >
      {children}
    </main>
  );
}
