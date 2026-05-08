"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { 
  FileText, 
  MessageSquare, 
  BarChart3, 
  PlusCircle, 
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Post, Poll } from "@/types";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    polls: 0,
    submissions: 0,
    publishedPosts: 0
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch stats
        const postsCol = collection(db, "posts");
        const pollsCol = collection(db, "polls");
        const subsCol = collection(db, "submissions");

        const [
          postsCount,
          pollsCount,
          subsCount,
          publishedCount
        ] = await Promise.all([
          getCountFromServer(postsCol),
          getCountFromServer(pollsCol),
          getCountFromServer(subsCol),
          getCountFromServer(query(postsCol, where("isPublished", "==", true)))
        ]);

        setStats({
          posts: postsCount.data().count,
          polls: pollsCount.data().count,
          submissions: subsCount.data().count,
          publishedPosts: publishedCount.data().count
        });

        // Fetch recent posts
        const recentQuery = query(postsCol, orderBy("createdAt", "desc"), limit(5));
        const postsSnap = await getDocs(recentQuery);
        const posts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setRecentPosts(posts);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Total Articles", value: stats.posts, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Published News", value: stats.publishedPosts, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Public Polls", value: stats.polls, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "User Submissions", value: stats.submissions, icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening with Political Adda today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.bg} p-4 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Articles */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Recent Articles
            </h2>
            <Link href="/admin/posts" className="text-sm text-red-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {post.createdAt?.toDate ? format(post.createdAt.toDate(), "MMM dd, yyyy") : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                      post.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {post.isPublished ? "Live" : "Draft"}
                    </span>
                    <Link href={`/admin/posts/${post.id}`} className="p-2 text-gray-400 hover:text-gray-600 transition">
                      <PlusCircle className="w-5 h-5 rotate-45" /> {/* Edit Icon placeholder */}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 italic">No posts found.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 text-white shadow-xl">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/posts/new"
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-red-400" />
                  <span className="font-medium text-sm">Create News Article</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/admin/polls"
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-sm">Create Public Poll</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-6 border border-red-100">
            <h2 className="text-lg font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Submissions
            </h2>
            <p className="text-sm text-red-700 mb-4">
              You have <span className="font-bold underline">{stats.submissions}</span> user-submitted stories to review.
            </p>
            <Link
              href="/admin/submissions"
              className="inline-block text-sm font-bold text-red-600 hover:text-red-800"
            >
              Go to Submissions &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
