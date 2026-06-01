import Link from "next/link";
import { db } from "@/lib/prisma";

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

export default async function AdminDashboard() {
  const s = await getStats();

  const cards = [
    { label: "Total Posts", value: s.posts, sub: `${s.publishedPosts} published`, href: "/admin/posts", color: "from-violet-600/20", border: "border-violet-500/20", text: "text-violet-400" },
    { label: "Courses", value: s.courses, sub: "YouTube embedded", href: "/admin/courses", color: "from-blue-600/20", border: "border-blue-500/20", text: "text-blue-400" },
    { label: "Mock Tests", value: s.mockTests, sub: "NISM · NCFM · Web3", href: "/admin/mock-tests", color: "from-emerald-600/20", border: "border-emerald-500/20", text: "text-emerald-400" },
    { label: "Users", value: s.users, sub: "registered members", href: "/admin/users", color: "from-amber-600/20", border: "border-amber-500/20", text: "text-amber-400" },
    { label: "Categories", value: s.categories, sub: "topics & subjects", href: "/admin/categories", color: "from-pink-600/20", border: "border-pink-500/20", text: "text-pink-400" },
  ];

  const quickActions = [
    { label: "+ New Post", href: "/admin/posts/new", color: "bg-violet-600 hover:bg-violet-500" },
    { label: "+ New Course", href: "/admin/courses/new", color: "bg-blue-600 hover:bg-blue-500" },
    { label: "+ New Mock Test", href: "/admin/mock-tests/new", color: "bg-emerald-600 hover:bg-emerald-500" },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Welcome back, Mustak. Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}
            className={`rounded-xl border ${card.border} bg-gradient-to-br ${card.color} to-transparent p-5 hover:scale-[1.02] transition-transform`}>
            <p className={`text-2xl font-bold text-white`}>{card.value}</p>
            <p className="text-sm font-medium text-white/70 mt-0.5">{card.label}</p>
            <p className="text-xs text-white/30 mt-1">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href}
              className={`${a.color} text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors`}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Recent Posts</h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <p className="text-white/30 text-sm">No posts yet.</p>
          <Link href="/admin/posts/new" className="inline-block mt-3 text-sm text-violet-400 hover:text-violet-300">
            Create first post →
          </Link>
        </div>
      </div>
    </div>
  );
}   