'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid hydration issues with localStorage
const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-float">🦆</div>
        <h1 className="font-display font-bold text-3xl text-cream-100 mb-2">
          Canards
        </h1>
        <p className="text-cream-300/50">Chargement de votre sanctuaire...</p>
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-lake-400 animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-lake-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-lake-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Dashboard />;
}
