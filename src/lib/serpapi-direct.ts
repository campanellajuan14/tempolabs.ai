/**
 * Direct implementation for SerpAPI calls
 * This is a temporary solution for the Tempo environment
 */

interface Product {
  imageUrl: string;
  title: string;
  price: number;
  originalPrice: number;
  merchantName: string;
  purchaseUrl: string;
  similarityScore: number;
}

// Mock data to use when we can't make real API calls
const mockProducts: Product[] = [
  {
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    title: "Red Nike Running Shoes",
    price: 89.99,
    originalPrice: 119.99,
    merchantName: "FootLocker",
    purchaseUrl: "https://www.footlocker.com/product/nike-running-shoes",
    similarityScore: 95,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    title: "Nike Revolution 5 Running Shoes",
    price: 65.0,
    originalPrice: 85.0,
    merchantName: "Nike",
    purchaseUrl: "https://www.nike.com/revolution-5",
    similarityScore: 92,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    title: "Adidas Ultraboost 21",
    price: 180.0,
    originalPrice: 220.0,
    merchantName: "Adidas",
    purchaseUrl: "https://www.adidas.com/ultraboost-21",
    similarityScore: 88,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329",
    title: "New Balance Fresh Foam 1080v11",
    price: 149.99,
    originalPrice: 179.99,
    merchantName: "New Balance",
    purchaseUrl: "https://www.newbalance.com/fresh-foam-1080v11",
    similarityScore: 85,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    title: "Brooks Ghost 14 Running Shoes",
    price: 130.0,
    originalPrice: 150.0,
    merchantName: "Brooks Running",
    purchaseUrl: "https://www.brooksrunning.com/ghost-14",
    similarityScore: 82,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    title: "Asics Gel-Kayano 28",
    price: 160.0,
    originalPrice: 180.0,
    merchantName: "Asics",
    purchaseUrl: "https://www.asics.com/gel-kayano-28",
    similarityScore: 80,
  },
];

// Generate products based on the input image URL
export function generateProductsFromImage(
  imageUrl: string,
  originalPrice: number,
): Product[] {
  // Create a deterministic but seemingly random set of products based on the image URL
  const hash = hashCode(imageUrl);
  const seed = Math.abs(hash);

  return mockProducts
    .map((product) => {
      // Create some variation based on the hash
      const priceVariation = (seed % 20) / 100; // Up to 20% variation
      const similarityVariation = seed % 10; // Up to 10 points variation

      // Apply the original price if provided
      const actualOriginalPrice =
        originalPrice > 0 ? originalPrice : product.originalPrice;

      // Calculate a new price with some randomness but ensure it's less than original
      const newPrice = Math.max(
        actualOriginalPrice *
          (0.5 + Math.sin(seed * product.similarityScore) * 0.3),
        actualOriginalPrice * 0.4,
      );

      return {
        ...product,
        price: Math.round(newPrice * 100) / 100,
        originalPrice: actualOriginalPrice,
        similarityScore: Math.min(
          99,
          Math.max(70, product.similarityScore + similarityVariation),
        ),
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore);
}

// Simple string hash function
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
