import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  variant?: "default" | "hero";
}

const Search = ({ searchTerm, onSearchChange, variant = "default" }: SearchProps) => {
  const isHero = variant === "hero";
  return (
    <div className="relative">
      <SearchIcon className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5",
        isHero ? "text-gray-300" : "text-muted-foreground"
      )} />
      <Input
        type="search"
        placeholder="Search wallpapers by name or tag..."
        className={cn(
          "pl-10 w-full",
          isHero && "bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-gray-300 focus:ring-white/50"
        )}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default Search;