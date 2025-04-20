import { FetchedStatsProvider } from '@/script/state/context/FetchedStatsContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FetchedStatsProvider>
          {children}
        </FetchedStatsProvider>
      </body>
    </html>
  );
} 