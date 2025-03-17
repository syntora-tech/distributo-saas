// app/layout.tsx
import "./globals.css";
import Header from "./Header";
import Providers from "./providers";

export const metadata = {
  title: "Superblog",
  description: "A blog app using Next.js and Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
