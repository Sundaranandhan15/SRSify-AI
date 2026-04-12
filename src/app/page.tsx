"use client";

import { useState } from "react";
import { FileText, Settings, Sparkles, ArrowRight } from "lucide-react";
import PromptInput from "@/components/PromptInput";
import SRSViewer from "@/components/SRSViewer";

export default function Home() {
  const [srsData, setSrsData] = useState<any>(null);

  const handleGenerationResult = (data: any) => {
    setSrsData(data);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              SRSify AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Documentation</button>
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-10 px-4 text-center max-w-4xl mx-auto print:hidden">
        <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          Academic-Grade Documentation Generator
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 text-slate-900">
          From Raw Idea to <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Professional Blueprint</span>
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Instantly transform your project concepts into IEEE-structured Software Requirements Specifications, complete with target personas and architectural diagrams.
        </p>
      </section>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          <PromptInput onResult={handleGenerationResult} />
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">How it works</h4>
             <ul className="text-sm text-slate-600 space-y-3">
               <li className="flex items-start leading-relaxed"><ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-indigo-400"/> Describe your application's purpose and target audience.</li>
               <li className="flex items-start leading-relaxed"><ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-indigo-400"/> We extract features and formulate non-functional requirements.</li>
               <li className="flex items-start leading-relaxed"><ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-indigo-400"/> View, edit, and export your polished document as PDF.</li>
             </ul>
          </div>
        </div>

        {/* Right Column: Output Viewer */}
        <div className="lg:col-span-8">
          <SRSViewer data={srsData} />
        </div>
      </div>
    </main>
  );
}
