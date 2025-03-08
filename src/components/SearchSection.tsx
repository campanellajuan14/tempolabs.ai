import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface SearchSectionProps {
  onSearch?: (url: string) => void;
  isLoading?: boolean;
  defaultUrl?: string;
}

const SearchSection = ({
  onSearch = () => {},
  isLoading = false,
  defaultUrl = "https://www.amazon.com/Nike-Revolution-Running-Black-Regular/dp/B07NLY8H5V",
}: SearchSectionProps) => {
  const [url, setUrl] = React.useState(defaultUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(url);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto p-8">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-transparent bg-clip-text animate-gradient">
          dupe
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          Find similar products for less
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-3 hover:shadow-xl transition-all duration-300">
          <Input
            type="url"
            placeholder="Paste product URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 text-lg placeholder:text-gray-400 bg-transparent"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            <Search className="w-5 h-5 mr-2" />
            Find Dupes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;
