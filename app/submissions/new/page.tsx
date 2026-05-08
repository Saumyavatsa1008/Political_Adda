"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/services/client/storage";
import { submitGroundReport } from "@/lib/services/client/submissions";
import { Loader2, Camera, MapPin, Send } from "lucide-react";

export default function NewSubmissionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "submissions");
      }

      await submitGroundReport({
        title,
        description,
        location,
        contactInfo: contactInfo || null,
        imageUrl,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-10 bg-white rounded-xl shadow-sm text-center border border-green-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Report Submitted Successfully</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for your valuable ground report. Our editorial team will review it shortly. If it meets our guidelines, it will be published.
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Submit a Ground Report</h1>
          <p className="text-lg text-gray-600">
            Witnessed something important? Share your news tip, photos, or ground report directly with our journalists.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Headline / Main Event *</label>
            <input
              type="text"
              required
              placeholder="What is happening?"
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
            <div className="relative">
               <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
               <input
                 type="text"
                 required
                 placeholder="City, District, or specific area"
                 className="w-full border border-gray-300 rounded-lg p-4 pl-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
               />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Details of the Event *</label>
            <textarea
              required
              rows={5}
              placeholder="Please provide as much accurate detail as possible..."
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload Photo Evidence (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-2"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-500 mt-2">Clear, unedited photos are preferred.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Your Contact Info (Optional)</label>
            <input
              type="text"
              placeholder="Email or Phone (Kept strictly confidential)"
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg text-white font-bold text-lg tracking-wide transition-all flex items-center justify-center ${
              isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin mr-2 h-6 w-6" /> Submitting Report...</>
            ) : (
              <><Send className="mr-2 h-5 w-5" /> Submit Ground Report</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
