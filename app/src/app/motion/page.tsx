'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';

import { Fade, Scale, Slide, Stagger, StaggerItem } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { spring, type SlideDirection } from '@/lib/motion';
import { cn } from '@/lib/utils';

const DIRECTIONS: SlideDirection[] = ['up', 'down', 'left', 'right'];
const CARDS = ['01', '02', '03', '04', '05', '06'];

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="space-y-6">
      <Slide inView className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </Slide>
      {children}
    </section>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>{children}</div>
  );
}

export default function MotionDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-24 px-6 py-24">
      <Fade className="space-y-3">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back home
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight">Motion</h1>
        <p className="max-w-prose text-muted-foreground">
          Reusable Framer Motion primitives — LazyMotion-powered, tree-shakeable, and reduced-motion
          aware.
        </p>
      </Fade>

      <Section title="Fade" hint="Opacity-only reveal on scroll.">
        <Fade inView>
          <Card>A block that fades in when it enters the viewport.</Card>
        </Fade>
      </Section>

      <Section
        title="Slide"
        hint="Directional slide + fade. Movement is dropped under reduced-motion."
      >
        <div className="grid grid-cols-2 gap-4">
          {DIRECTIONS.map((direction, i) => (
            <Slide key={direction} inView direction={direction} delay={i * 0.05}>
              <Card className="text-center capitalize">{direction}</Card>
            </Slide>
          ))}
        </div>
      </Section>

      <Section title="Scale" hint="Scale + fade reveal.">
        <Scale inView>
          <Card>A block that scales up as it fades in.</Card>
        </Scale>
      </Section>

      <Section title="Staggered cards" hint="Children animate in sequence from one parent.">
        <Stagger inView className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CARDS.map(label => (
            <StaggerItem key={label}>
              <Card className="text-center font-mono text-sm text-muted-foreground">{label}</Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section title="Hover & tap" hint="Gesture animations built on the spring presets.">
        <div className="grid grid-cols-2 gap-4">
          <m.div
            whileHover={{ y: -6, scale: 1.03 }}
            transition={spring.snappy}
            className="cursor-pointer rounded-xl border border-border bg-card p-6 text-center"
          >
            Hover me
          </m.div>
          <m.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={spring.snappy}
            className="rounded-xl border border-border bg-card p-6 text-center"
          >
            Tap me
          </m.button>
        </div>
      </Section>

      <Section title="AnimatePresence" hint="Animate an element as it mounts and unmounts.">
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setOpen(o => !o)}>
            {open ? 'Unmount' : 'Mount'}
          </Button>
          <AnimatePresence initial={false}>
            {open && (
              <m.div
                key="panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring.soft}
                className="overflow-hidden"
              >
                <Card>This panel animates both its mount and its unmount.</Card>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </div>
  );
}
