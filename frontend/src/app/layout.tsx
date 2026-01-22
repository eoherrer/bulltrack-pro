import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@/components/providers/ApolloProvider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bulltrack Pro - Genetic Ranking Platform",
  description: "Advanced bovine genetic ranking platform for cattle producers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-gray-950 text-white`} suppressHydrationWarning>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
