import { getPosts } from "@/lib/services/server/posts";
import BreakingTicker from "@/components/home/BreakingTicker";
import PostCard from "@/components/ui/PostCard";
import PollWidget from "@/components/ui/PollWidget";
import LiveStreamSection from "@/components/home/LiveStreamSection";

export const revalidate = 60; // ISR every 60s

export default async function Home() {
  const posts = await getPosts({ limit: 24, isPublished: true });

  const breakingPosts = posts.slice(0, 5);
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.slice(1);

  const nationalPosts = posts.filter((p) => p.category === "National").slice(0, 4);
  const politicsPosts = posts.filter((p) => p.category === "Politics").slice(0, 4);
  const entertainmentPosts = posts.filter((p) => p.category === "Entertainment").slice(0, 4);
  const sportsPosts = posts.filter((p) => p.category === "Sports").slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Breaking News Ticker */}
        {breakingPosts.length > 0 && <BreakingTicker posts={breakingPosts} />}

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            {featuredPost ? (
              <PostCard post={featuredPost} featured={true} />
            ) : (
              <div className="h-[400px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-medium">
                No articles published yet.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div id="poll">
              <PollWidget />
            </div>
            <h3 className="font-bold border-b-2 border-red-600 pb-2 text-xl mt-8">
              Top Stories
            </h3>
            <div className="flex flex-col space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {recentPosts.slice(0, 5).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>

        {/* Live Streaming Section */}
        <LiveStreamSection />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">

          {/* National */}
          <div>
            <h3 className="font-bold border-b-2 border-red-600 pb-2 text-2xl mb-6">
              National
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nationalPosts.length > 0 ? (
                nationalPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-gray-500 text-sm">No national news yet.</p>
              )}
            </div>
          </div>

          {/* Politics */}
          <div>
            <h3 className="font-bold border-b-2 border-red-600 pb-2 text-2xl mb-6">
              Politics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {politicsPosts.length > 0 ? (
                politicsPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-gray-500 text-sm">No politics news yet.</p>
              )}
            </div>
          </div>

          {/* Entertainment */}
          <div>
            <h3 className="font-bold border-b-2 border-red-600 pb-2 text-2xl mb-6">
              Entertainment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {entertainmentPosts.length > 0 ? (
                entertainmentPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-gray-500 text-sm">No entertainment news yet.</p>
              )}
            </div>
          </div>

          {/* Sports */}
          <div>
            <h3 className="font-bold border-b-2 border-red-600 pb-2 text-2xl mb-6">
              Sports
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sportsPosts.length > 0 ? (
                sportsPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <p className="text-gray-500 text-sm">No sports news yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
