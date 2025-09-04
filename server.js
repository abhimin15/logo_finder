const express = require("express");
const cors = require("cors");
const multer = require("multer");
const vision = require("@google-cloud/vision");
const imageAnalysisStore = require("./dataModel");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

// Get stored logo analyses
app.get("/getlogo", (req, res) => {
  try {
    const analysesWithLogos = imageAnalysisStore.getAnalysesWithLogos();
    
    if (analysesWithLogos.length === 0) {
      // Return sample data if no analyses exist
      const sampleData = [{
        id: "sample-1",
        name: "logo1",
        confidence: 0.85,
        location: "Shirt",
        timestamp: new Date().toISOString()
      }, {
        id: "sample-2", 
        name: "logo2",
        confidence: 0.92,
        location: "Board",
        timestamp: new Date().toISOString()
      }, {
        id: "sample-3",
        name: "logo3", 
        confidence: 0.78,
        location: "Ball",
        timestamp: new Date().toISOString()
      }];
      
      return res.json({
        success: true,
        data: sampleData,
        message: "Sample data (no analyses stored yet)"
      });
    }

    // Flatten logos from all analyses
    const allLogos = 
      analysesWithLogos.logos.map(logo => ({
        id: `${analysesWithLogos.id}-${logo.name}`,
        name: logo.name,
        confidence: logo.confidence,
        location: logo.location,
        timestamp: analysesWithLogos.timestamp,
        imageName: analysesWithLogos.imageInfo.name
      }));

    res.json({
      success: true,
      data: allLogos,
      stats: imageAnalysisStore.getStats()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve logo data"
    });
  }
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
        { type: "LABEL_DETECTION" }
      ]
    };

    const [result] = await client.annotateImage(request);
    console.log(result);

    // Prepare analysis data
    const analysisData = {
      text: {
        fullText: (result.fullTextAnnotation && result.fullTextAnnotation.text) || (result.textAnnotations && result.textAnnotations[0] && result.textAnnotations[0].description) || "",
        blocks: result.fullTextAnnotation ? result.fullTextAnnotation.pages || [] : []
      },
      logos: (result.logoAnnotations || []).map(l => ({ description: l.description, score: l.score, boundingPoly: l.boundingPoly })),
      labels: (result.labelAnnotations || []).map(l => ({ description: l.description, score: l.score, topicality: l.topicality }))
    };

    // Store the analysis result
    const imageInfo = {
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    const storedAnalysis = imageAnalysisStore.addAnalysis(imageInfo, analysisData);

    const response = {
      success: true,
      data: {
        analysisId: storedAnalysis.id,
        timestamp: storedAnalysis.timestamp,
        imageInfo: storedAnalysis.imageInfo,
        analysis: storedAnalysis.analysis,
        summary: {
          textFound: analysisData.text.fullText.length > 0,
          logoCount: analysisData.logos.length,
          labelCount: analysisData.labels.length
        }
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
