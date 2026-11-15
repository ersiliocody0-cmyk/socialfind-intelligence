import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { TopProgressBar } from '@/components/TopProgressBar';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { ThemeProvider } from '@/context/ThemeContext';
import { SmoothScrollProvider } from '@/context/SmoothScrollProvider';

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
    <html lang="pt" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('sf_theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#060709] text-slate-100 dark:bg-[#060709] dark:text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-300">
        <ThemeProvider>
          <SmoothScrollProvider>
            <ScrollProgressBar />
            <TopProgressBar />
            {children}
            <Toaster 
              position="bottom-right" 
              theme="system" 
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  fontSize: '12px',
                },
              }} 
            />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
