import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import WallpaperCard, { type Wallpaper } from "./WallpaperCard";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";

const WallpaperGrid = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("wallpapers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching wallpapers:", error);
        showError("Could not fetch wallpapers.");
      } else {
        setWallpapers(data as Wallpaper[]);
      }
      setLoading(false);
    };

    fetchWallpapers();
  }, []);

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
    return <p className="text-center text-muted-foreground">No wallpapers found.</p>;
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