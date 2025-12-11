// app/(components)/AdminSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { 
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  User
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: FolderKanban,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      name: "Upload CV",
      href: "/admin/cv",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    }
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Toggle Menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40
          w-72 h-screen bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
              <p className="text-xs text-gray-500">Manage your portfolio</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${active 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${active ? 'bg-white/20' : `${item.bgColor} group-hover:scale-110`}
                  `}>
                    <item.icon className={`
                      w-5 h-5 transition-colors
                      ${active ? 'text-white' : item.color}
                    `} />
                  </div>
                  
                  <span className="flex-1 font-medium text-sm">
                    {item.name}
                  </span>

                  {active && (
                    <ChevronRight className="w-4 h-4 text-white" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200"></div>

          {/* View Portfolio Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg bg-green-50 group-hover:scale-110 transition-transform">
              <Home className="w-5 h-5 text-green-600" />
            </div>
            <span className="flex-1 font-medium text-sm">View Portfolio</span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          </Link>
        </nav>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left font-medium text-sm">Logout</span>
          </button>

          {/* Admin Info */}
          <div className="mt-3 px-4 py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-gray-700">Admin Active</span>
            </div>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </aside>
    </>
  );
}