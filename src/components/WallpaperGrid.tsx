import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import WallpaperCard, { type Wallpaper } from "./WallpaperCard";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";
import { Button } from "./ui/button";

interface WallpaperGridProps {
  searchTerm: string;
  selectedCategory: string;
  onPreview: (wallpaper: Wallpaper) => void;
}

const PAGE_SIZE = 20;

const WallpaperGrid = ({
  searchTerm,
  selectedCategory,
  onPreview,
}: WallpaperGridProps) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchWallpapers = useCallback(
    async (currentPage: number, existingWallpapers: Wallpaper[] = []) => {
      if (currentPage === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let query = supabase
        .from("wallpapers")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedCategory !== "All") {
        query = query.filter("tags", "cs", `{${selectedCategory}}`);
      }

      if (searchTerm) {
        const searchPattern = `%${searchTerm}%`;
        query = query.or(`name.ilike.${searchPattern},tags.cs.{${searchTerm}}`);
      }

      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching wallpapers:", error);
        showError("Could not fetch wallpapers.");
        setHasMore(false);
      } else {
        setWallpapers(
          currentPage === 0 ? data : [...existingWallpapers, ...data]
        );
        setHasMore(data.length === PAGE_SIZE);
      }

      setLoading(false);
      setLoadingMore(false);
    },
    [searchTerm, selectedCategory]
  );

  useEffect(() => {
    setPage(0);
    setWallpapers([]);
    setHasMore(true);
    fetchWallpapers(0);
  }, [searchTerm, selectedCategory, fetchWallpapers]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWallpapers(nextPage, wallpapers);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="w-full aspect-[16/9] rounded-lg" />
        ))}
      </div>
    );
  }

  if (wallpapers.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        No wallpapers found. Try a different search or category.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            onPreview={onPreview}
          />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <Button onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
};

export default WallpaperGrid;