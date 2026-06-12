import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-sm">
        <Image
          src="/spt-logo.png"
          alt="Sanghi Pipes & Tubes"
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </div>
      <div>
        <div className="font-black text-xl leading-none tracking-tighter text-foreground group-hover:text-primary transition-colors">
          SANGHI
        </div>
        <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Pipes &amp; Tubes
        </div>
      </div>
    </div>
  );
};
