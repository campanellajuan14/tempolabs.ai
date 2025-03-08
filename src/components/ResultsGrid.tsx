import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  imageUrl: string;
  title: string;
  price: number;
  originalPrice: number;
  merchantName: string;
  purchaseUrl: string;
  similarityScore: number;
}

interface ResultsGridProps {
  products?: Product[];
  isLoading?: boolean;
}

const ResultsGrid = ({
  products = [
    {
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      title: "Premium Watch",
      price: 199.99,
      originalPrice: 399.99,
      merchantName: "Luxury Timepieces",
      purchaseUrl: "#",
      similarityScore: 92,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
      title: "Designer Handbag",
      price: 299.99,
      originalPrice: 599.99,
      merchantName: "Fashion Outlet",
      purchaseUrl: "#",
      similarityScore: 88,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
      title: "Wireless Headphones",
      price: 149.99,
      originalPrice: 249.99,
      merchantName: "Tech Store",
      purchaseUrl: "#",
      similarityScore: 85,
    },
  ],
  isLoading = false,
}: ResultsGridProps) => {
  if (isLoading) {
    return (
      <div className="w-full min-h-[700px] p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[280px] h-[400px] bg-white/20 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  // Filter out products with price 0
  const validProducts = products.filter((product) => product.price > 0);

  return (
    <div className="w-full min-h-[700px] p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {validProducts.map((product, index) => (
          <ProductCard
            key={index}
            imageUrl={product.imageUrl}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            merchantName={product.merchantName}
            purchaseUrl={product.purchaseUrl}
            similarityScore={product.similarityScore}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsGrid;
