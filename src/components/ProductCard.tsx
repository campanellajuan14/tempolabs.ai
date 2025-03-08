import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  imageUrl?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  merchantName?: string;
  purchaseUrl?: string;
  similarityScore?: number;
}

const ProductCard = ({
  imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  title = "Premium Product",
  price = 49.99,
  originalPrice = 99.99,
  merchantName = "Sample Store",
  purchaseUrl = "#",
  similarityScore = 85,
}: ProductCardProps) => {
  const savingsPercent =
    originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // If price is higher than original, show price increase %
  const priceChangePercent =
    savingsPercent < 0 ? Math.abs(savingsPercent) : savingsPercent;

  return (
    <Card className="w-[280px] h-[400px] bg-white/80 backdrop-blur-sm overflow-hidden flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100/20 rounded-2xl">
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <Badge
          className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-medium shadow-lg"
          variant="secondary"
        >
          {savingsPercent < 0
            ? `${priceChangePercent}% MORE`
            : `${priceChangePercent}% OFF`}
        </Badge>
      </div>

      <CardContent className="flex-1 p-4">
        <h3 className="font-medium text-lg line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{merchantName}</p>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">${price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground line-through">
            ${originalPrice.toFixed(2)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg transition-all duration-300"
          variant="default"
          onClick={() => window.open(purchaseUrl, "_blank")}
        >
          Buy Now
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
