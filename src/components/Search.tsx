import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Search = ({ searchTerm, onSearchChange }: SearchProps) => {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search wallpapers by name or tag..."
        className="pl-10 w-full"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default Search;