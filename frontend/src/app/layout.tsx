import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { HelpChatWidget } from "@/components/HelpChatWidget";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Eligibility Verification",
  description: "Hospital admin UI for patient eligibility verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#0e0e10] text-[#f5f5f7] antialiased font-[var(--font-inter)]">

        {/* ── Global video background ───────────────────────────── */}
        <div className="fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
          <video
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-[0.85]"
          />
          {/* Glassy dark overlay */}
          <div className="absolute inset-0 bg-[#0e0e10]/50 backdrop-blur-[16px]" />
          {/* Dark vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0e0e10]" />
          {/* Subtle radial glow — top center */}
          <div className="absolute inset-x-0 top-0 mx-auto h-[600px] max-w-[800px] bg-[radial-gradient(ellipse_at_top,rgba(10,132,255,0.18),transparent_65%)]" />
        </div>

        {/* ── App shell ─────────────────────────────────────────── */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <NavBar />
          <div className="flex-1">{children}</div>
          <HelpChatWidget />
        </div>

      </body>
    </html>
  );
}
