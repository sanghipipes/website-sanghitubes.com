import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/sanghi-logo.jpeg"
      alt="Sanghi Pipes and Tubes"
      width={200}
      height={200}
      className={cn("h-16 w-auto object-contain", className)}
      priority
    />
  );
};
