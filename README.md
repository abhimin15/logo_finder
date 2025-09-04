# Logo Finder API

A Node.js Express server that uses Google Vision API to extract comprehensive data from uploaded images including text, logos, labels, objects, landmarks, and more.

## Features

- **Text Detection**: Extracts all text content from images using OCR
- **Logo Detection**: Identifies and locates logos in images
- **Label Detection**: Recognizes objects, places, and activities
- **Data Storage**: Stores analysis results for retrieval
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

2. Create a `.env` file in the project root:
```bash
PORT=8000
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google-vision-key.json
```

3. Start the server:
```bash
node server.js
```

The server will run on `http://localhost:8000`

## API Usage

### GET /getlogo

Get stored logo data from analyzed images. Returns real logo data if available, otherwise sample data.

**Request:**
- Method: `GET`
- URL: `http://localhost:8000/getlogo`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1-Nike",
      "name": "Nike",
      "confidence": 0.89,
      "location": "Detected",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "imageName": "sports-shoe.jpg"
    }
  ]
}
```

### POST /upload-image

Upload an image to extract comprehensive data using Google Vision API.

**Request:**
- Method: `POST`
- URL: `http://localhost:8000/upload-image`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `image` containing the image file

**Example using curl:**
```bash
curl -X POST \
  -F "image=@/path/to/your/image.jpg" \
  http://localhost:8000/upload-image
```

**Example using JavaScript (fetch):**
```javascript
const formData = new FormData();
formData.append('image', imageFile);

fetch('http://localhost:8000/upload-image', {
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
    "analysisId": 1,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "imageInfo": {
      "name": "image.jpg",
      "mimetype": "image/jpeg",
      "size": 123456
    },
    "analysis": {
      "text": {
        "fullText": "Extracted text from the image",
        "blocks": []
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
      "labels": [
        {
          "description": "Object label",
          "score": 0.95,
          "topicality": 0.92
        }
      ]
    },
    "summary": {
      "textFound": true,
      "logoCount": 2,
      "labelCount": 5
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

- Maximum file size: 5MB
- Google Vision API limit: 20MB

## Data Storage

The application stores analysis results in memory. Each upload replaces the previous analysis, maintaining only the most recent result.

## Error Responses

The API returns appropriate error messages for various scenarios:

- **400**: No image provided, invalid file type, file too large
- **500**: Internal server error, Google Vision API errors

## Environment Variables

Create a `.env` file in the project root with the following variables:

- `PORT`: Server port (default: 8000)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud service account key file

Example `.env` file:
```
PORT=8000
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/google-vision-key.json
```
