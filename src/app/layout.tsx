import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { TopProgressBar } from '@/components/TopProgressBar';

export const metadata: Metadata = {
  title: 'SocialFind Intelligence | Descoberta Avançada de Publicações Facebook via Google Dorks',
  description: 'Motor inteligente de pesquisa e inteligência para descoberta de publicações públicas no Facebook utilizando operadores avançados de pesquisa Google (Google Dorks) e filtros temporais rigorosos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="dark">
      <body className="min-h-screen bg-[#060709] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <TopProgressBar />
        {children}
        <Toaster 
          position="bottom-right" 
          theme="dark" 
          toastOptions={{
            style: {
              background: '#0c0f16',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '12px',
            },
          }} 
        />
      </body>
    </html>
  );
}
