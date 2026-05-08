import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp, 
  updateDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  getDocs,
  getDoc
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Post } from "../../../types";

const COLLECTION_NAME = "posts";

// Function to create a URL friendly slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createPost(postData: Omit<Post, "id" | "createdAt" | "updatedAt" | "slug">) {
  try {
    const newDocRef = doc(collection(db, COLLECTION_NAME));
    const slug = generateSlug(postData.title);
    const uniqueSlug = `${slug}-${newDocRef.id.slice(0, 5)}`;

    const newPost: Post = {
      ...postData,
      id: newDocRef.id,
      slug: uniqueSlug,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newDocRef, newPost);
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post.");
  }
}

export async function updatePost(postId: string, updateData: Partial<Post>) {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    await updateDoc(postRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post.");
  }
}

export async function deletePost(postId: string) {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post.");
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post;
    }
    return null;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}

export async function getAdminPosts(options: {
  pageSize: number;
  category?: string;
  status?: "published" | "draft";
  lastDoc?: any;
}) {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
      limit(options.pageSize)
    );

    if (options.category) {
      q = query(q, where("category", "==", options.category));
    }

    if (options.status) {
      const isPublished = options.status === "published";
      q = query(q, where("isPublished", "==", isPublished));
    }

    if (options.lastDoc) {
      q = query(q, startAfter(options.lastDoc));
    }

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    return { posts, lastVisible };
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    throw new Error("Failed to fetch posts.");
  }
}
