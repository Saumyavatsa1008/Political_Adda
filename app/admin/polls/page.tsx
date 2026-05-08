"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Poll } from "@/types";
import { PlusCircle, Trash2, Loader2, PlayCircle, StopCircle } from "lucide-react";

export default function AdminPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Poll Form State
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: "1", text: "", votes: 0 },
    { id: "2", text: "", votes: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Poll));
      setPolls(data);
    } catch (error) {
      console.error("Failed to load polls", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, { id: Date.now().toString(), text: "", votes: 0 }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return; // Minimum 2 options
    setOptions(options.filter(opt => opt.id !== id));
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    const validOptions = options.filter(opt => opt.text.trim() !== "");
    if (validOptions.length < 2) {
      alert("At least 2 options are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const pollsRef = collection(db, "polls");
      const newDocRef = doc(pollsRef);
      
      const newPoll: Omit<Poll, "id"> = {
        question,
        options: validOptions,
        isActive: true,
        createdAt: serverTimestamp(),
      };

      await setDoc(newDocRef, newPoll);
      
      // Reset form & reload
      setQuestion("");
      setOptions([{ id: "1", text: "", votes: 0 }, { id: "2", text: "", votes: 0 }]);
      await loadPolls();
    } catch (error) {
       alert("Failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePollStatus = async (pollId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "polls", pollId), { isActive: !currentStatus });
      setPolls(polls.map(p => p.id === pollId ? { ...p, isActive: !currentStatus } : p));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (pollId: string) => {
    if(!confirm("Are you sure you want to delete this poll? All votes will be lost.")) return;
    try {
      await deleteDoc(doc(db, "polls", pollId));
      setPolls(polls.filter(p => p.id !== pollId));
    } catch (error) {
      alert("Failed to delete poll");
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Poll Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Public Poll</h2>
        <form onSubmit={handleCreatePoll} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Poll Question</label>
            <input
              type="text"
              required
              placeholder="e.g. Who do you think will win the upcoming election?"
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 transition-all text-black"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Options (Minimum 2)</label>
            <div className="space-y-3">
              {options.map((opt, index) => (
                <div key={opt.id} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 transition-all text-black"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                  />
                  {options.length > 2 && (
                    <button type="button" onClick={() => handleRemoveOption(opt.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddOption} className="mt-3 flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors">
              <PlusCircle className="w-4 h-4" /> Add Another Option
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-md text-white font-bold transition-all flex items-center justify-center ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Creating...</> : "Publish Poll"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Polls List */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Existing Polls</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : polls.length === 0 ? (
          <p className="text-gray-500 italic bg-gray-50 p-6 rounded-lg text-center">No polls created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              
              return (
                <div key={poll.id} className={`border rounded-lg p-5 flex flex-col ${poll.isActive ? 'border-blue-200 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-4">
                     <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${poll.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                       {poll.isActive ? 'Live' : 'Closed'}
                     </span>
                     <span className="text-xs text-gray-500 font-medium">{totalVotes} Total Votes</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-4 line-clamp-2">{poll.question}</h3>
                  
                  <div className="space-y-2 mb-6 flex-1">
                    {poll.options.map(opt => {
                      const perc = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      return (
                        <div key={opt.id} className="relative bg-gray-100 rounded overflow-hidden">
                           <div className="bg-blue-100 absolute left-0 top-0 bottom-0 z-0" style={{ width: `${perc}%` }}></div>
                           <div className="relative z-10 flex justify-between text-sm py-2 px-3">
                             <span className="font-medium text-gray-800">{opt.text}</span>
                             <span className="text-gray-600">{perc}%</span>
                           </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => togglePollStatus(poll.id!, poll.isActive)}
                      className={`flex items-center gap-1 text-sm font-medium ${poll.isActive ? "text-orange-600 hover:text-orange-800" : "text-green-600 hover:text-green-800"}`}
                    >
                      {poll.isActive ? <><StopCircle className="w-4 h-4" /> Close Poll</> : <><PlayCircle className="w-4 h-4" /> Re-open</>}
                    </button>
                    <button onClick={() => handleDelete(poll.id!)} className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
