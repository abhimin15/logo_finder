// Data model for storing image analysis results
class ImageAnalysisStore {
  constructor() {
    this.analyses = {};
    this.nextId = 1;
  }

  // Add new analysis result
  addAnalysis(imageInfo, analysisData) {
    const analysis = {
      id: this.nextId++,
      timestamp: new Date().toISOString(),
      imageInfo: {
        name: imageInfo.name,
        mimetype: imageInfo.mimetype,
        size: imageInfo.size
      },
      analysis: {
        text: analysisData.text || {},
        logos: analysisData.logos || [],
        labels: analysisData.labels || []
      }
    };

    this.analyses = analysis;
    return analysis;
  }

  // Get analyses with logos
  getAnalysesWithLogos() {
    return this.analyses;
  }

  // Clear all analyses
  clearAll() {
    this.analyses = {};
    this.nextId = 1;
  }
}

// Create singleton instance
const imageAnalysisStore = new ImageAnalysisStore();

module.exports = imageAnalysisStore;
