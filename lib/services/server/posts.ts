import { adminDb } from "../../firebase/admin";
import { Post } from "../../../types";
import { cache } from "react";

const COLLECTION_NAME = "posts";

export const getPosts = cache(async (options: {
  limit?: number;
  category?: string;
  state?: string;
  isPublished?: boolean;
  startAfterId?: string;
} = {}) => {
  try {
    let query: FirebaseFirestore.Query = adminDb.collection(COLLECTION_NAME);

    // Filters
    if (options.isPublished !== undefined) {
      query = query.where("isPublished", "==", options.isPublished);
    }
    if (options.category) {
      query = query.where("category", "==", options.category);
    }
    if (options.state) {
      query = query.where("state", "==", options.state);
    }

    // Default sorting by newly created
    query = query.orderBy("createdAt", "desc");

    // Pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    // For pagination (startAfter). In a real production app we'd pass the actual document
    // snapshot, or use a cursor field like createdAt. Here, we fetch the doc snapshot first.
    if (options.startAfterId) {
      const docSnap = await adminDb.collection(COLLECTION_NAME).doc(options.startAfterId).get();
      if (docSnap.exists) {
        query = query.startAfter(docSnap);
      }
    }

    const snapshot = await query.get().catch(err => {
      if (err.message?.includes("index")) {
        console.error("FIRESTORE INDEX REQUIRED: Click the link in the console to create it.");
      }
      throw err;
    });
    const posts: Post[] = [];
    
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post);
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts serverside:", error);
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  try {
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Post;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
});
