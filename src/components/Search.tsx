import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Search = ({ searchTerm, onSearchChange }: SearchProps) => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search wallpapers..."
        className="pl-10 w-full bg-background md:bg-card rounded-full"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default Search;