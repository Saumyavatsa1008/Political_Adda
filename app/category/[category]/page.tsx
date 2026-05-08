import { getPosts } from "@/lib/services/server/posts";
import PostCard from "@/components/ui/PostCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = { params: Promise<{ category: string }> };

const VALID_CATEGORIES = [
  "politics",
  "entertainment",
  "sports",
  "technology",
  "national",
  "world",
  "ground-reports",
];

function toDisplayName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const display = toDisplayName(category);
  return {
    title: `${display} | Political Adda`,
    description: `Latest ${display} news and updates on Political Adda.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
    notFound();
  }

  // Convert slug like "ground-reports" → "Ground Reports" for Firestore query
  const categoryLabel = toDisplayName(category);

  const posts = await getPosts({
    category: categoryLabel,
    isPublished: true,
    limit: 30,
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 border-b-4 border-red-600 pb-4">
          <h1 className="text-4xl font-extrabold text-gray-900">{categoryLabel}</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {posts.length} article{posts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg
              className="w-16 h-16 mb-4 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-semibold">No articles in this category yet.</p>
            <p className="text-sm mt-1">Check back soon for the latest updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
