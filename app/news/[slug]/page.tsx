import { getPostBySlug } from "@/lib/services/server/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata, ResolvingMetadata } from "next";
import { format } from "date-fns";
import CommentSection from "@/components/ui/CommentSection";
import PollWidget from "@/components/ui/PollWidget";

type Props = {
  params: Promise<{ slug: string }>;
};

// Next.js standard for dynamic SEO Metadata Generation
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Political Adda',
    };
  }

  return {
    title: `${post.title} | Political Adda`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Format the date safely
  const publishedDate = post.createdAt?.toDate 
    ? format(post.createdAt.toDate(), 'MMMM d, yyyy') 
    : "Recently";

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Article Full Content */}
          <article className="flex-1 lg:max-w-3xl">
            
            {/* Article Header */}
            <header className="mb-10">
              <div className="flex items-center space-x-2 text-sm text-gray-500 font-semibold uppercase tracking-wider mb-4">
                 <span className="text-red-600">{post.category}</span>
                 <span>•</span>
                 <span>{publishedDate}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {post.description}
              </p>
            </header>

            {/* Thumbnail Image */}
            {post.thumbnailUrl && (
              <div className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden mb-12 shadow-md">
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>
            )}

            {/* Article Body */}
            <div className="prose prose-lg md:prose-xl prose-blue max-w-none text-gray-800 leading-relaxed">
              {post.content.split("\n").map((paragraph, idx) => (
                <p key={idx} className="mb-6 whitespace-pre-wrap">{paragraph}</p>
              ))}
            </div>

            {/* YouTube Video Embed */}
            {post.youtubeLink && (
               <div className="mt-12">
                 <h3 className="text-2xl font-bold mb-6 border-b pb-2">Watch Video</h3>
                 <div className="aspect-w-16 aspect-h-9 w-full rounded-xl overflow-hidden shadow-lg">
                    <iframe 
                      src={post.youtubeLink.replace("watch?v=", "embed/")} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="w-full h-[300px] md:h-[450px]"
                    ></iframe>
                 </div>
               </div>
            )}
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                <span className="text-sm font-bold text-gray-700 mr-2 flex items-center uppercase tracking-tighter">Tags:</span>
                {post.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full hover:bg-gray-200 cursor-pointer transition">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-gray-100">
              <CommentSection postId={post.id!} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
             <div className="sticky top-24 space-y-12">
                <PollWidget />
                
                {/* Secondary Sidebar Content can go here */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                   <h4 className="font-bold text-red-900 mb-2">Political Adda Tip</h4>
                   <p className="text-sm text-red-800 leading-relaxed">
                     Have a ground-level story from your area? Share it with us using our submission portal!
                   </p>
                </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
