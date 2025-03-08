// This file would be on your backend server
// Example using Express.js

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const SERPAPI_KEY =
  "5184464b38176b7b04daa419458c5476b7a0864ad841f9ec8c8db6ed214afe36";

app.post("/api/search-google-lens", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const serpApiUrl = `https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(imageUrl)}&api_key=${SERPAPI_KEY}`;

    const response = await fetch(serpApiUrl);
    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error || "Error from SerpAPI" });
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
        originalPrice: req.body.originalPrice || numericPrice * 1.2, // Use provided original price or estimate
        merchantName: match.source || "Unknown Store",
        purchaseUrl: match.link,
        similarityScore: Math.round(Math.random() * 15 + 80), // Just for display
      };
    });

    res.json(processedResults);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
