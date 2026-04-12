"use client";

import { useState } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";

export default function PromptInput({ onResult }: { onResult: (data: any) => void }) {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate SRS.");
      }

      onResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all duration-200">
      <div className="p-4 pb-0">
        <label htmlFor="project-idea" className="sr-only">Project Idea</label>
        <textarea
          id="project-idea"
          rows={6}
          className="w-full bg-transparent border-0 text-slate-800 placeholder:text-slate-400 focus:ring-0 resize-none styling-none outline-none leading-relaxed"
          placeholder="Describe your software project... e.g. A web app that helps university students find and join local study groups based on their active courses."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
      </div>
      
      {error && (
        <div className="mx-4 mt-2 mb-1 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-start">
           <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
           <p>{error}</p>
        </div>
      )}

      <div className="p-3 flex items-center justify-between border-t border-slate-100 bg-slate-50/50 rounded-b-xl mt-2 relative">
        <span className="text-xs font-medium text-slate-400">
          {idea.length} characters
        </span>
        
        <button
          onClick={handleGenerate}
          disabled={!idea.trim() || isGenerating}
          className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating AI...
            </>
          ) : (
            <>
              Generate SRS
              <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
