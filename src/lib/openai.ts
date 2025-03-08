import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, make API calls from backend
});

export async function extractProductImageFromUrl(
  url: string,
): Promise<{ imageUrl: string; price: number }> {
  console.log("Extracting image from URL:", url);
  try {
    // First fetch the webpage content through a CORS proxy
    const corsProxy = "https://corsproxy.io/?";
    const response = await fetch(
      corsProxy + encodeURIComponent(url) + `&_=${Date.now()}`,
    );
    const html = await response.text();
    console.log("Fetched HTML length:", html.length);

    // Extract price using multiple patterns
    const pricePatterns = [
      /<meta[^>]+property="product:price:amount"[^>]+content="([\d,.]+)"/i,
      /<meta[^>]+property="og:price:amount"[^>]+content="([\d,.]+)"/i,
      /"price":\s*"?\$?([\d,.]+)"?/i,
      /data-price="([\d,.]+)"/i,
      /price["']?:\s*["']\$?([\d,.]+)["']/i,
      /\$\s*([\d,]+(?:\.\d{2})?)/,
    ];

    let price = 0;
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        price = parseFloat(match[1].replace(/,/g, ""));
        console.log("Found price:", price, "using pattern:", pattern);
        break;
      }
    }

    // If no price found, try OpenAI but with a smaller chunk of HTML
    if (!price) {
      // Extract a larger chunk focused on price-related content
      const priceSection =
        html.match(
          /[\s\S]*?(original price|regular price|was price|list price)[\s\S]{0,2000}/i,
        )?.[0] || html.substring(0, 6000);
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Extract ONLY the original/regular price of the product from the HTML. Look for:\n1. Crossed out prices\n2. 'Regular price' or 'Original price' labels\n3. Schema.org markup with priceValidUntil\n4. Price elements with class names containing 'regular', 'original', or 'list'\nReturn ONLY the numeric price value (e.g. 299.99), nothing else.",
          },
          {
            role: "user",
            // Limit the content to avoid token limit issues
            content: priceSection.substring(0, 4000),
          },
        ],
        temperature: 0,
        max_tokens: 10,
      });

      const priceText = completion.choices[0].message.content;
      price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      console.log("Extracted price via OpenAI:", price);
    }

    // Use regex to find image URLs with dimensions or size hints
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const matches = [...html.matchAll(imgRegex)];

    // Extract images with their attributes
    const images = matches.map((match) => {
      const fullTag = match[0];
      const src = match[1];
      const width =
        fullTag.match(/width="(\d+)"/)?.[1] ||
        fullTag.match(/width: (\d+)/)?.[1];
      const height =
        fullTag.match(/height="(\d+)"/)?.[1] ||
        fullTag.match(/height: (\d+)/)?.[1];
      const className = fullTag.match(/class="([^"]+)"/)?.[1] || "";

      return {
        src: src.startsWith("http") ? src : `https:${src}`,
        width: parseInt(width || "0"),
        height: parseInt(height || "0"),
        className: className.toLowerCase(),
      };
    });

    // Filter and score images
    const scoredImages = images
      .filter(
        (img) =>
          !img.src.includes("icon") &&
          !img.src.includes("logo") &&
          !img.src.includes("thumbnail") &&
          !img.src.includes("sprite") &&
          !img.src.includes("small") &&
          !img.src.includes("banner") &&
          !img.className.includes("icon") &&
          !img.className.includes("logo") &&
          !img.className.includes("thumbnail"),
      )
      .map((img) => ({
        ...img,
        score: calculateImageScore(img),
      }))
      .sort((a, b) => b.score - a.score);

    if (scoredImages.length === 0) {
      throw new Error("No suitable product images found");
    }

    return {
      imageUrl: scoredImages[0].src,
      price: price,
    };
  } catch (error) {
    console.error("Error extracting from URL:", error);
    throw error;
  }
}

function calculateImageScore(img: {
  width: number;
  height: number;
  className: string;
  src: string;
}): number {
  let score = 0;

  // Prefer larger images
  if (img.width && img.height) {
    score += (img.width * img.height) / 10000; // Normalize size score
  }

  // Boost score for images with product-related classnames
  const productKeywords = [
    "product",
    "main",
    "hero",
    "primary",
    "featured",
    "gallery",
  ];
  productKeywords.forEach((keyword) => {
    if (img.className.includes(keyword)) score += 50;
  });

  // Boost score for images in typical product image paths
  const productPathKeywords = ["product", "images", "photos", "large", "zoom"];
  productPathKeywords.forEach((keyword) => {
    if (img.src.toLowerCase().includes(keyword)) score += 30;
  });

  return score;
}
