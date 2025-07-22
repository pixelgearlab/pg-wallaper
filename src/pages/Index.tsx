import { useState } from "react";
import Header from "@/components/Header";
import WallpaperGrid from "@/components/WallpaperGrid";
import { MadeWithDyad } from "@/components/made-with-dyad";
import CategoryFilters from "@/components/CategoryFilters";
import WallpaperPreviewDialog from "@/components/WallpaperPreviewDialog";
import { type Wallpaper } from "@/components/WallpaperCard";

const CATEGORIES = [
  "All",
  "AMOLED",
  "Minimal",
  "Anime",
  "Cinematic",
  "Abstract",
  "Nature",
  "AI Generated",
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(
    null
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoryFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <main>
          <WallpaperGrid
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onPreview={setPreviewWallpaper}
          />
        </main>
        <MadeWithDyad />
      </div>
      <WallpaperPreviewDialog
        wallpaper={previewWallpaper}
        open={!!previewWallpaper}
        onOpenChange={() => setPreviewWallpaper(null)}
      />
    </div>
  );
};

export default Index;