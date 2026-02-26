import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary Configuration
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "dikxn02y9";
const api_key = process.env.CLOUDINARY_API_KEY || "665566198629512";
const api_secret = process.env.CLOUDINARY_API_SECRET || "bbxn-CliEbDRay2u4lVuJ-vW1q8";

const isGeminiConfigured = !!process.env.GEMINI_API_KEY;
const isCloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) || 
                              (cloud_name === "dikxn02y9" && api_key === "665566198629512");

// Full mode requires BOTH Gemini (for authorization) and Cloudinary (for storage)
const isFullManagementEnabled = isGeminiConfigured && isCloudinaryConfigured;

if (isCloudinaryConfigured) {
  process.env.CLOUDINARY_URL = `cloudinary://${api_key}:${api_secret}@${cloud_name}`;
  cloudinary.config({ cloud_name, api_key, api_secret });
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "textgame-engine",
      format: "png",
      public_id: `img-${Date.now()}`,
    };
  },
});

const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Logging middleware for API requests
  app.use("/api", (req, res, next) => {
    console.log(`[API Request] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // API Routes
  app.get("/api/images", async (req, res) => {
    if (!isFullManagementEnabled) {
      return res.status(403).json({ error: "Management disabled. System Gemini API Key is required for Cloudinary operations." });
    }
    try {
      const { resources } = await cloudinary.api.resources({
        type: "upload",
        prefix: "textgame-engine/",
        max_results: 100,
      });
      res.json({ images: resources.map((r: any) => r.secure_url) });
    } catch (error) {
      console.error("Fetch images error:", error);
      res.status(500).json({ error: "Failed to fetch images from Cloudinary. Check API credentials." });
    }
  });

  app.post("/api/upload", (req, res, next) => {
    if (!isFullManagementEnabled) {
      return res.status(403).json({ error: "Upload disabled. System Gemini API Key is required." });
    }
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary Error:", err);
        return res.status(500).json({ error: err.message || "Upload middleware error" });
      }
      next();
    });
  }, (req, res) => {
    try {
      if (!req.file) {
        console.error("Upload attempt with no file");
        return res.status(400).json({ error: "No file uploaded" });
      }
      console.log("File uploaded successfully:", (req.file as any).path);
      res.json({ url: (req.file as any).path });
    } catch (error) {
      console.error("Route handler error:", error);
      res.status(500).json({ error: "Internal server error during upload" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      gemini: isGeminiConfigured,
      cloudinary: isCloudinaryConfigured,
      mode: isFullManagementEnabled ? "full" : "basic"
    });
  });

  app.delete("/api/images", async (req, res) => {
    if (!isFullManagementEnabled) {
      return res.status(403).json({ error: "Delete disabled. System Gemini API Key is required." });
    }
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "URL is required" });

      // Extract public_id from URL
      // Example: https://res.cloudinary.com/dikxn02y9/image/upload/v1740544520/textgame-engine/img-1740544517032.png
      // public_id: textgame-engine/img-1740544517032
      const parts = url.split('/');
      const filenameWithExt = parts[parts.length - 1];
      const folder = parts[parts.length - 2];
      const publicId = `${folder}/${filenameWithExt.split('.')[0]}`;

      console.log(`Deleting from Cloudinary: ${publicId}`);
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Cloudinary delete failed", result });
      }
    } catch (error) {
      console.error("Delete image error:", error);
      res.status(500).json({ error: "Internal server error during delete" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Global Error Handler to prevent HTML responses for API errors
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global Unhandled Error:", err);
    if (req.path.startsWith("/api/")) {
      return res.status(500).json({ error: err.message || "Internal Server Error" });
    }
    next(err);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
