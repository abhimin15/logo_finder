# Google Cloud Vision API Setup Guide

This guide will walk you through setting up Google Cloud Vision API for your logo finder application.

## Prerequisites

- A Google account
- A credit card (for billing, though you get free credits)

## Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name: `logo-finder-api` (or any name you prefer)
   - Click "Create"

3. **Select Your Project**
   - Make sure your new project is selected in the dropdown

## Step 2: Enable the Vision API

1. **Navigate to APIs & Services**
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Or visit: https://console.cloud.google.com/apis/library

2. **Search for Vision API**
   - In the search bar, type "Vision API"
   - Click on "Cloud Vision API"

3. **Enable the API**
   - Click the "Enable" button
   - Wait for it to be enabled (usually takes a few seconds)

## Step 3: Create Service Account Credentials

1. **Go to Credentials**
   - In the left sidebar, go to "APIs & Services" > "Credentials"
   - Or visit: https://console.cloud.google.com/apis/credentials

2. **Create Service Account**
   - Click "Create Credentials" > "Service Account"
   - Enter details:
     - **Service account name**: `logo-finder-service`
     - **Service account ID**: `logo-finder-service` (auto-generated)
     - **Description**: `Service account for logo finder API`
   - Click "Create and Continue"

3. **Grant Access (Optional)**
   - For this project, you can skip this step or assign "Viewer" role
   - Click "Continue"

4. **Grant Users Access (Optional)**
   - You can skip this step for now
   - Click "Done"

## Step 4: Generate and Download API Key

1. **Find Your Service Account**
   - In the Credentials page, you should see your service account listed
   - Click on the service account email

2. **Create Key**
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select "JSON" format
   - Click "Create"

3. **Download the Key File**
   - The JSON file will automatically download
   - **Important**: Keep this file secure and never commit it to version control
   - Rename it to something like `google-vision-key.json`

## Step 5: Set Up Billing (Required)

1. **Go to Billing**
   - In the left sidebar, go to "Billing"
   - Or visit: https://console.cloud.google.com/billing

2. **Link a Billing Account**
   - Click "Link a billing account"
   - Add your credit card information
   - **Note**: Google provides $300 in free credits for new users

## Step 6: Configure Your Application

1. **Place the Key File**
   - Move your downloaded JSON key file to your project directory
   - Example: `/Users/abhisheksingh/logo_finder/google-vision-key.json`

2. **Set Environment Variable**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/Users/abhisheksingh/logo_finder/google-vision-key.json"
   ```

3. **Add to .gitignore**
   Create a `.gitignore` file in your project root:
   ```
   node_modules/
   google-vision-key.json
   .env
   ```

## Step 7: Test the Setup

1. **Start Your Server**
   ```bash
   node server.js
   ```

2. **Test with a Sample Image**
   ```bash
   curl -X POST \
     -F "image=@/path/to/test-image.jpg" \
     http://localhost:5000/analyze-image
   ```

## Pricing Information

Google Cloud Vision API pricing (as of 2024):
- **Text Detection**: $1.50 per 1,000 images (first 1,000 images per month are free)
- **Logo Detection**: $1.50 per 1,000 images (first 1,000 images per month are free)
- **Free Tier**: 1,000 requests per month for each feature

## Troubleshooting

### Common Issues:

1. **"Permission denied" error**
   - Make sure the service account has Vision API access
   - Check that the JSON key file path is correct

2. **"API not enabled" error**
   - Verify that Cloud Vision API is enabled in your project
   - Wait a few minutes after enabling the API

3. **"Billing required" error**
   - Ensure billing is set up and linked to your project
   - Check that your billing account is active

4. **"Invalid credentials" error**
   - Verify the JSON key file is valid and not corrupted
   - Check the environment variable path

### Environment Variable Setup:

**For macOS/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export GOOGLE_APPLICATION_CREDENTIALS="/Users/abhisheksingh/logo_finder/google-vision-key.json"
```

**For Windows:**
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your\google-vision-key.json
```

## Security Best Practices

1. **Never commit credentials to version control**
2. **Use environment variables for sensitive data**
3. **Rotate service account keys regularly**
4. **Limit service account permissions to minimum required**
5. **Monitor API usage and set up billing alerts**

## Alternative: Using Application Default Credentials

If you're deploying to Google Cloud Platform (App Engine, Cloud Run, etc.), you can use Application Default Credentials instead of a service account key file. This is more secure for production deployments.

For local development, the service account key file approach is recommended.
