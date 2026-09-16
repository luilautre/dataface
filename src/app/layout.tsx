import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "DataFace - Réseau social + Bases de données",
  description: "Interface style Facebook avec bases de données publiques et personnelles type Excel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-facebook-gray min-h-screen">
        <Header />
        <main className="max-w-6xl mx-auto pt-16 px-4">{children}</main>
      </body>
    </html>
  );
}
