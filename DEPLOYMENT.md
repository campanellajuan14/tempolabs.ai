# Deploying the Dupe Finder App

## Serverless Function Setup

This application uses a serverless function to handle API calls to SerpAPI, following the approach described in [SerpAPI's blog post](https://serpapi.com/blog/using-serpapi-in-web-frontend-solve-cors-issue/).

### Netlify Deployment

1. **Create a Netlify account** if you don't have one already

2. **Connect your GitHub repository** to Netlify

3. **Set up environment variables**
   - Go to Site settings > Build & deploy > Environment
   - Add the following environment variable:
     - Key: `SERPAPI_KEY`
     - Value: Your SerpAPI key

4. **Deploy your site**
   - Netlify will automatically detect the `netlify.toml` configuration
   - The serverless function in `netlify/functions/serpapi-backend.js` will be deployed

5. **Test the deployment**
   - Your serverless function will be available at `https://your-site-name.netlify.app/.netlify/functions/serpapi-backend`

### Vercel Deployment

If you prefer Vercel:

1. **Create a Vercel account** if you don't have one already

2. **Connect your GitHub repository** to Vercel

3. **Set up environment variables**
   - Go to Project settings > Environment Variables
   - Add the following environment variable:
     - Key: `SERPAPI_KEY`
     - Value: Your SerpAPI key

4. **Create a Vercel serverless function**
   - Move the code from `netlify/functions/serpapi-backend.js` to `api/serpapi.js`
   - Adjust the import for `node-fetch` if needed

5. **Deploy your site**
   - Your serverless function will be available at `https://your-site-name.vercel.app/api/serpapi`

## Local Development

During local development, the app uses the real SerpAPI through a local serverless function. This ensures you're working with real data throughout development.

To test the serverless function locally:

### With Netlify CLI

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify dev` to start the local development server
3. Your serverless function will be available at `http://localhost:8888/.netlify/functions/serpapi-backend`

### With Vercel CLI

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel dev` to start the local development server
3. Your serverless function will be available at `http://localhost:3000/api/serpapi`
