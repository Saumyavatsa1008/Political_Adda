import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/services/server/posts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

const CATEGORIES = ["politics", "entertainment", "sports", "technology", "national"];

const INDIAN_STATE_SLUGS = [
  "andhra-pradesh", "andaman-nicobar", "arunachal-pradesh", "assam", "bihar",
  "chandigarh", "chhattisgarh", "dadra-nagar-haveli", "daman-diu", "delhi",
  "goa", "gujarat", "haryana", "himachal-pradesh", "jammu-kashmir", "jharkhand",
  "karnataka", "kerala", "ladakh", "lakshadweep", "madhya-pradesh", "maharashtra",
  "manipur", "meghalaya", "mizoram", "nagaland", "odisha", "puducherry", "punjab",
  "rajasthan", "sikkim", "tamil-nadu", "telangana", "tripura", "uttar-pradesh",
  "uttarakhand", "west-bengal",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts({ limit: 1000, isPublished: true });

  const newsUrls = posts.map((post) => ({
    url: `${BASE_URL}/news/${post.slug}`,
    lastModified: post.updatedAt?.toDate ? post.updatedAt.toDate() : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryUrls = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }));

  const stateUrls = INDIAN_STATE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/state/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/submissions/new`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...categoryUrls,
    ...stateUrls,
    ...newsUrls,
  ];
}
