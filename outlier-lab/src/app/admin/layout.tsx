"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "⊞" },
  { label: "Posts", href: "/admin/posts", icon: "📄" },
  { label: "Courses", href: "/admin/courses", icon: "🎓" },
  { label: "Mock Tests", href: "/admin/mock-tests", icon: "✅" },
  { label: "Categories", href: "/admin/categories", icon: "📁" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Comments", href: "/admin/comments", icon: "💬" },
];

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300"
      style={{ width: collapsed ? "68px" : "220px", background: "rgba(8,8,20,0.98)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="14" cy="14" r="3" fill="white"/>
          </svg>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-white">Outlier Lab</p>
            <p className="text-[10px] text-white/30">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
              style={{
                color: isActive ? "white" : "rgba(255,255,255,0.45)",
                background: isActive ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.15))" : "transparent",
                borderLeft: isActive ? "2px solid rgba(139,92,246,0.8)" : "2px solid transparent",
              }}>
              <span className="flex-shrink-0 text-base">{item.icon}</span>
              {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-white/[0.06] space-y-1">
        <button onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-all text-sm">
          <span>{collapsed ? "→" : "←"}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/70 hover:text-red-300 hover:bg-red-500/[0.08] transition-all text-sm">
          <span>⎋</span>
          {!collapsed && <span>Disconnect</span>}
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#080810]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="transition-all duration-300" style={{ marginLeft: collapsed ? "68px" : "220px", minHeight: "100vh" }}>
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,20,0.8)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/30">Admin · Connected</span>
          </div>
          <span className="text-xs text-white/20 font-mono">0x8bc4...711fa</span>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}