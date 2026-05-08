"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Poll } from "@/types";
import { voteInPoll } from "@/lib/services/client/interactions";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PollWidget() {
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadActivePoll();
  }, [user]);

  const loadActivePoll = async () => {
    try {
      const q = query(collection(db, "polls"), where("isActive", "==", true), limit(1));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const pollData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Poll;
        setPoll(pollData);

        // Check if user has already voted
        if (user) {
          const voteRef = collection(db, "polls", pollData.id!, "votes");
          const userVoteQ = query(voteRef, where("__name__", "==", user.uid));
          const userVoteSnap = await getDocs(userVoteQ);
          if (!userVoteSnap.empty) {
            setHasVoted(true);
            setSelectedOption(userVoteSnap.docs[0].data().optionId);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load poll", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!user) {
      setError("Please login to vote.");
      return;
    }
    if (!poll || !selectedOption) return;

    try {
      setIsVoting(true);
      setError("");
      await voteInPoll(poll.id!, selectedOption, user.uid);
      
      setHasVoted(true);
      // Optimistically update local poll state
      setPoll(prev => {
        if (!prev) return prev;
        const newOptions = prev.options.map(opt => 
          opt.id === selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return { ...prev, options: newOptions };
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit vote");
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) return <div className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>;
  if (!poll) return null; // Don't render anything if no active poll

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="bg-white border top-24 sticky border-gray-200 rounded-xl shadow-sm p-6 mb-8 mt-12 md:mt-0 lg:mt-0">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
        <span className="text-xs font-bold uppercase tracking-wider text-red-600">Live Poll</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-6 leading-snug">{poll.question}</h3>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4 font-medium transition-all">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="space-y-3 mb-6">
        {poll.options.map((opt) => {
          const perc = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isSelected = selectedOption === opt.id;

          return (
            <div 
              key={opt.id}
              onClick={() => (!hasVoted ? setSelectedOption(opt.id) : null)}
              className={`relative overflow-hidden rounded-lg border transition-all ${
                hasVoted 
                  ? "border-gray-200" 
                  : isSelected ? "border-blue-500 bg-blue-50 cursor-pointer" : "border-gray-200 hover:border-blue-300 cursor-pointer bg-white"
              }`}
            >
              {/* Progress Bar for Results */}
              {hasVoted && (
                 <div 
                   className={`absolute left-0 top-0 bottom-0 z-0 opacity-20 ${isSelected ? 'bg-blue-600' : 'bg-gray-400'}`} 
                   style={{ width: `${perc}%` }}
                 ></div>
              )}
              
              <div className="relative z-10 flex justify-between items-center p-4">
                 <div className="flex items-center gap-3">
                    {/* Radio Button */}
                    {!hasVoted && (
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    )}
                    {/* Checkmark for voted option */}
                    {hasVoted && isSelected && <span className="text-blue-600 font-bold">✓</span>}
                    
                    <span className={`font-medium ${hasVoted && isSelected ? 'text-blue-800' : 'text-gray-800'}`}>{opt.text}</span>
                 </div>
                 
                 {hasVoted && (
                   <span className="font-bold text-gray-600">{perc}%</span>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {!hasVoted ? (
        user ? (
          <button 
            onClick={handleVote}
            disabled={!selectedOption || isVoting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center"
          >
            {isVoting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Vote"}
          </button>
        ) : (
          <Link href="/login" className="block text-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-colors">
            Login to Vote
          </Link>
        )
      ) : (
        <div className="text-center text-sm font-medium text-gray-500 pt-2 border-t border-gray-100">
          Thank you for voting! • {totalVotes} total votes
        </div>
      )}
    </div>
  );
}
