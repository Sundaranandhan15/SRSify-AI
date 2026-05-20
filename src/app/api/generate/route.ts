import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Fallback is provided so build doesn't crash if env isn't loaded yet.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "placeholder");

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "placeholder") {
      return NextResponse.json(
        { error: "Gemini API key not configured on server. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const { idea } = await req.json();

    if (!idea || idea.trim() === "") {
      return NextResponse.json({ error: "No project idea provided." }, { status: 400 });
    }

    const systemPrompt = `You are an expert Software Architect and Business Analyst.
Generate a structured Software Requirements Specification (SRS) suitable for academic submission, based on the user's project idea.
You MUST return your response as a RAW, valid JSON object matching this exact schema:

{
  "document": {
    "title": "string",
    "introduction": "string (markdown)",
    "description": "string (markdown)",
    "features": [
       { "id": "F1", "name": "string", "description": "string", "useCase": "string" }
    ],
    "nonFunctional": ["string"],
    "architecture": "string (markdown)"
  },
  "personas": [
    { "name": "string", "role": "string", "goal": "string", "problem": "string" }
  ],
  "diagrams": {
    "useCase": "string (STRICT MERMAID RULE: Provide ONLY valid flowchart syntax. Every node MUST have an alphanumeric ID. Correct: U((User)) --> UC1[Log In]. Incorrect: U((User)) --> (Log In) or actor User. NO markdown code blocks or em-dashes. Example: flowchart TD\\n  U((User)) --> UC1[Login])",
    "systemArchitecture": "string (STRICT MERMAID RULE: Provide ONLY valid flowchart syntax. Every node MUST have an alphanumeric ID. DO NOT nest shapes like ID[((Text))]. Use standard forms like API[Gateway] or DB[(Database)]. NO markdown code blocks or em-dashes. Example: flowchart TD\\n  App[Mobile] --> API[Gateway]\\n  API --> DB[(SQL DB)])"
  }
}

Do NOT wrap the output in \`\`\`json markdown blocks. Return ONLY the raw parseable JSON object.`;

    const requestContent = [
      { text: systemPrompt },
      { text: `User Idea: ${idea}` }
    ];

    // Array of fallback models to handle 503 service unavailable or model quota issues
    const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let result = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`Attempting SRS generation using model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });
        result = await model.generateContent(requestContent);
        if (result) {
          console.log(`Successfully generated SRS using model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or was unavailable:`, err.message || err);
        lastError = err;
      }
    }

    if (!result) {
      throw lastError || new Error("All configured Gemini models failed to generate content.");
    }

    let responseText = result.response.text();
    
    // Safety cleanup: strictly extract JSON boundaries
    const startIdx = responseText.indexOf("{");
    const endIdx = responseText.lastIndexOf("}");
    if (startIdx !== -1 && endIdx !== -1) {
       responseText = responseText.substring(startIdx, endIdx + 1);
    }

    try {
      const payload = JSON.parse(responseText);
      return NextResponse.json(payload, { status: 200 });
    } catch (parseError) {
      console.error("Failed to parse Gemini output:", responseText);
      throw new Error(`Gemini returned invalid JSON structure. Length: ${responseText.length}`);
    }

  } catch (error: any) {
    console.error("Generation route error:", error);
    return NextResponse.json({ error: "Failed to generate SRS content. " + error.message }, { status: 500 });
  }
}
