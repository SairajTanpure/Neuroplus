import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!apiKey });
});

// Gemini Micro-Lesson & Intervention Generator Route
app.post("/api/gemini/generate-intervention", async (req, res) => {
  try {
    const { studentName, conceptName, rootCauseConceptName, qnaStyle, confidenceScore, learningStyle } = req.body;

    if (!ai) {
      // Return smart fallback if API key is not configured
      return res.json({
        title: `AI Root-Cause Remediation: ${rootCauseConceptName}`,
        summary: `Analysis shows that ${studentName}'s struggle in ${conceptName} (Confidence: ${confidenceScore}%) stems directly from an unaddressed prerequisite gap in ${rootCauseConceptName}.`,
        keyAnalogy: `Think of ${rootCauseConceptName} as the foundational pillar—you cannot build the high-level roof of ${conceptName} without securing this base first.`,
        stepByStep: [
          `Step 1: Re-visit the core formula and definitions of ${rootCauseConceptName}.`,
          `Step 2: Solve 2 fundamental practice warm-ups without skipping algebra steps.`,
          `Step 3: Connect ${rootCauseConceptName} back to ${conceptName} through guided u-substitution.`
        ],
        practiceQuestions: [
          {
            id: 'gen-1',
            question: `Which fundamental principle of ${rootCauseConceptName} is required before evaluating ${conceptName}?`,
            options: [
              `Decomposing derivative terms into sub-components`,
              `Ignoring negative coefficients`,
              `Guessing initial conditions`,
              `Converting all variables to constants`
            ],
            correctIndex: 0,
            explanation: `Decomposing derivative or integral terms into sub-components is essential to prevent cascading errors in higher-level topics.`
          },
          {
            id: 'gen-2',
            question: `When applying ${rootCauseConceptName}, what common error occurs when student phrasing indicates hesitation?`,
            options: [
              `Misapplying the order of operations`,
              `Forgetting to calculate du/dx`,
              `Both A and B`,
              `None of the above`
            ],
            correctIndex: 2,
            explanation: `Hesitation in phrasing often flags confusion in sign conventions and chain-rule derivatives.`
          }
        ],
        peerCoachingStarter: `Hey classmate! I saw you mastered ${rootCauseConceptName} recently. Could you explain how you approach setting up these problems?`
      });
    }

    const prompt = `
You are NeuroPulse, an advanced AI Learning Co-Pilot and Cognitive Analytics engine.
Generate an immediate, targeted 2-minute micro-lesson and practice quiz for a student struggling with a root-cause gap.

Student Name: ${studentName}
Target Concept (Surface Symptom): ${conceptName}
True Root Cause Concept (Ancestor Gap): ${rootCauseConceptName}
Student Phrasing Style / Question Log Sentiment: "${qnaStyle || 'Confused, asking for step-by-step clarity'}"
Current Confidence Score: ${confidenceScore}%
Learning Style: ${learningStyle || 'Visual-Analogy'}

Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Short catchy title for the micro lesson",
  "summary": "Clear 2-sentence explanation connecting the root cause to the target concept",
  "keyAnalogy": "A memorable real-world analogy tailored to their learning style",
  "stepByStep": ["Step 1...", "Step 2...", "Step 3...", "Step 4..."],
  "practiceQuestions": [
    {
      "id": "q1",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed explanation why Option A is correct..."
    },
    {
      "id": "q2",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Detailed explanation..."
    }
  ],
  "peerCoachingStarter": "Friendly conversation starter prompt for a peer study match"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const jsonText = response.text ? response.text.trim() : "";
    const parsedData = JSON.parse(jsonText);
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate intervention" });
  }
});

async function startServer() {
  // Mount Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
