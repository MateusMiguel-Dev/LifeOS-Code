import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIFE OS — Personal Command Center",
  description: "Seu espaço para organizar a vida, com clareza e intenção.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}