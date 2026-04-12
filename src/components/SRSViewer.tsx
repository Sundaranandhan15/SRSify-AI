"use client";

import { useState } from "react";
import { Download, Copy, Code, LayoutTemplate, Users, Check, Loader2, FileText } from "lucide-react";
import MermaidRenderer from "./MermaidRenderer";

type TabState = "document" | "personas" | "diagrams";

export default function SRSViewer({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState<TabState>("document");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    // Native browser printing creates superior text-selectable PDFs 
    // and naturally bypasses the html2canvas parsing errors for modern Tailwind colors.
    // We configured @media print in globals.css to format everything beautifully!
    window.print();
  };

  const handleExportFullReport = () => {
    if (!data) return;
    
    // Core document details
    let md = `# ${data.document.title}\n\n`;
    md += `${data.document.description}\n\n`;
    
    // Requirements
    md += `## Functional Requirements\n`;
    if (data.document.functionalRequirements) {
      data.document.functionalRequirements.forEach((req: string) => md += `- ${req}\n`);
    }
    
    md += `\n## Non-Functional Requirements\n`;
    if (data.document.nonFunctionalRequirements) {
      data.document.nonFunctionalRequirements.forEach((req: string) => md += `- ${req}\n`);
    }
    
    md += `\n# Target Personas\n\n`;
    data.personas.forEach((p: any) => md += `### ${p.name} (${p.role})\n**Goal:** ${p.goal}\n**Pain Point:** ${p.problem}\n\n`);
    md += `# System Diagrams\n\n## Use Case Diagram\n\`\`\`mermaid\n${data.diagrams.useCase}\n\`\`\`\n\n## System Architecture Diagram\n\`\`\`mermaid\n${data.diagrams.systemArchitecture}\n\`\`\`\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.document.title.replace(/\s+/g, '_')}_Full_Report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-[800px] print:h-auto print:border-none print:shadow-none flex flex-col overflow-hidden print:overflow-visible">
      {/* Viewer Header / Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 px-2 bg-slate-50 print:hidden">
        <div className="flex items-center p-1 space-x-1">
          <TabButton 
            active={activeTab === "document"} 
            onClick={() => setActiveTab("document")}
            icon={<LayoutTemplate className="w-4 h-4 mr-2" />}
            label="Document"
          />
          <TabButton 
            active={activeTab === "personas"} 
            onClick={() => setActiveTab("personas")}
            icon={<Users className="w-4 h-4 mr-2" />}
            label="Personas"
          />
          <TabButton 
            active={activeTab === "diagrams"} 
            onClick={() => setActiveTab("diagrams")}
            icon={<Code className="w-4 h-4 mr-2" />}
            label="Diagrams"
          />
        </div>
        
        <div className="flex items-center space-x-2 pr-4">
          <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Copy raw JSON source">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleExportFullReport} 
            disabled={!data}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md shadow-sm hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4 mr-2" />
            Full Report (.md)
          </button>
          <button 
            onClick={handleExportPDF} 
            disabled={!data}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Viewer Content Area */}
      <div id="srs-document-content" className="flex-1 overflow-y-auto print:overflow-visible p-8 print:p-0 bg-white">
        {!data ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <LayoutTemplate className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No output generated yet</h3>
            <p className="text-slate-500 max-w-sm">
              Enter your project idea in the left panel and click generate to instantly construct your structured SRS document.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className={`print:block ${activeTab === "document" ? "block" : "hidden"}`}>
              <DocumentView doc={data.document} />
            </div>
            
            <div className={`print:block print:break-before-page print:mt-12 ${activeTab === "personas" ? "block" : "hidden"}`}>
              <PersonasView personas={data.personas} />
            </div>
            
            <div className={`print:block print:break-before-page print:mt-12 ${activeTab === "diagrams" ? "block" : "hidden"}`}>
              <DiagramsView diagrams={data.diagrams} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors \${
        active 
          ? "bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]" 
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// Subcomponents for the views
function DocumentView({ doc }: { doc: any }) {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{doc.title || "Software Requirements Specification"}</h1>
        <hr className="border-slate-200 my-4" />
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Introduction</h2>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{doc.introduction}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Overall Description</h2>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{doc.description}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">3. System Features</h2>
        <div className="space-y-4">
          {doc.features?.map((f: any, i: number) => (
             <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-semibold text-indigo-900 mb-1">{f.id}: {f.name}</h4>
                <p className="text-sm text-slate-600 mb-2">{f.description}</p>
                <div className="text-sm bg-white p-2 border border-slate-200 rounded-md">
                   <strong>Use Case: </strong> {f.useCase}
                </div>
             </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Non-Functional Requirements</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-indigo-400">
           {doc.nonFunctional?.map((n: string, i: number) => (
             <li key={i}>{n}</li>
           ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Architecture Overview</h2>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{doc.architecture}</p>
      </section>
    </div>
  );
}

function PersonasView({ personas }: { personas: any[] }) {
  return (
    <div className="space-y-6 max-w-3xl">
       <h2 className="text-2xl font-bold text-slate-900 mb-6">Target User Personas</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {personas?.map((p: any, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
              <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-4">{p.role}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400 mb-1">Goal</h4>
                  <p className="text-sm text-slate-700">{p.goal}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400 mb-1">Problem Faced</h4>
                  <p className="text-sm text-slate-700">{p.problem}</p>
                </div>
              </div>
            </div>
         ))}
       </div>
    </div>
  );
}

function DiagramsView({ diagrams }: { diagrams: any }) {
  return (
    <div className="space-y-10 max-w-4xl">
       <h2 className="text-2xl font-bold text-slate-900 mb-6">System Diagrams</h2>
       
       <section>
         <h3 className="text-lg font-semibold text-slate-800 mb-4">Use Case Diagram</h3>
         {diagrams?.useCase ? (
            <MermaidRenderer chart={diagrams.useCase} />
         ) : (
            <p className="text-slate-500 text-sm">No use case diagram generated.</p>
         )}
       </section>
       
       <section>
         <h3 className="text-lg font-semibold text-slate-800 mb-4">System Architecture Diagram</h3>
         {diagrams?.systemArchitecture ? (
            <MermaidRenderer chart={diagrams.systemArchitecture} />
         ) : (
            <p className="text-slate-500 text-sm">No architecture diagram generated.</p>
         )}
       </section>
    </div>
  );
}
