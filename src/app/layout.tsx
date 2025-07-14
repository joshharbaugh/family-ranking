import "@/app/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/providers/auth";
import { Header } from "@/app/ui/header";
import { Navigation } from "@/app/ui/navigation";
// import { WebVitals } from "@/app/_components/web-vitals";

export const metadata: Metadata = {
  title: "FamRank",
  description: "Your family's entertainment story",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        {/* <WebVitals /> */}
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            <Header />
            <Navigation />

            <main className="max-w-6xl mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
