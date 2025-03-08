# SerpAPI Integration

## Current Implementation

For the Tempo development environment, we're using a direct implementation that generates realistic product data based on the input image URL. This approach avoids the 404 errors that occur when trying to access serverless functions in the Tempo environment.

## Production Implementation

For production, you should implement one of these approaches:

### Option 1: Serverless Function (Recommended)

Implement the serverless function as described in `DEPLOYMENT.md`. This is the most secure and reliable approach.

```javascript
// In production, use this code in serpapi.ts instead of the current implementation
export async function searchGoogleLensWithSerpApi(imageUrl: string, originalPrice?: number) {
  const serverlessUrl = "/.netlify/functions/serpapi-backend";

  const response = await fetch(serverlessUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl, originalPrice }),
  });

  const text = await response.text();
  
  if (!response.ok) {
    throw new Error(`Error calling serverless function: ${response.status}`);
  }
  
  return JSON.parse(text);
}
```

### Option 2: Backend API

Implement a dedicated backend API service that handles the SerpAPI requests.

## Next Steps

1. For development/testing in Tempo: Continue using the current direct implementation
2. For production: Implement the serverless function approach when deploying to Netlify/Vercel
