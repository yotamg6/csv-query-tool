import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

export const metadata = {
  title: 'SQL on CSV App',
  description: 'Run SQL queries on public CSV files',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
