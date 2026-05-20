# SRSify-AI 🚀

An intelligent, professional AI-powered Software Requirements Specification (SRS) Generator designed to automatically draft standard, academic-grade SRS documentation, target personas, and dynamic architectural diagrams based on user-provided application ideas. Leveraging the power of Google's Gemini AI models (with built-in resilience and automatic failover fallbacks), SRSify-AI accelerates the planning phase of software development by creating highly detailed technical specifications in seconds.

## 🌟 Key Features

*   **Intelligent SRS Generation**: Describe your software idea, and the AI will automatically formulate a complete IEEE-standardized SRS document.
*   **Automatic API Failover Fallbacks**: Extremely robust API architecture that automatically cascades through fallback models (`gemini-2.5-flash` ➡️ `gemini-2.0-flash` ➡️ `gemini-1.5-flash`) to gracefully bypass transient 503 high-demand or rate-limiting errors.
*   **Dynamic Mermaid Diagram Rendering**: Automatically constructs and visualizes interactive system architecture flowcharts and use-case diagrams directly in the interface using `mermaid.js`.
*   **Polished PDF Export**: One-click download of the finalized, beautifully structured documentation in clean PDF format powered by `jsPDF` and `html2canvas`.
*   **Modern, Premium Workspace**: Built with a sleek, responsive Next.js workspace featuring customized layouts, smooth transitions, and premium styling.
*   **Academic Report Integration**: Includes the official project thesis/reports under the `/docs` folder.

## 🛠️ Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (React 19 / Turbopack)
*   **Styling:** Custom CSS & [Tailwind CSS](https://tailwindcss.com/)
*   **AI Engine:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini Developer API)
*   **Diagram Engine:** [Mermaid.js](https://mermaid.js.org/)
*   **Export Engine:** jsPDF & html2canvas
*   **Icons:** Lucide React

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (or yarn / pnpm)
*   A Google Gemini API key (Get one from [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sundaranandhan15/SRSify-AI.git
    cd SRSify-AI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Copy the `.env.example` template into a new `.env.local` file and add your Gemini API key:
    ```env
    # .env.local
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Access the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser to start generating specifications.

## 📁 Repository Structure

```
├── docs/                     # Academic reports & project reports
│   ├── SEPM_report-053.docx  # Standard Word document report
│   └── srs_document.md       # Markdown version of the academic report
├── public/                   # Static assets & icons
├── src/
│   ├── app/                  # Next.js App Router & API routes
│   │   └── api/generate/     # Robust backend AI routing with model cascade
│   └── components/           # UI components (Mermaid, Prompt, Viewer)
├── .env.example              # Template environment configuration
└── tsconfig.json             # TypeScript configuration
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
