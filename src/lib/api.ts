import { extractProductImageFromUrl } from "./openai";

interface Product {
  imageUrl: string;
  title: string;
  price: number;
  originalPrice: number;
  merchantName: string;
  purchaseUrl: string;
  similarityScore: number;
}

import { searchGoogleLensWithSerpApi } from "./serpapi";

async function searchGoogleLens(
  imageUrl: string,
  originalPrice?: number,
): Promise<Product[]> {
  try {
    return await searchGoogleLensWithSerpApi(imageUrl, originalPrice);
  } catch (error) {
    console.error("Error in searchGoogleLens:", error);
    throw error;
  }
}

export async function searchSimilarProducts(url: string): Promise<Product[]> {
  try {
    // First, extract the product image URL and price using OpenAI Vision
    const { imageUrl: productImageUrl, price: originalPrice } =
      await extractProductImageFromUrl(url);
    console.log("Extracted image URL:", productImageUrl);
    console.log("Original product price:", originalPrice);

    // Then use this image URL to search for similar products
    const results = await searchGoogleLens(productImageUrl, originalPrice);

    // Sort by similarity score (highest first)
    return results.sort((a, b) => b.similarityScore - a.similarityScore);
  } catch (error) {
    console.error("Error in searchSimilarProducts:", error);
    throw error;
  }
}
