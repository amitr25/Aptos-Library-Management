import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  categories: string[];
  selectedCategory?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onCategoryFilter,
  categories,
  selectedCategory
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const clearCategoryFilter = () => {
    onCategoryFilter("");
  };

  return (
    <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-4 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search books by title, author, ISBN, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit" size="default">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedCategory || undefined} onValueChange={onCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCategoryFilter}
            className="h-8 px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};