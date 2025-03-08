import React, { useState } from "react";
import SearchSection from "./SearchSection";
import ResultsGrid from "./ResultsGrid";
import { searchSimilarProducts } from "@/lib/api";
import { Progress } from "./ui/progress";

const loadingSteps = [
  "Analyzing product URL...",
  "Extracting product details...",
  "Finding similar items...",
  "Comparing prices...",
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setLoadingStep(0);
    setProgress(0);

    try {
      // Step 1: URL Analysis
      setProgress(20);
      setLoadingStep(0);
      await new Promise((r) => setTimeout(r, 300));

      // Step 2: Extract product details
      setProgress(40);
      setLoadingStep(1);
      await new Promise((r) => setTimeout(r, 300));

      // Step 3: Search similar items
      setProgress(60);
      setLoadingStep(2);
      const results = await searchSimilarProducts(url);

      // Step 4: Price comparison
      setProgress(80);
      setLoadingStep(3);
      await new Promise((r) => setTimeout(r, 300));

      setProgress(100);
      setProducts(results);
    } catch (error) {
      console.error("Error searching products:", error);
      // Show some fallback products so the UI doesn't break
      setProducts([
        {
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          title: "Error: " + (error.message || "Failed to search products"),
          price: 0,
          originalPrice: 0,
          merchantName: "Please try again with a different URL",
          purchaseUrl: "#",
          similarityScore: 0,
        },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <SearchSection onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && (
          <div className="w-full max-w-[800px] mx-auto space-y-4">
            <div className="text-center text-lg text-gray-600">
              {loadingSteps[loadingStep]}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <ResultsGrid isLoading={isLoading} products={products} />
      </div>
    </div>
  );
};

export default Home;
