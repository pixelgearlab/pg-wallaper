import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import WallpaperCard, { type Wallpaper } from "./WallpaperCard";
import { Skeleton } from "@/components/ui/skeleton";
import { showError, showSuccess } from "@/utils/toast";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Zap } from "lucide-react";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        const { data, error } = await supabase
          .from('favorites')
          .select('wallpaper_id')
          .eq('user_id', user.id);
        
        if (data) {
          setFavoriteIds(new Set(data.map(fav => fav.wallpaper_id)));
        }
      };
      fetchFavorites();
    } else {
      setFavoriteIds(new Set());
    }
  }, [user]);

  const fetchWallpapers = useCallback(
    async (currentPage: number, existingWallpapers: Wallpaper[] = []) => {
      if (currentPage === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let query = supabase
        .from("wallpapers")
        .select("*");

      // Sorting logic
      if (sortBy === 'popular') {
        query = query.order("download_count", { ascending: false });
      } else { // 'recent'
        query = query.order("created_at", { ascending: false });
      }

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
    [searchTerm, selectedCategory, sortBy]
  );

  useEffect(() => {
    setPage(0);
    setWallpapers([]);
    setHasMore(true);
    fetchWallpapers(0);
  }, [searchTerm, selectedCategory, sortBy, fetchWallpapers]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWallpapers(nextPage, wallpapers);
  };

  const handleToggleFavorite = async (wallpaperId: number) => {
    if (!user) {
      showError("Please log in to favorite wallpapers.");
      navigate('/login');
      return;
    }

    const isFavorite = favoriteIds.has(wallpaperId);
    const newFavoriteIds = new Set(favoriteIds);

    if (isFavorite) {
      newFavoriteIds.delete(wallpaperId);
      setFavoriteIds(newFavoriteIds);
      const { error } = await supabase.from('favorites').delete().match({ user_id: user.id, wallpaper_id: wallpaperId });
      if (error) {
        showError("Failed to remove from favorites.");
        newFavoriteIds.add(wallpaperId);
        setFavoriteIds(newFavoriteIds);
      } else {
        showSuccess("Removed from favorites.");
      }
    } else {
      newFavoriteIds.add(wallpaperId);
      setFavoriteIds(newFavoriteIds);
      const { error } = await supabase.from('favorites').insert({ user_id: user.id, wallpaper_id: wallpaperId });
      if (error) {
        showError("Failed to add to favorites.");
        newFavoriteIds.delete(wallpaperId);
        setFavoriteIds(newFavoriteIds);
      } else {
        showSuccess("Added to favorites!");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold whitespace-nowrap">All Wallpapers</h2>
        <div className="ml-auto flex items-center gap-1 bg-card p-1 rounded-lg w-full sm:w-auto">
          <Button variant={sortBy === 'popular' ? 'secondary' : 'ghost'} size="sm" onClick={() => setSortBy('popular')} className="flex-1 sm:flex-none">
            <Star className="w-4 h-4 mr-2" /> Most Popular
          </Button>
          <Button variant={sortBy === 'recent' ? 'secondary' : 'ghost'} size="sm" onClick={() => setSortBy('recent')} className="flex-1 sm:flex-none">
            <Clock className="w-4 h-4 mr-2" /> Recently Added
          </Button>
          <Button variant={'ghost'} size="sm" disabled className="flex-1 sm:flex-none">
            <Zap className="w-4 h-4 mr-2" /> Featured
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="w-full aspect-[16/9] rounded-lg" />
          ))}
        </div>
      ) : wallpapers.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No wallpapers found. Try a different search or category.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {wallpapers.map((wallpaper) => (
              <WallpaperCard
                key={wallpaper.id}
                wallpaper={wallpaper}
                onPreview={onPreview}
                isFavorite={favoriteIds.has(wallpaper.id)}
                onToggleFavorite={handleToggleFavorite}
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
      )}
    </>
  );
};

export default WallpaperGrid;