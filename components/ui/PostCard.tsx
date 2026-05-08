import { Post } from "@/types";
import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post, featured = false }: { post: Post, featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/news/${post.slug}`} className="group relative block overflow-hidden rounded-xl h-[400px] shadow-md border border-gray-100 mb-6 w-full">
        {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
          <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded inline-block mb-3">
            {post.category}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight mb-2 group-hover:text-red-200 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-300 line-clamp-2 text-sm">{post.description}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${post.slug}`} className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
         {post.thumbnailUrl ? (
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-red-600 text-xs font-bold uppercase tracking-wider mb-2 block">
          {post.category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
