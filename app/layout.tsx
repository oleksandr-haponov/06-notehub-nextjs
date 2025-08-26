import type { Metadata } from "next";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Notes manager built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <TanStackProvider>{children}</TanStackProvider>
        <Footer />
      </body>
    </html>
  );
}
