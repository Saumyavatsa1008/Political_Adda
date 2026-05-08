"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { TipSubmission } from "@/lib/services/client/submissions";
import { format } from "date-fns";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<TipSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TipSubmission));
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to load submissions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: TipSubmission["status"]) => {
    try {
      await updateDoc(doc(db, "submissions", id), { status: newStatus });
      setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub));
    } catch (error) {
       alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteDoc(doc(db, "submissions", id));
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      alert("Failed to delete submission");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Submissions</h1>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center text-gray-500">
          No ground reports have been submitted yet.
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => (
            <div key={sub.id} className={`border rounded-lg p-6 transition-all ${
              sub.status === "pending" ? "border-blue-200 bg-blue-50/30" : 
              sub.status === "reviewed" ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50"
            }`}>
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Meta details */}
                <div className="flex-1 space-y-3">
                   <div className="flex items-center gap-3">
                     <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        sub.status === "pending" ? "bg-blue-100 text-blue-700" :
                        sub.status === "reviewed" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                     }`}>
                       {sub.status}
                     </span>
                     <span className="text-sm font-medium text-gray-500">
                       {sub.createdAt?.toDate ? format(sub.createdAt.toDate(), "PPp") : "Unknown Date"}
                     </span>
                   </div>
                   
                   <h3 className="text-xl font-bold text-gray-900">{sub.title}</h3>
                   
                   <div className="flex items-center gap-2 text-sm text-gray-600 bg-white inline-flex px-3 py-1 rounded-md border border-gray-200">
                     <span className="font-semibold">Location:</span> {sub.location}
                   </div>
                   
                   <p className="text-gray-700 whitespace-pre-wrap">{sub.description}</p>
                   
                   {sub.contactInfo && (
                     <div className="text-sm text-gray-500 pt-2 border-t border-gray-200 mt-4">
                       <span className="font-semibold">Contact left by user:</span> {sub.contactInfo}
                     </div>
                   )}
                </div>

                {/* Optional Image */}
                {sub.imageUrl && (
                  <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image src={sub.imageUrl} alt="Evidence" fill className="object-cover hover:scale-110 transition cursor-pointer" onClick={() => window.open(sub.imageUrl!, "_blank")} />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                {sub.status === "pending" && (
                  <button onClick={() => handleUpdateStatus(sub.id!, "reviewed")} className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-md hover:bg-green-100 transition text-sm font-medium">
                    <CheckCircle className="w-4 h-4" /> Mark as Reviewed
                  </button>
                )}
                {/* Convert to Post placeholder - ideally would pre-fill the New Post form */}
                <button onClick={() => alert("This would open the New Article form with pre-filled details.")} className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-md hover:bg-blue-100 transition text-sm font-medium">
                  Draft Article Mentioning Report
                </button>
                <button onClick={() => handleDelete(sub.id!)} className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-md hover:bg-red-100 transition text-sm font-medium ml-auto">
                  <XCircle className="w-4 h-4" /> Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
