"use client";

import { Post } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BreakingTicker({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [posts.length]);

  if (!posts || posts.length === 0) return null;

  return (
    <div className="bg-red-700 text-white py-2 px-4 shadow-sm relative overflow-hidden flex items-center h-10 w-full mb-6">
      <div className="font-bold text-sm tracking-wider uppercase bg-red-900 px-3 py-1 rounded mr-4 z-10 whitespace-nowrap">
        Breaking
      </div>
      <div className="flex-1 relative overflow-hidden h-full">
        <div 
          className="absolute w-full h-full flex items-center transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          <div className="flex flex-col w-full h-full">
            {posts.map((post, idx) => (
               <Link 
                  key={post.id} 
                  href={`/news/${post.slug}`}
                  className="w-full flex-shrink-0 h-10 flex items-center text-sm md:text-base font-medium truncate hover:underline"
                >
                  {post.title}
                </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
