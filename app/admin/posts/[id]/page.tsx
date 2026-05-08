"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getPostById, updatePost } from "@/lib/services/client/posts";
import { uploadImage } from "@/lib/services/client/storage";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowLeft, Save, AlertCircle } from "lucide-react";
import { validatePost } from "@/lib/validation";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  "Politics",
  "Entertainment",
  "Sports",
  "Technology",
  "National",
  "World",
  "Ground Reports",
];

const INDIAN_STATES = [
  { label: "-- No Specific State --", value: "" },
  { label: "Andhra Pradesh", value: "Andhra Pradesh" },
  { label: "Bihar", value: "Bihar" },
  { label: "Chhattisgarh", value: "Chhattisgarh" },
  { label: "Delhi", value: "Delhi" },
  { label: "Goa", value: "Goa" },
  { label: "Gujarat", value: "Gujarat" },
  { label: "Haryana", value: "Haryana" },
  { label: "Himachal Pradesh", value: "Himachal Pradesh" },
  { label: "Jammu & Kashmir", value: "Jammu & Kashmir" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Kerala", value: "Kerala" },
  { label: "Madhya Pradesh", value: "Madhya Pradesh" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Odisha", value: "Odisha" },
  { label: "Punjab", value: "Punjab" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "Telangana", value: "Telangana" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" },
  { label: "Uttarakhand", value: "Uttarakhand" },
  { label: "West Bengal", value: "West Bengal" },
];

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: CATEGORIES[0],
    state: "",
    tags: "",
    youtubeLink: "",
    isPublished: false,
    thumbnailUrl: null as string | null,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await getPostById(id);
        if (!post) {
          alert("Post not found");
          router.push("/admin/posts");
          return;
        }
        setFormData({
          title: post.title,
          description: post.description,
          content: post.content,
          category: post.category,
          state: post.state || "",
          tags: post.tags.join(", "),
          youtubeLink: post.youtubeLink || "",
          isPublished: post.isPublished,
          thumbnailUrl: post.thumbnailUrl,
        });
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const tagArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const validation = validatePost({ ...formData, tags: tagArray });
    if (!validation.isValid) {
      setErrors(validation.errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      let finalThumbnailUrl = formData.thumbnailUrl;

      if (thumbnailFile) {
        finalThumbnailUrl = await uploadImage(thumbnailFile, "thumbnails", setUploadProgress);
      }

      await updatePost(id, {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        thumbnailUrl: finalThumbnailUrl,
        category: formData.category,
        state: formData.state || undefined,
        tags: tagArray,
        youtubeLink: formData.youtubeLink.trim() || null,
        isPublished: formData.isPublished,
      });

      router.push("/admin/posts");
    } catch (err: any) {
      console.error(err);
      setErrors({ form: err.message || "An unexpected error occurred while saving." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-black bg-white placeholder:text-gray-400";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        <p className="text-gray-500 font-medium">Loading article details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/posts" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Article</h1>
        <p className="text-sm text-gray-500 mb-8">Update the content, category, or visibility of this report.</p>

        {errors.form && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Headline / Title</label>
            <input
              type="text"
              className={`${inputBase} ${errors.title ? "border-red-500" : ""}`}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            {errors.title && <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Short Description (SEO Meta)</label>
            <textarea
              className={`${inputBase} ${errors.description ? "border-red-500" : ""}`}
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
             {errors.description && <p className="text-xs text-red-600 mt-1 font-medium">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                className={inputBase}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">State / UT (Optional)</label>
              <select
                className={inputBase}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              >
                {INDIAN_STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tags (Comma-sep)</label>
              <input
                type="text"
                className={inputBase}
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="news, elections, ground-report"
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4">Thumbnail Image</label>
              {formData.thumbnailUrl && !thumbnailFile && (
                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden border border-gray-300">
                  <Image src={formData.thumbnailUrl} alt="Current" fill className="object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
              {uploadProgress > 0 && <div className="mt-2 text-xs text-red-600 font-bold italic">Uploading: {Math.round(uploadProgress)}%</div>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4">YouTube Video URL</label>
              <input
                type="url"
                className={inputBase}
                value={formData.youtubeLink}
                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                placeholder="https://youtu.be/..."
              />
              <p className="text-xs text-gray-400 mt-2 italic">Leave blank if no video.</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Article Content</label>
            <textarea
              className={`${inputBase} min-h-[400px] font-mono text-sm ${errors.content ? "border-red-500" : ""}`}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
             {errors.content && <p className="text-xs text-red-600 mt-1 font-medium">{errors.content}</p>}
          </div>

          {/* Publish Status */}
          <div className="flex items-center gap-4 bg-gray-900 p-6 rounded-xl text-white">
             <div className="flex-1">
               <h3 className="font-bold">Publication Status</h3>
               <p className="text-sm text-gray-400">Making an article 'Live' sends it to the homepage immediately.</p>
             </div>
             <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
              className={`px-6 py-2 rounded-full font-bold transition ${
                formData.isPublished ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
             >
               {formData.isPublished ? "LIVE" : "DRAFT"}
             </button>
          </div>

          {/* Actions */}
          <div className="pt-8 border-t border-gray-200 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 disabled:bg-red-300"
            >
              {isSubmitting ? <><Loader2 className="animate-spin w-5 h-5" /> Saving...</> : <><Save className="w-5 h-5" /> Update Article</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
