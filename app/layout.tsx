// app/layout.tsx
import "./globals.css";
import React from "react";
import Header from "@/app/Header";

export const metadata = {
  title: "icheme genesis ojochegbe",
  description: "Portfolio built with Next.js + Supabase"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-200px)]">{children}</main>

        <footer className="bg-white/50 glass-card border-t border-white/20 mt-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-xs sm:text-sm text-center text-gray-600">
              © {new Date().getFullYear()}Icheme genesis Ojochegbe. Built with Next.js & Supabase.
            </div>
            <div className="text-center mt-4 space-x-4">
              <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-sky-600 transition-colors">Privacy</a>
              <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-sky-600 transition-colors">Terms</a>
              <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-sky-600 transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
