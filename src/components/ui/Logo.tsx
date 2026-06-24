import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/sanghi-logo.png"
      alt="Sanghi Pipes and Tubes"
      width={160}
      height={160}
      className={cn("h-12 w-auto object-contain", className)}
      priority
    />
  );
};
