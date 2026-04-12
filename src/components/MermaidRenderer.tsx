"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid configurations safely
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "var(--font-geist-sans), sans-serif"
});

interface MermaidRendererProps {
  chart: string;
}

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    const renderChart = async () => {
      if (chart) {
        try {
          // Generate unique ID for the mermaid render instance to prevent conflicts
          const id = `mermaid-svg-${Math.round(Math.random() * 10000000)}`;
          
          // Remove ALL markdown code block backticks and language hints that the LLM might have included anywhere
          let cleanChart = chart.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "").trim();
          
          // Normalize typography: LLMs often auto-format double hyphens into em-dashes (—) or en-dashes (–)
          // This breaks Mermaid.js parser since it expects strict ASCII '--' syntax.
          cleanChart = cleanChart.replace(/—|–/g, "--");
          
          const { svg } = await mermaid.render(id, cleanChart);
          setSvgContent(svg);
        } catch (error) {
          console.error("Mermaid rendering failed:", error);
          // Safely encode html entities for display in error block
          const safeChartString = chart.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          const errorMsg = error instanceof Error ? error.message : String(error);
          setSvgContent(`<div class='text-red-500 text-sm font-medium py-4 text-center'>
            Failed to render diagram. Engine Error: <br/><b>${errorMsg}</b><br/><br/>
            Raw Syntax:
            <pre class="mt-4 p-4 bg-red-50 border border-red-100 rounded text-left overflow-x-auto text-xs text-red-900">${safeChartString}</pre>
          </div>`);
        }
      }
    };
    
    // Slight delay to ensure DOM environment is ready 
    const timeout = setTimeout(() => {
       renderChart();
    }, 100);

    return () => clearTimeout(timeout);
  }, [chart]);

  return (
    <div 
      ref={containerRef}
      className="flex justify-center items-center p-8 overflow-x-auto min-h-[300px] border border-slate-100 rounded-xl bg-slate-50/50"
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
}
