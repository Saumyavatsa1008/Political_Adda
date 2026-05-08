"use client";

import { useState, useEffect } from "react";
import { getAdminPosts, deletePost, updatePost } from "@/lib/services/client/posts";
import { Post } from "@/types";
import {
  Search,
  Trash2,
  Edit,
  ExternalLink,
  EyeOff,
  Loader2,
  Plus,
  FileText,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

const CATEGORIES = [
  "Politics",
  "Entertainment",
  "Sports",
  "Technology",
  "National",
  "World",
  "Ground Reports",
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const PAGE_SIZE = 10;

  useEffect(() => {
    loadPosts(true);
  }, [category, status]);

  const loadPosts = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setLastDoc(null);
      } else {
        setLoadingMore(true);
      }

      const { posts: newPosts, lastVisible } = await getAdminPosts({
        pageSize: PAGE_SIZE,
        category: category || undefined,
        status:
          status === "published"
            ? "published"
            : status === "draft"
            ? "draft"
            : undefined,
        lastDoc: reset ? null : lastDoc,
      });

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setLastDoc(lastVisible);
      setHasMore(newPosts.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    )
      return;

    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      alert("Failed to delete post.");
    }
  };

  const togglePublish = async (post: Post) => {
    try {
      await updatePost(post.id!, {
        isPublished: !post.isPublished,
      });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, isPublished: !post.isPublished }
            : p
        )
      );
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Articles
          </h1>
          <p className="text-sm text-gray-500">
            Edit, delete, and manage news content visibility.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-md w-fit"
        >
          <Plus className="w-5 h-5" />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search articles by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-fit">
          <select
            className="flex-1 md:w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="flex-1 md:w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Article
                </th>

                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </th>

                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>

                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-black">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-300" />
                  </td>
                </tr>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Article */}
                    <td className="p-4 min-w-[300px]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          {post.thumbnailUrl ? (
                            <Image
                              src={post.thumbnailUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>

                        <div className="font-bold text-sm text-gray-900 group">
                          <Link
                            href={`/news/${post.slug}`}
                            target="_blank"
                            className="hover:text-red-600 flex items-center gap-1"
                          >
                            {post.title}

                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-sm font-medium text-gray-600">
                      {post.category}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition ${
                          post.isPublished
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {post.isPublished ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}

                        {post.isPublished ? "Live" : "Draft"}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      {post.createdAt?.toDate
                        ? format(
                            post.createdAt.toDate(),
                            "MMM dd, yyyy"
                          )
                        : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(post.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-gray-500 italic"
                  >
                    No posts found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {hasMore && filteredPosts.length >= PAGE_SIZE && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
            <button
              onClick={() => loadPosts(false)}
              disabled={loadingMore}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition disabled:opacity-50"
            >
              {loadingMore ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Load More Articles"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}