# SRSify AI — Complete Project Documentation Report

> **Project Name:** SRSify AI — Academic SRS Document Generator  
> **Repository:** https://github.com/DEEPA-356/SRS-generator  
> **Technology:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Google Gemini AI  
> **Report Date:** April 2026  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [Configuration & Environment](#5-configuration--environment)
6. [Source File Documentation](#6-source-file-documentation)
7. [AI Integration — Gemini API](#7-ai-integration--gemini-api)
8. [Data Schema & JSON Contract](#8-data-schema--json-contract)
9. [Key Features](#9-key-features)
10. [Dependencies](#10-dependencies)
11. [Scripts & Commands](#11-scripts--commands)

---

## 1. Project Overview

**SRSify AI** is an intelligent web application that automatically generates professional, IEEE-structured **Software Requirements Specifications (SRS)** from a plain-language project idea entered by the user. The system leverages Google's **Gemini 2.5 Flash** large language model to produce:

- A structured SRS document (Introduction, Description, System Features, Non-Functional Requirements, Architecture Review)
- Realistic **target user personas** (name, role, goal, pain point)
- **Mermaid-format system diagrams** (Use Case Diagram & System Architecture Diagram)

The primary audience for this tool is university students and engineers who need to rapidly prototype documentation as part of an academic or professional project lifecycle.

### Problem Statement
Creating a thorough SRS document manually is a time-consuming, expertise-heavy task typically spanning multiple days. **SRSify AI** collapses that effort into seconds by using AI to scaffold the entire document structure from a single user prompt.

### Solution
A full-stack Next.js web application where the user inputs a project idea on the frontend. That idea is sent to a secure Next.js API route, which calls the Gemini API and returns a structured JSON object. The frontend then renders the parsed JSON as a rich, multi-tabbed document viewer with PDF export capability.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 16.2.1 | Full-stack React framework (App Router) |
| UI Library | React | 19.2.4 | Component-based frontend rendering |
| Language | TypeScript | ^5 | Type-safe JavaScript |
| Styling | Tailwind CSS | ^4.0 | Utility-first CSS framework |
| AI Model | Google Gemini | gemini-2.5-flash | LLM for SRS generation |
| AI SDK | @google/generative-ai | ^0.24.1 | Official Gemini Node.js client |
| Diagramming | Mermaid.js | ^11.13.0 | Flowchart/diagram rendering in browser |
| PDF Export | jsPDF + html2canvas | ^4.2.1 / ^1.4.1 | Document export to PDF |
| Icons | Lucide React | ^1.7.0 | SVG icon library |
| Build Tool | Turbopack | (bundled with Next.js 16) | High-performance dev bundler |
| CSS PostCSS | @tailwindcss/postcss | ^4 | PostCSS plugin for Tailwind v4 |
| Utilities | clsx, tailwind-merge | ^2.1.1, ^3.5.0 | Conditional CSS class helpers |

---

## 3. Project Structure

```
srs-generator/                       <- Root project directory
├── .env.local                        <- Secret environment variables (not committed)
├── .gitignore                        <- Git ignore rules
├── next.config.ts                    <- Next.js configuration
├── postcss.config.mjs                <- PostCSS/Tailwind configuration
├── tsconfig.json                     <- TypeScript compiler config
├── package.json                      <- Project metadata & dependency list
├── package-lock.json                 <- Locked dependency tree
├── README.md                         <- Project readme
├── models.txt                        <- Reference list of Gemini model names
└── src/
    ├── app/
    │   ├── layout.tsx                <- Root HTML layout (fonts, metadata, body wrapper)
    │   ├── page.tsx                  <- Main app page (Home component)
    │   ├── globals.css               <- Global CSS & Tailwind import
    │   └── api/
    │       └── generate/
    │           └── route.ts          <- POST API route: calls Gemini, returns SRS JSON
    └── components/
        ├── PromptInput.tsx           <- User input form component
        ├── SRSViewer.tsx             <- Tabbed SRS document viewer + export controls
        └── MermaidRenderer.tsx       <- Mermaid.js diagram renderer component
```

---

## 4. Architecture & Data Flow

The application follows a **client → server → AI → client** pattern.

### Request Lifecycle (Step-by-Step)

1. **User Input**: The user types a project description in the `PromptInput` textarea and clicks **"Generate SRS"**.
2. **Frontend API Call**: `PromptInput` sends a `POST` request to `/api/generate` with `{ idea: "..." }` as the JSON body.
3. **Server Route Processing** (`route.ts`):
   - Validates that `GEMINI_API_KEY` is configured.
   - Constructs a precise **system prompt** instructing Gemini to return a specific JSON schema.
   - Calls `model.generateContent()` with `responseMimeType: "application/json"` for reliable structured output.
   - Extracts raw JSON by finding the first `{` and last `}` in the response for safety.
   - Parses the JSON and sends it back as the API response.
4. **State Update**: The `Home` page component receives the data via the `onResult` callback and stores it in React state (`srsData`).
5. **Rendering**: `SRSViewer` receives `srsData` and renders it across 3 tabs: Document, Personas, and Diagrams.
6. **Diagram Rendering**: `MermaidRenderer` receives mermaid syntax strings, cleans them (removes markdown code fences and fixes en/em dashes), and renders them as inline SVGs.
7. **Export**: User can export the document as a formatted PDF (via `window.print()`) or a Markdown report (via Blob download).

---

## 5. Configuration & Environment

### `.env.local`
This file stores secret keys and is excluded from version control via `.gitignore`.

```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
```

**IMPORTANT:** This key must be obtained from Google AI Studio. Without it, all generation attempts will return a 500 error. The key is a **server-side** variable and is never exposed to the browser.

### `next.config.ts`
The Next.js configuration is minimal and uses all default settings, relying on Next.js 16's built-in Turbopack for development.

### `postcss.config.mjs`
Configured to use the `@tailwindcss/postcss` plugin, which is required for Tailwind CSS v4's new PostCSS-based build pipeline.

### `tsconfig.json`
Standard TypeScript configuration for Next.js with `@/*` path alias pointing to `./src/*`, enabling clean absolute imports throughout the project.

---

## 6. Source File Documentation

### 6.1 App Entry Point — `layout.tsx`

**Path:** `src/app/layout.tsx`

This is the **Root Layout** component for the Next.js App Router. It wraps every page in the application.

**Responsibilities:**
- Loads and applies **Geist Sans** and **Geist Mono** fonts from Google Fonts via `next/font`.
- Sets the global HTML `<html>` and `<body>` wrapper with font CSS variables.
- Exports **page metadata** (title and description) used for SEO and browser tab title.

**Metadata:**
- **Title:** `SRSify AI - Academic Document Generator`
- **Description:** `Generate IEEE-structured Software Requirements Specifications instantly using standard LLMs.`

---

### 6.2 Main Page — `page.tsx`

**Path:** `src/app/page.tsx`  
**Directive:** `"use client"` (Client Component)

This is the **Home page** — the single-page interface of the application. It manages the top-level application state and orchestrates component layout.

**State:**
| State Variable | Type | Purpose |
|---|---|---|
| `srsData` | `any or null` | Holds the generated SRS JSON returned from the API |

**Layout Structure:**
- `<header>` — Sticky top navigation bar with the SRSify AI logo/brand.
- **Hero Section** — Headline, tagline, and description of the tool.
- **Main Workspace (12-column CSS Grid):**
  - **Left Column (4/12):** `PromptInput` component + "How it works" guide card.
  - **Right Column (8/12):** `SRSViewer` component displaying generated output.

**Key Logic:**
- The `handleGenerationResult` function is passed as the `onResult` prop to `PromptInput`. When generation succeeds, it updates `srsData` state, causing `SRSViewer` to re-render with the new document.

---

### 6.3 API Route — `api/generate/route.ts`

**Path:** `src/app/api/generate/route.ts`  
**HTTP Method:** `POST`  
**Endpoint:** `/api/generate`

This is the **server-side API handler** that bridges the frontend and the Gemini AI service. It runs entirely on the server (Node.js) and keeps the API key secure.

**Request Body:**
```json
{ "idea": "A mobile app that helps students track assignments..." }
```

**Validation Logic:**
1. Checks if `GEMINI_API_KEY` is set; returns `500` if missing.
2. Checks if `idea` field is present and non-empty; returns `400` if not.

**AI Model Configuration:**
- **Model:** `gemini-2.5-flash`
- **Response MIME Type:** `application/json` — Forces structured JSON output from Gemini.

**Prompt Engineering:**
The system prompt instructs Gemini to act as an "expert Software Architect and Business Analyst" and provides a strict JSON schema that the model must follow. The schema includes sections for `document`, `personas`, and `diagrams`.

**JSON Safety Cleanup:**
After receiving Gemini's response, the code defensively extracts valid JSON by finding the first `{` and last `}` characters, stripping any accidental markdown wrappers.

**Error Handling:**
- Returns `500` with a descriptive message if JSON parsing fails or Gemini throws an error.

**Response (Success — 200):**
Returns the parsed, structured SRS JSON object (see Section 8).

---

### 6.4 Component — `PromptInput.tsx`

**Path:** `src/components/PromptInput.tsx`  
**Directive:** `"use client"`

A self-contained input form that allows the user to write a project idea and trigger SRS generation.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `onResult` | `(data: any) => void` | Callback invoked with the parsed SRS JSON on success |

**Internal State:**
| State | Type | Purpose |
|---|---|---|
| `idea` | `string` | The current value of the textarea |
| `isGenerating` | `boolean` | Whether an API call is in progress (shows spinner) |
| `error` | `string or null` | Error message to display if generation fails |

**UI Elements:**
- **Textarea** — Multi-line input with a descriptive placeholder.
- **Character Counter** — Displays live character count below the textarea.
- **Error Alert** — Shown conditionally with a red background when `error` is set.
- **Generate Button** — Disabled when idea is empty or generation is in progress. Shows a spinning `Loader2` icon during the API call.

---

### 6.5 Component — `SRSViewer.tsx`

**Path:** `src/components/SRSViewer.tsx`  
**Directive:** `"use client"`

The primary output display component. It receives the generated SRS JSON and renders it in a rich, multi-tabbed viewer with export controls.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `data` | `any` | The structured SRS JSON object from the API |

**Tabs:**

| Tab | Icon | Shows |
|---|---|---|
| Document | LayoutTemplate | Full SRS document with all sections |
| Personas | Users | Target user persona cards |
| Diagrams | Code | Use Case and Architecture diagrams |

**Export Functions:**

| Function | Method | Output |
|---|---|---|
| `handleCopy` | `navigator.clipboard` | Copies raw JSON to clipboard |
| `handleExportPDF` | `window.print()` | Triggers browser's native print dialog (saves as PDF) |
| `handleExportFullReport` | Blob download | Downloads a `.md` markdown file with the full report |

**Sub-Components (defined in same file):**

- **`TabButton`** — Styled tab navigation button; active tab gets indigo border underline.
- **`DocumentView`** — Renders the 5 SRS sections: Introduction, Overall Description, System Features (feature cards with use cases), Non-Functional Requirements (bullet list), and Architecture Overview.
- **`PersonasView`** — Renders each persona as a card in a 2-column grid. Each card has a coloured left border and shows Name, Role, Goal, and Problem Faced.
- **`DiagramsView`** — Renders two diagram sections by passing mermaid syntax strings to `MermaidRenderer`.

**Print/PDF Behaviour:**
- The header, hero section, and input panel use `print:hidden` CSS to be excluded from print output.
- All 3 tab views use `print:block` to be rendered simultaneously, with `print:break-before-page` for page separation.

---

### 6.6 Component — `MermaidRenderer.tsx`

**Path:** `src/components/MermaidRenderer.tsx`  
**Directive:** `"use client"`

A dedicated component for safely rendering **Mermaid.js diagrams** from raw syntax strings produced by the AI.

**Props:**
| Prop | Type | Description |
|---|---|---|
| `chart` | `string` | Raw Mermaid diagram syntax string |

**Mermaid Initialization (Global Config):**
- `startOnLoad: false` — Prevents auto-scanning DOM
- `theme: "default"` — Standard light theme
- `securityLevel: "loose"` — Required to render SVG from dynamic content
- `fontFamily` — Uses the Geist Sans CSS variable for consistent typography

**Rendering Logic (`useEffect`):**
1. A unique ID is generated to prevent conflicts between multiple instances.
2. The chart string is **sanitized**:
   - All markdown code fences are stripped.
   - **Em-dashes and en-dashes are replaced with ASCII `--`**, as LLMs often auto-format double hyphens into typographic dashes which break the Mermaid parser.
3. `mermaid.render(id, cleanChart)` is called asynchronously.
4. The returned SVG string is stored in state and injected via `dangerouslySetInnerHTML`.
5. A 100ms timeout ensures the DOM is ready before rendering.

**Error Handling:**
If Mermaid fails to parse the syntax, a red error box is displayed showing the engine's error message and the raw syntax for debugging.

---

### 6.7 Global Styles — `globals.css`

**Path:** `src/app/globals.css`

Minimal global stylesheet. Imports Tailwind CSS v4 and sets up custom CSS typography tokens.

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background-color: theme('colors.slate.50');
  color: theme('colors.slate.900');
}

@media print {
  body { background: white !important; }
}
```

The `@theme` block registers the Geist font variables as Tailwind's design tokens, making them available globally via the `font-sans` utility class.

---

## 7. AI Integration — Gemini API

The application uses **Google Gemini 2.5 Flash** via the official `@google/generative-ai` SDK (v0.24.1).

### Why Gemini 2.5 Flash?
- **Speed:** Flash-series models are optimized for low-latency responses — ideal for interactive web use.
- **JSON Mode:** Supports `responseMimeType: "application/json"` for reliable structured output.
- **Cost:** Available on Google AI Studio's free tier.

### Prompt Design Strategy
The model is given a **role instruction** and a **strict JSON schema** with inline documentation explaining what each field should contain. The Mermaid diagram fields include explicit syntax rules to prevent common LLM mistakes:

```
STRICT MERMAID RULE: Provide ONLY valid flowchart syntax.
Every node MUST have an alphanumeric ID.
Correct: U((User)) --> UC1[Log In]
Incorrect: U((User)) --> (Log In) or actor User
NO markdown code blocks or em-dashes.
```

---

## 8. Data Schema & JSON Contract

The API route returns the following JSON structure on a successful `200` response:

```json
{
  "document": {
    "title": "string",
    "introduction": "string (markdown)",
    "description": "string (markdown)",
    "features": [
      {
        "id": "F1",
        "name": "string",
        "description": "string",
        "useCase": "string"
      }
    ],
    "nonFunctional": ["string"],
    "architecture": "string (markdown)"
  },
  "personas": [
    {
      "name": "string",
      "role": "string",
      "goal": "string",
      "problem": "string"
    }
  ],
  "diagrams": {
    "useCase": "string (mermaid flowchart syntax)",
    "systemArchitecture": "string (mermaid flowchart syntax)"
  }
}
```

**Error response (4xx/5xx):**
```json
{ "error": "Human-readable error message" }
```

---

## 9. Key Features

| Feature | Description |
|---|---|
| **AI SRS Generation** | Generates complete IEEE-structured SRS documents from a one-line project idea |
| **Tabbed Viewer** | Organized output across Document, Personas, and Diagrams tabs |
| **Persona Cards** | Visual cards for each target user with their goals and pain points |
| **Mermaid Diagrams** | Live-rendered Use Case and System Architecture flowchart diagrams |
| **PDF Export** | Export formatted document via browser's native print-to-PDF feature |
| **Markdown Export** | Download the full SRS report as a `.md` file |
| **JSON Copy** | Copy the raw AI-generated JSON object to clipboard |
| **Inline Error Handling** | User-facing error messages for API failures and validation errors |
| **Responsive Layout** | 12-column CSS grid collapses automatically for mobile screens |
| **Print Optimization** | `@media print` styles hide UI chrome and show all tabs for clean export |

---

## 10. Dependencies

### Production Dependencies
| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.1 | Full-stack React framework |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | DOM rendering for React |
| `@google/generative-ai` | ^0.24.1 | Gemini API client SDK |
| `mermaid` | ^11.13.0 | Diagram rendering library |
| `jspdf` | ^4.2.1 | PDF generation library |
| `html2canvas` | ^1.4.1 | HTML-to-canvas conversion (for PDF) |
| `lucide-react` | ^1.7.0 | SVG icon components |
| `clsx` | ^2.1.1 | Conditional className utility |
| `tailwind-merge` | ^3.5.0 | Merges Tailwind class conflicts |

### Development Dependencies
| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^4 | CSS utility framework |
| `@tailwindcss/postcss` | ^4 | PostCSS integration for Tailwind v4 |
| `typescript` | ^5 | TypeScript compiler |
| `@types/node` | ^20 | Node.js type definitions |
| `@types/react` | ^19 | React type definitions |
| `@types/react-dom` | ^19 | React DOM type definitions |
| `eslint` | ^9 | JavaScript/TypeScript linter |
| `eslint-config-next` | 16.2.1 | Next.js-specific ESLint rules |

---

## 11. Scripts & Commands

```bash
# Start development server with hot reload (Turbopack)
npm run dev

# Build the production bundle
npm run build

# Start the production server (after build)
npm run start

# Run ESLint for code quality checks
npm run lint
```

The development server runs at **http://localhost:3000** by default.

---

*This documentation was generated for the SRSify AI project — April 2026.*
