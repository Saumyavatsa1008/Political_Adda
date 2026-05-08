"use client";

import AdminRoute from "@/components/auth/AdminRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, CheckSquare, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'New Article', href: '/admin/posts/new', icon: PlusCircle },
    { name: 'Manage Polls', href: '/admin/polls', icon: CheckSquare },
    { name: 'Submissions', href: '/admin/submissions', icon: FileText },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md md:h-screen flex-shrink-0 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <Link href="/" className="text-sm text-blue-600 hover:underline block mt-1">
              &larr; Back to Site
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
}
