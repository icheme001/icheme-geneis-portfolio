// app/(components)/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-card shadow-xl border-b border-white/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 sm:py-4">
        {/* Logo with Image */}
        <Link
          href="/"
          className="relative group flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105"
          onClick={closeMenu}
        >
          {/* Logo Image */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500 transition-all duration-300">
            <Image
              src="/images/logo2.png" // Change this to your logo path
              alt="Logo"
              fill
              className="object-cover"
              priority
            />
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Animated underline */}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-500"></span>
        </Link>

        {/* Desktop Navigation with 3D Effects */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            href="/"
            className="relative px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-purple-600 rounded-lg transition-all duration-300 hover-lift group overflow-hidden"
          >
            <span className="relative z-10">Home</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
          </Link>

          <Link
            href="/projects"
            className="relative px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-purple-600 rounded-lg transition-all duration-300 hover-lift group overflow-hidden"
          >
            <span className="relative z-10">Projects</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
          </Link>

          <Link
            href="/contact"
            className="relative px-4 py-2 text-sm lg:text-base text-gray-700 hover:text-purple-600 rounded-lg transition-all duration-300 hover-lift group overflow-hidden"
          >
            <span className="relative z-10">Contact</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
          </Link>

          <Link
            href="/admin/login"
            className="ml-4 px-5 py-2 rounded-lg text-sm lg:text-base font-semibold btn-primary ripple shimmer"
          >
            Me
          </Link>
        </nav>

        {/* Mobile Menu Button with Smooth Animation */}
        <button
          type="button"
          className="md:hidden p-2.5 hover:bg-purple-50 rounded-lg transition-all duration-300 hover-scale relative group"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          title="Toggle navigation menu"
        >
          <div className="relative w-6 h-6">
            {/* Animated Menu Icon */}
            <span
              className={`absolute inset-0 transition-all duration-300 ${
                isOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
              }`}
            >
              <Menu className="w-6 h-6 text-purple-600" />
            </span>
            <span
              className={`absolute inset-0 transition-all duration-300 ${
                isOpen ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
              }`}
            >
              <X className="w-6 h-6 text-purple-600" />
            </span>
          </div>
          {/* Pulse effect on menu button */}
          <span className="absolute inset-0 rounded-lg bg-purple-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></span>
        </button>
      </div>

      {/* Mobile Navigation with 3D Slide In */}
      <div
        className={`md:hidden border-t border-white/20 bg-white/90 backdrop-blur-xl overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 space-y-2">
          <Link
            href="/"
            className="block px-4 py-3 text-gray-700 hover:text-purple-600 rounded-lg transition-all duration-300 hover-lift relative overflow-hidden group"
            onClick={closeMenu}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 group-hover:scale-150 transition-transform duration-300"></span>
              Home
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </Link>

          <Link
            href="/projects"
            className="block px-4 py-3 text-gray-700 hover:text-purple-600 rounded-lg transition-all duration-300 hover-lift relative overflow-hidden group"
            onClick={closeMenu}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 group-hover:scale-150 transition-transform duration-300"></span>
              Projects
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </Link>

          <Link
            href="/contact"
            className="block px-4 py-3 text-gray-700 hover:text-purple-600 rounded-lg transition-all duration-300 hover-lift relative overflow-hidden group"
            onClick={closeMenu}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 group-hover:scale-150 transition-transform duration-300"></span>
              Contact
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </Link>

          <div className="pt-2">
            <Link
              href="/admin/login"
              className="block px-4 py-3 rounded-lg text-sm font-semibold btn-primary w-full text-center ripple shimmer"
              onClick={closeMenu}
            >
              My Domain
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
