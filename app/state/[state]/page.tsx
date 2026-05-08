import { getPosts } from "@/lib/services/server/posts";
import PostCard from "@/components/ui/PostCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = { params: Promise<{ state: string }> };

// All Indian States & UTs (slug → display name)
export const INDIAN_STATES: Record<string, string> = {
  "andhra-pradesh": "Andhra Pradesh",
  "arunachal-pradesh": "Arunachal Pradesh",
  assam: "Assam",
  bihar: "Bihar",
  chhattisgarh: "Chhattisgarh",
  goa: "Goa",
  gujarat: "Gujarat",
  haryana: "Haryana",
  "himachal-pradesh": "Himachal Pradesh",
  jharkhand: "Jharkhand",
  karnataka: "Karnataka",
  kerala: "Kerala",
  "madhya-pradesh": "Madhya Pradesh",
  maharashtra: "Maharashtra",
  manipur: "Manipur",
  meghalaya: "Meghalaya",
  mizoram: "Mizoram",
  nagaland: "Nagaland",
  odisha: "Odisha",
  punjab: "Punjab",
  rajasthan: "Rajasthan",
  sikkim: "Sikkim",
  "tamil-nadu": "Tamil Nadu",
  telangana: "Telangana",
  tripura: "Tripura",
  "uttar-pradesh": "Uttar Pradesh",
  uttarakhand: "Uttarakhand",
  "west-bengal": "West Bengal",
  // Union Territories
  "andaman-nicobar": "Andaman & Nicobar Islands",
  chandigarh: "Chandigarh",
  "dadra-nagar-haveli": "Dadra & Nagar Haveli",
  "daman-diu": "Daman & Diu",
  delhi: "Delhi",
  "jammu-kashmir": "Jammu & Kashmir",
  ladakh: "Ladakh",
  lakshadweep: "Lakshadweep",
  puducherry: "Puducherry",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateName = INDIAN_STATES[state];
  if (!stateName) return { title: "State Not Found | Political Adda" };
  return {
    title: `${stateName} News | Political Adda`,
    description: `Latest news from ${stateName} on Political Adda.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const stateName = INDIAN_STATES[state];

  if (!stateName) {
    notFound();
  }

  const posts = await getPosts({
    state: stateName,
    isPublished: true,
    limit: 30,
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 border-b-4 border-red-600 pb-4 flex items-center gap-3">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">{stateName}</h1>
            <p className="text-gray-500 mt-2 text-sm">
              {posts.length} article{posts.length !== 1 ? "s" : ""} from this state
            </p>
          </div>
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-lg font-semibold">No articles from {stateName} yet.</p>
            <p className="text-sm mt-1">Check back soon for the latest state updates.</p>
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
