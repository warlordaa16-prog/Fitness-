import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client safely (lazy or check key)
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey });
}

// In-memory social feed & workouts store for demo persistence
let socialPosts = [
  {
    id: "post-1",
    author: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    time: "2 hours ago",
    content: "Just smashed my 10km morning run! 🏃‍♀️ Personal best time of 48:20. Consistency is key!",
    workoutType: "Running",
    duration: "48 mins",
    calories: "520 kcal",
    likes: 24,
    comments: [
      { id: "c1", author: "Alex Rivera", text: "Incredible pace Sarah! Keep it up!", time: "1 hr ago" },
      { id: "c2", author: "Coach Mike", text: "Fantastic splits!", time: "45 mins ago" }
    ],
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600"
  },
  {
    id: "post-2",
    author: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    time: "5 hours ago",
    content: "Upper body hypertrophy session completed. New PR on bench press (102.5kg x 5)! 💪",
    workoutType: "Strength",
    duration: "65 mins",
    calories: "450 kcal",
    likes: 42,
    comments: [
      { id: "c3", author: "David Chen", text: "Beast mode! Let's go!", time: "3 hrs ago" }
    ],
    image: null
  },
  {
    id: "post-3",
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    time: "Yesterday",
    content: "Morning Vinyasa Flow to center the mind and stretch out those tight hamstrings. Yoga is such a game changer for recovery. 🧘‍♀️",
    workoutType: "Yoga",
    duration: "40 mins",
    calories: "210 kcal",
    likes: 19,
    comments: [],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600"
  }
];

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Social Posts API
app.get("/api/posts", (req, res) => {
  res.json(socialPosts);
});

app.post("/api/posts", (req, res) => {
  const { author, avatar, content, workoutType, duration, calories, image } = req.body;
  const newPost = {
    id: `post-${Date.now()}`,
    author: author || "You",
    avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    time: "Just now",
    content,
    workoutType: workoutType || "Workout",
    duration: duration || "30 mins",
    calories: calories || "300 kcal",
    likes: 0,
    comments: [],
    image: image || null
  };
  socialPosts.unshift(newPost);
  res.json(newPost);
});

app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const post = socialPosts.find(p => p.id === id);
  if (post) {
    post.likes += 1;
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

app.post("/api/posts/:id/comment", (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;
  const post = socialPosts.find(p => p.id === id);
  if (post) {
    const comment = {
      id: `c-${Date.now()}`,
      author: author || "You",
      text,
      time: "Just now"
    };
    post.comments.push(comment);
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// AI Coach endpoint using @google/genai
app.post("/api/ai/coach", async (req, res) => {
  try {
    const { prompt, userStats, goal } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are FitPulse AI, an expert, encouraging, and science-backed fitness and nutrition coach. 
    User Profile Context: 
    - Goal: ${goal || "General Fitness & Muscle Tone"}
    - Stats: ${JSON.stringify(userStats || {})}
    
    Provide actionable, motivating, and personalized fitness advice, workout tips, or nutrition guidelines. Keep responses structured and engaging.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemInstruction}\n\nUser Question/Request: ${prompt}` }] }
      ]
    });

    const reply = response.text || "Keep pushing towards your goals! Drink water and stay consistent.";
    res.json({ reply });
  } catch (error: any) {
    console.error("AI Coach Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI coaching advice" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
