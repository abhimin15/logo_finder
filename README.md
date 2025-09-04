# Logo Finder API

A Node.js Express server that uses Google Vision API to extract text and logos from uploaded images.

## Features

- **Text Detection**: Extracts all text content from images using OCR
- **Logo Detection**: Identifies and locates logos in images
- **File Upload**: Handles image uploads with validation
- **Error Handling**: Comprehensive error handling for various scenarios

## Setup

### Prerequisites

1. **Google Cloud Vision API**: You need to set up Google Cloud Vision API credentials
   - Create a Google Cloud project
   - Enable the Vision API
   - Create a service account and download the JSON key file
   - Set the environment variable: `export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node server.js
```

The server will run on `http://localhost:5000`

## API Usage

### POST /analyze-image

Upload an image to extract text and logos.

**Request:**
- Method: `POST`
- URL: `http://localhost:5000/analyze-image`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `image` containing the image file

**Example using curl:**
```bash
curl -X POST \
  -F "image=@/path/to/your/image.jpg" \
  http://localhost:5000/analyze-image
```

**Example using JavaScript (fetch):**
```javascript
const formData = new FormData();
formData.append('image', imageFile);

fetch('http://localhost:5000/analyze-image', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "text": {
      "content": "Extracted text from the image",
      "confidence": 0.95
    },
    "logos": [
      {
        "description": "Logo description",
        "score": 0.89,
        "boundingPoly": {
          "vertices": [
            {"x": 10, "y": 20},
            {"x": 100, "y": 20},
            {"x": 100, "y": 80},
            {"x": 10, "y": 80}
          ]
        }
      }
    ],
    "imageInfo": {
      "originalName": "image.jpg",
      "mimetype": "image/jpeg",
      "size": 123456
    }
  }
}
```

## Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- BMP
- WebP
- TIFF

## File Size Limits

- Maximum file size: 10MB
- Google Vision API limit: 20MB

## Error Responses

The API returns appropriate error messages for various scenarios:

- **400**: No image provided, invalid file type, file too large
- **500**: Internal server error, Google Vision API errors

## Environment Variables

- `PORT`: Server port (default: 5000)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud service account key file
- `NODE_ENV`: Set to 'development' for detailed error messages
