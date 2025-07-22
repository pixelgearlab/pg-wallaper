import Search from "./Search";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header = ({ searchTerm, onSearchChange }: HeaderProps) => {
  return (
    <header className="py-6 mb-8">
      <h1 className="text-4xl font-bold text-center tracking-tight">
        PG WALLPAPER
      </h1>
      <p className="text-center text-muted-foreground mt-2">
        Discover your next favorite wallpaper
      </p>
      <div className="max-w-md mx-auto mt-6">
        <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </div>
    </header>
  );
};

export default Header;