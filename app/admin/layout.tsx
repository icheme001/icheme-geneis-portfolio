// app/admin/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import AdminSidebar from "../(components)/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide sidebar on login page
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="flex min-h-screen">
      {/* Only show sidebar if NOT on login page */}
      {!isLoginPage && <AdminSidebar />}
      
      {/* Main Content */}
      <main className={`flex-1 ${isLoginPage ? 'w-full' : ''}`}>
        {children}
      </main>
    </div>
  );
}