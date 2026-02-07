import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingCTA } from './FloatingCTA';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow pt-20">{children}</main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
