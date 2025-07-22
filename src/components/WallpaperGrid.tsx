import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import WallpaperCard, { type Wallpaper } from "./WallpaperCard";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";

interface WallpaperGridProps {
  searchTerm: string;
}

const WallpaperGrid = ({ searchTerm }: WallpaperGridProps) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);

      let query = supabase
        .from("wallpapers")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        // Search in name (case-insensitive) OR in tags array
        query = query.or(`name.ilike.${searchPattern},tags.cs.{${searchTerm}}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching wallpapers:", error);
        showError("Could not fetch wallpapers.");
      } else {
        setWallpapers(data as Wallpaper[]);
      }
      setLoading(false);
    };

    // Debounce search to avoid too many requests
    const handler = setTimeout(() => {
      fetchWallpapers();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="w-full aspect-[9/16] rounded-lg" />
        ))}
      </div>
    );
  }

  if (wallpapers.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No wallpapers found for "{searchTerm}". Try another search.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
      ))}
    </div>
  );
};

export default WallpaperGrid;