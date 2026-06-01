// src/app/admin/page.tsx
import { db } from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  const [posts, courses, mockTests, users, categories] = await Promise.all([
    db.post.count(),
    db.course.count(),
    db.mockTest.count(),
    db.user.count(),
    db.category.count(),
  ]);
  const publishedPosts = await db.post.count({ where: { status: "PUBLISHED" } });
  return { posts, courses, mockTests, users, categories, publishedPosts };
}

const statCards = (s: Awaited<ReturnType<typeof getStats>>) => [
  {
    label: "Total Posts",
    value: s.posts,
    sub: `${s.publishedPosts} published`,
    href: "/admin/posts",
    gradient: "from-violet-600/20 to-violet-600/5",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/20",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
      </svg>
    ),
    color: "text-violet-400",
  },
  {
    label: "Courses",
    value: s.courses,
    sub: "YouTube embedded",
    href: "/admin/courses",
    gradient: "from-blue-600/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/20",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    color: "text-blue-400",
  },
  {
    label: "Mock Tests",
    value: s.mockTests,
    sub: "NISM · NCFM · Web3",
    href: "/admin/mock-tests",
    gradient: "from-emerald-600/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/20",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    color: "text-emerald-400",
  },
  {
    label: "Users",
    value: s.users,
    sub: "registered members",
    href: "/admin/users",
    gradient: "from-amber-600/20 to-amber-600/5",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/20",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: "text-amber-400",
  },
  {
    label: "Categories",
    value: s.categories,
    sub: "topics & subjects",
    href: "/admin/categories",
    gradient: "from-pink-600/20 to-pink-600/5",
    border: "border-pink-500/20",
    iconBg: "bg-pink-500/20",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    color: "text-pink-400",
  },
];

const quickActions = [
  { label: "New Blog Post", href: "/admin/posts/new", color: "bg-violet-600 hover:bg-violet-500" },
  { label: "New Course", href: "/admin/courses/new", color: "bg-blue-600 hover:bg-blue-500" },
  { label: "New Mock Test", href: "/admin/mock-tests/new", color: "bg-emerald-600 hover:bg-emerald-500" },
  { label: "New Category", href: "/admin/categories/new", color: "bg-pink-600 hover:bg-pink-500" },
];

export default async function AdminDashboard() {
  const stats = await getStats();
  const cards = statCards(stats);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Welcome back, Mustak. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`relative rounded-xl border ${card.border} bg-gradient-to-br ${card.gradient} p-5 hover:scale-[1.02] transition-transform`}
          >
            <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center mb-4 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm font-medium text-white/70 mt-0.5">{card.label}</p>
            <p className="text-xs text-white/30 mt-1">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.color} text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div>
        <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">Recent Posts</h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-white/30 text-sm">No posts yet. Create your first post to get started.</p>
          <Link
            href="/admin/posts/new"
            className="inline-block mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            Create first post →
          </Link>
        </div>
      </div>
    </div>
  );
}