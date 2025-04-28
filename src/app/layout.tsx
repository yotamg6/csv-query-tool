import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "SQL on CSV App",
  description: "Run SQL queries on public CSV files",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
