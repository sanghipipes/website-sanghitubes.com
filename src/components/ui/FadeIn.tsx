'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  fullWidth?: boolean;
  className?: string;
  blur?: boolean;
  scale?: boolean;
  once?: boolean;
}

const directionOffsets = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
  none: {},
};

export const FadeIn = ({
  children,
  delay = 0,
  direction = 'up',
  fullWidth = false,
  className,
  blur = true,
  scale = false,
  once = true,
}: FadeInProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffsets[direction],
        ...(blur ? { filter: 'blur(8px)' } : {}),
        ...(scale ? { scale: 0.97 } : {}),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        ...(blur ? { filter: 'blur(0px)' } : {}),
        ...(scale ? { scale: 1 } : {}),
      }}
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(fullWidth ? 'w-full' : '', className)}
    >
      {children}
    </motion.div>
  );
};
