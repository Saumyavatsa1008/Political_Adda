"use client";

import { useState } from "react";
import { Radio } from "lucide-react";

// Default live stream — can be replaced with the actual channel/video URL.
// Supports both full YouTube URLs and embed IDs.
const DEFAULT_STREAM_URL = "https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxxxxxxxxx";

function getYouTubeEmbedUrl(url: string): string {
  // Handle youtu.be short links
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;

  // Handle watch?v= links
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;

  // Handle /live/ links
  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
  if (liveMatch) return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1`;

  // If already an embed or channel URL, return as-is
  return url;
}

export default function LiveStreamSection() {
  const [customUrl, setCustomUrl] = useState("");
  const [activeUrl, setActiveUrl] = useState(DEFAULT_STREAM_URL);
  const [editing, setEditing] = useState(false);

  function handleApply() {
    if (customUrl.trim()) {
      setActiveUrl(getYouTubeEmbedUrl(customUrl.trim()));
    }
    setEditing(false);
  }

  return (
    <section className="my-14" aria-labelledby="live-stream-heading">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Pulsing red dot */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
          </span>
          <h2
            id="live-stream-heading"
            className="text-2xl font-extrabold text-gray-900 flex items-center gap-2"
          >
            <Radio className="w-5 h-5 text-red-600" />
            Live Streaming
          </h2>
          <span className="text-xs font-bold uppercase tracking-widest text-white bg-red-600 px-2 py-0.5 rounded-full">
            LIVE
          </span>
        </div>

        <button
          onClick={() => setEditing((e) => !e)}
          className="text-xs text-gray-400 hover:text-gray-700 underline hidden md:inline"
        >
          {editing ? "Cancel" : "Change stream"}
        </button>
      </div>

      {/* URL editor (hidden by default) */}
      {editing && (
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste YouTube live / video URL here…"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleApply}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Apply
          </button>
        </div>
      )}

      {/* Embed */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video border border-gray-200">
        <iframe
          src={activeUrl}
          title="Political Adda Live Stream"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Live coverage brought to you by <span className="font-semibold text-red-600">Political Adda</span>
      </p>
    </section>
  );
}
