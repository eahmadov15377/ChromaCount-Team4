# ChromaCount: Intelligent Color Palette Analyzer

**ChromaCount** is a smart web-based tool that uses the Gemini AI API to extract dominant colors from images and generate semantic "mood tags." It assists designers and developers by providing automated WCAG accessibility auditing for every generated palette.

## 🚀 Features
* **AI-Powered Extraction:** Uses Google Gemini to identify dominant colors and palette mood (e.g., "Vibrant", "Retro").
* **Accessibility First:** Automatically generates a contrast matrix checking WCAG AA compliance for all color pairs.
* **Developer Friendly:** Export palettes directly to CSS variables or toggle between HEX, RGB, and HSL formats.
* **Privacy Focused:** No images are stored on servers; all processing is transient.

## Live Demo
Check out the live application here: https://chroma-count-team4.vercel.app/

## 🛠️ Installation & Setup
1.  **Clone the repository**
    ```bash
    git clone https://github.com/eahmadov15377ChromaCount-Team4
    cd chromacount
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

## 👥 Team Bozqurdlar (Team 4)
* **Eljan Ahmadov** - Team Lead & Backend/Algo (Core Analysis Algorithms)
* **Rafig Asgarli** - Frontend Lead (UI Architecture & Interactions)
* **Fikrat Rustamli** - UI/UX Designer (Responsive Design & Styling)
* **Khayyam Najafli** - QA & Logic (Accessibility Standards & Testing)

## ⚠️ Known Issues: Google Gemini API Quotas

**Note to Graders/Instructors:**
This application relies on the Google Gemini AI API. During development, we encountered specific constraints with the Google AI Free Tier:

1.  **Rate Limiting (429 Errors):** The API may return `Quota exceeded ... limit: 0`. This occurs because Google's experimental models (like Gemini 2.0/2.5) often have **zero free tier allowance**, and the "Stable" aliases (like `gemini-pro-latest`) sometimes redirect to these paid-only models automatically.
2.  **Service Overload (503 Errors):** The API occasionally returns `503 Service Unavailable` due to high traffic on the free tier models.

**If the analysis fails during a demo:**
*   Please wait 10-20 seconds and click "Analyze" again.
*   The error handling in the console/network tab will confirm if the issue is an upstream API rejection (429/503).

## 📄 License
Project submitted for CSCI 3509: Intro to Software Engineering, Fall 2025.