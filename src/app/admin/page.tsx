import { redirect } from "next/navigation";
import { Users, TrendingUp, Link2, Utensils, DollarSign } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin" };

function sevenDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d;
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const [
    totalUsers,
    newUsers7d,
    totalSuggestions,
    totalExtractions,
    paidUsers,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: sevenDaysAgo() } } }),
    db.usageEvent.count({ where: { action: "SUGGESTION" } }),
    db.usageEvent.count({ where: { action: "EXTRACTION" } }),
    db.user.count({ where: { NOT: { plan: "FREE" } } }),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Total Users", value: totalUsers, icon: <Users className="w-5 h-5" /> },
    { label: "New (7 days)", value: newUsers7d, icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Suggestion Runs", value: totalSuggestions, icon: <Utensils className="w-5 h-5" /> },
    { label: "Recipe Extracts", value: totalExtractions, icon: <Link2 className="w-5 h-5" /> },
    { label: "Paid Users", value: paidUsers, icon: <DollarSign className="w-5 h-5" /> },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {stats.map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  {icon}
                  <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <div className="text-3xl font-extrabold text-gray-900">{value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Plan</th>
                    <th className="text-left px-5 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-700">{u.email}</td>
                      <td className="px-5 py-3 text-gray-500">{u.name ?? "–"}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${u.plan !== "FREE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {u.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
