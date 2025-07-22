import { useState } from "react";
import WallpaperGrid from "@/components/WallpaperGrid";
import WallpaperPreviewDialog from "@/components/WallpaperPreviewDialog";
import { type Wallpaper } from "@/components/WallpaperCard";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const CATEGORIES = [
  "All",
  "Abstract",
  "AMOLED",
  "Anime",
  "Cinematic",
  "Cyberpunk",
  "Minimal",
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
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className="container mx-auto px-4">
        <HeroSection />
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            <Sidebar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>
          <main className="flex-1">
            <WallpaperGrid
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onPreview={setPreviewWallpaper}
            />
          </main>
        </div>
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