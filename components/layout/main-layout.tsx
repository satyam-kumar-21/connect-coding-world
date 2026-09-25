'use client';

import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
