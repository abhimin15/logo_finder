const express = require("express");
const cors = require("cors");
const multer = require("multer");
const vision = require("@google-cloud/vision");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

app.get("/getlogo", (req, res) => {
    const data = [{
        name: "logo1",
        size: Math.random() * 100,
        location: "Shirt"
    },{
        name: "logo2",
        size: Math.random() * 100,
        location: "Board"
    },{
        name: "logo3",
        size: Math.random() * 100,
        location: "Ball"
    }]
  res.json(data);
});

// Google Vision client (uses GOOGLE_APPLICATION_CREDENTIALS if set)
const client = new vision.ImageAnnotatorClient();

// Multer setup for in-memory image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file && file.mimetype && file.mimetype.startsWith("image/")) {
        return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});


// Upload Image API: analyzes image with multiple Vision features
app.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image provided. Use form-data field 'image'." });
    }
    const request = {
      image: { content: req.file.buffer },
      features: [
        { type: "TEXT_DETECTION" },
        { type: "LOGO_DETECTION" },
        { type: "LABEL_DETECTION" },
        { type: "OBJECT_LOCALIZATION" },
        { type: "LANDMARK_DETECTION" },
        { type: "WEB_DETECTION" },
        { type: "IMAGE_PROPERTIES" },
        { type: "SAFE_SEARCH_DETECTION" }
      ]
    };

    const [result] = await client.annotateImage(request);
    console.log(result);

    const response = {
      success: true,
      data: {
        imageInfo: {
          name: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        },
        text: {
          fullText: (result.fullTextAnnotation && result.fullTextAnnotation.text) || (result.textAnnotations && result.textAnnotations[0] && result.textAnnotations[0].description) || "",
          blocks: result.fullTextAnnotation ? result.fullTextAnnotation.pages || [] : []
        },
        logos: (result.logoAnnotations || []).map(l => ({ description: l.description, score: l.score, boundingPoly: l.boundingPoly })),
        labels: (result.labelAnnotations || []).map(l => ({ description: l.description, score: l.score, topicality: l.topicality })),
        objects: (result.localizedObjectAnnotations || []).map(o => ({ name: o.name, score: o.score, boundingPoly: o.boundingPoly })),
        landmarks: (result.landmarkAnnotations || []).map(l => ({ description: l.description, score: l.score, locations: l.locations })),
        webDetection: result.webDetection || {},
        imageProperties: result.imagePropertiesAnnotation || {},
        safeSearch: result.safeSearchAnnotation || {}
      }
    };

    return res.json(response);
  } catch (error) {
    const status = error.code === 7 || error.code === 3 ? 400 : 500;
    return res.status(status).json({ success: false, error: error.message || "Failed to analyze image" });
  }
});

// Error handler (including multer errors)
app.use((err, req, res, next) => {
  if (err) {
    if (err.message === "Only image files are allowed") {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, error: "File too large. Max 10MB." });
    }
    return res.status(500).json({ success: false, error: err.message || "Unexpected error" });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
