// app/(components)/AdminHeader.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ExternalLink, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  User,
  Settings,
  ChevronDown
} from "lucide-react";

export default function AdminHeader({ title = "Dashboard" }: { title?: string }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/logout", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        router.push("/admin/login");
      } else {
        console.error("Logout failed");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="glass-card px-4 sm:px-6 py-4 mb-6 md:mb-8 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:block w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Menu className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button (Desktop) */}
          <button
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-600"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <kbd className="px-2 py-1 bg-white rounded text-xs">⌘K</kbd>
          </button>

          {/* Notifications Button */}
          <button
            className="relative p-2 sm:p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800" />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* View Site Button */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium group"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">View Site</span>
          </Link>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="User Menu"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform hidden sm:block ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                  {/* User Info */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">Admin User</p>
                        <p className="text-xs text-gray-600 truncate">admin@example.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {/* View Site (Mobile) */}
                    <Link
                      href="/"
                      target="_blank"
                      className="sm:hidden flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      onClick={() => setShowDropdown(false)}
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                      <span>View Site</span>
                    </Link>

                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        // Add profile edit functionality here
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-lg transition-colors text-sm text-red-600 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Logging out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          <span>Logout</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Date (only on small screens) */}
      <p className="text-xs text-gray-500 mt-2 sm:hidden">
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })}
      </p>

      {/* Quick Stats Bar (Optional - can be shown on certain pages) */}
      {title === "Dashboard" && (
        <div className="hidden lg:flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">All systems operational</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      )}
    </header>
  );
}