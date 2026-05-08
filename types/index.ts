export interface Post {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnailUrl: string | null;
  category: string;
  state?: string;
  tags: string[];
  youtubeLink: string | null;
  isPublished: boolean;
  authorId: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "admin" | "user";
  createdAt: any;
}

export interface Comment {
  id?: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  text: string;
  createdAt: any;
}

export interface Poll {
  id?: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  isActive: boolean;
  createdAt: any;
}
