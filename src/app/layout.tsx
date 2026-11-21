'use client';

import './globals.css';
import { useState, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CommandPalette } from '@/components/CommandPalette';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>OneAtlas — AI Model Discovery & Intelligence Platform</title>
        <meta
          name="description"
          content="The open intelligence platform to discover, compare, benchmark, and evaluate AI foundation models across labs and inference providers."
        />
      </head>
      <body className="bg-[#060911] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <Suspense fallback={<div className="h-16 border-b border-white/10 bg-[#060911]" />}>
          <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
        </Suspense>
        <main className="flex-1">
          <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading OneAtlas...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
        <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </body>
    </html>
  );
}
