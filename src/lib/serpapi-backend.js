// This file would be deployed as a serverless function
// For example, as a Netlify or Vercel serverless function

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const { imageUrl, originalPrice } = body;

    if (!imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Image URL is required" }),
      };
    }

    // Your SerpAPI key should be set as an environment variable in your serverless function settings
    const SERPAPI_KEY =
      process.env.SERPAPI_KEY ||
      "5184464b38176b7b04daa419458c5476b7a0864ad841f9ec8c8db6ed214afe36";

    // Make the request to SerpAPI
    const serpApiUrl = `https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(imageUrl)}&api_key=${SERPAPI_KEY}`;

    const response = await fetch(serpApiUrl);
    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error || "Error from SerpAPI" }),
      };
    }

    // Process the data and return only what's needed
    const visualMatches = data.visual_matches || [];

    const processedResults = visualMatches.map((match) => {
      const price = match.price?.extracted_value || match.price?.value || 0;
      const numericPrice =
        typeof price === "string"
          ? parseFloat(price.replace(/[^0-9.]/g, ""))
          : price;

      return {
        imageUrl: match.thumbnail,
        title: match.title,
        price: numericPrice,
        originalPrice: originalPrice || numericPrice * 1.2, // Use provided original price or estimate
        merchantName: match.source || "Unknown Store",
        purchaseUrl: match.link,
        similarityScore: Math.round(Math.random() * 15 + 80), // Just for display
      };
    });

    // Return the processed results
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processedResults),
    };
  } catch (error) {
    console.error("Server error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
