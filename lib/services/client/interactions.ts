import { collection, doc, setDoc, getDocs, query, orderBy, serverTimestamp, runTransaction } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Comment, Poll } from "../../../types";

// --- COMMENTS ---
export async function addComment(postId: string, commentData: Omit<Comment, "id" | "createdAt">) {
  try {
    const commentsRef = collection(db, "posts", postId, "comments");
    const newCommentRef = doc(commentsRef);
    
    await setDoc(newCommentRef, {
      ...commentData,
      id: newCommentRef.id,
      createdAt: serverTimestamp(),
    });
    return newCommentRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Could not post comment.");
  }
}

export async function getComments(postId: string): Promise<Comment[]> {
  try {
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// --- POLLS ---
export async function getActivePolls(): Promise<Poll[]> {
  try {
    // Basic implementation for fetching polls. In real app, we use adminDb on server, but client needed for voting state
    // We'll just fetch all active here.
    return []; // Placeholder for now, can implement if needed
  } catch (error) {
    return [];
  }
}

export async function voteInPoll(pollId: string, optionId: string, userId: string) {
  try {
    const pollRef = doc(db, "polls", pollId);
    const voteRef = doc(db, "polls", pollId, "votes", userId);

    await runTransaction(db, async (transaction) => {
      // 1. Check if user already voted
      const voteDoc = await transaction.get(voteRef);
      if (voteDoc.exists()) {
        throw new Error("You have already voted in this poll.");
      }

      // 2. Get poll
      const pollDoc = await transaction.get(pollRef);
      if (!pollDoc.exists()) {
        throw new Error("Poll does not exist.");
      }

      const pollData = pollDoc.data() as Poll;
      
      // 3. Update vote count
      const updatedOptions = pollData.options.map(opt => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        return opt;
      });

      transaction.update(pollRef, { options: updatedOptions });
      transaction.set(voteRef, { optionId, createdAt: serverTimestamp() });
    });

    return true;
  } catch (error: any) {
    console.error("Error voting:", error);
    throw new Error(error.message || "Failed to submit vote.");
  }
}
