# Production Setup for Dupe Finder

## Backend Requirements

This application requires a backend service to handle API calls to SerpAPI. This is necessary for two reasons:

1. **API Key Security**: Your SerpAPI key should not be exposed in client-side code
2. **CORS Restrictions**: SerpAPI doesn't support direct browser requests due to CORS limitations

## Setting Up the Backend

A sample backend implementation is provided in `src/api/serpapi.js`. To use this in production:

1. Create a new Node.js project for your backend
2. Install required dependencies:
   ```
   npm install express cors node-fetch
   ```
3. Copy the code from `src/api/serpapi.js` to your backend project
4. Store your SerpAPI key in an environment variable rather than hardcoding it
5. Deploy your backend to a hosting service (Heroku, Vercel, AWS, etc.)

## Connecting Frontend to Backend

Once your backend is deployed, update the `searchGoogleLensWithSerpApi` function in `src/lib/serpapi.ts` to call your backend API instead of trying to call SerpAPI directly:

```typescript
export async function searchGoogleLensWithSerpApi(imageUrl: string, originalPrice?: number) {
  try {
    const response = await fetch('https://your-backend-url.com/api/search-google-lens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, originalPrice })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error calling backend API');
    }
    
    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}
```

## Error Handling

Make sure to implement proper error handling in both your frontend and backend code. The current implementation includes basic error handling, but you may want to enhance it for production use.

## Rate Limiting

Be aware that SerpAPI has rate limits based on your subscription plan. Implement appropriate caching and rate limiting in your backend to avoid exceeding these limits.
