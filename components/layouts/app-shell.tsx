"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  userDisplayName: string;
  businessName?: string;
  role: string;
  sidebar: React.ReactNode;
}

export function AppShell({
  children,
  userDisplayName,
  businessName,
  role,
  sidebar,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <Link href="/" className="text-xl font-bold text-brand-600">
            BizChat CRM
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">{sidebar}</nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
          <button
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900">{userDisplayName}</p>
              {businessName && (
                <p className="text-xs text-gray-500">{businessName}</p>
              )}
            </div>
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 capitalize">
              {role.replace("_", " ")}
            </span>
            <LogoutButton />
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
