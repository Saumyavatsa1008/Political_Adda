"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getComments, addComment } from "@/lib/services/client/interactions";
import { Comment } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadComments() {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
      setIsLoading(false);
    }
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      setError("");
      const commentObj = {
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorPhoto: user.photoURL || "",
        text: newComment.trim(),
      };
      
      const newId = await addComment(postId, commentObj);
      
      // Optimitistic update
      setComments([{ ...commentObj, id: newId, createdAt: { toDate: () => new Date() } } as any, ...comments]);
      setNewComment("");
    } catch (err: any) {
      setError(err.message || "Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-gray-200 pt-10">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        Discussion ({comments.length})
      </h3>

      {/* Comment Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 flex flex-col md:flex-row gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative border border-gray-300">
             {user.photoURL ? (
                <Image src={user.photoURL} alt="Avatar" fill className="object-cover" />
             ) : (
                <UserIcon className="w-full h-full text-gray-400 p-2" />
             )}
          </div>
          <div className="flex-1 w-full">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the conversation..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 min-h-[80px] text-gray-900"
              required
            />
            <div className="mt-2 text-right">
              {error && <span className="text-red-500 text-sm font-medium mr-4">{error}</span>}
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-md transition-colors inline-flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-blue-50 p-6 rounded-lg text-center border border-blue-100 mb-10">
          <p className="text-blue-800 font-medium mb-3">You must be logged in to participate in the discussion.</p>
          <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors shadow-sm">
            Login with Google
          </Link>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative">
                 {comment.authorPhoto ? (
                    <Image src={comment.authorPhoto} alt="Avatar" fill className="object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold">
                       {comment.authorName.charAt(0)}
                    </div>
                 )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 leading-none">{comment.authorName}</span>
                  <span className="text-xs text-gray-500 leading-none">
                    {comment.createdAt?.toDate ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : "Just now"}
                  </span>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8 italic bg-gray-50 rounded-lg">No comments yet. Be the first to share your thoughts!</p>
      )}
    </div>
  );
}

// Minimal fallback icon for avatar
function UserIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
