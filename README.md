# AI-Powered SRS Generator

An intelligent, modern web application designed to automatically generate professional Software Requirements Specifications (SRS) based on user-provided application ideas. Leveraging the power of Google's Gemini AI, this tool accelerates the planning phase of software development by drafting comprehensive documentation, structural diagrams, and technical requirements.

## 🌟 Key Features

*   **Intelligent SRS Generation**: Just describe your software idea, and the AI handles the heavy lifting, structuring a complete standardized SRS document.
*   **Mermaid Diagram Integration**: Automatically generates and renders architecture and flow diagrams within the document using `mermaid.js`.
*   **PDF Export Export**: Export your finalized generated documents to a clean, highly readable PDF format using `jsPDF` and `html2canvas`.
*   **Modern, Responsive UI**: Built with Next.js and Tailwind CSS, featuring a beautiful UI enhanced by `lucide-react` icons.

## 🛠️ Technology Stack

*   **Framework:** [Next.js](https://nextjs.org/) (React)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI Integration:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini API)
*   **Diagramming:** [Mermaid](https://mermaid.js.org/)
*   **PDF Generation:** jsPDF & html2canvas
*   **Icons:** Lucide React

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (or yarn/pnpm/bun)
*   A Google Gemini API key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DEEPA-356/SRS-generator.git
    cd srs-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env.local` file in the root directory of the project and add your Gemini API key:
    ```env
    # Example .env.local content
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
    *(Note: The exact variable name might depend on your implementation, typically `GEMINI_API_KEY` or `NEXT_PUBLIC_GEMINI_API_KEY`)*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Access the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the generator.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
