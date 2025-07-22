import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { showError } from "@/utils/toast";

export type Wallpaper = {
  id: number;
  name: string | null;
  image_url: string;
  thumb_url: string;
  tags: string[] | null;
  download_count?: number;
};

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onPreview: (wallpaper: Wallpaper) => void;
  isFavorite: boolean;
  onToggleFavorite: (wallpaperId: number) => void;
}

const WallpaperCard = ({ wallpaper, onPreview, isFavorite, onToggleFavorite }: WallpaperCardProps) => {
  
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(wallpaper);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(wallpaper.id);
  };

  return (
    <Card 
      className="overflow-hidden group relative border-none shadow-lg rounded-lg bg-muted cursor-pointer" 
      onClick={handlePreview}
    >
      <CardContent className="p-0">
        <img
          src={wallpaper.thumb_url}
          alt={wallpaper.name || "Wallpaper"}
          className="aspect-[16/9] w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={handleFavoriteClick}
            variant="secondary"
            size="icon"
            className="rounded-full bg-black/30 hover:bg-black/50 text-white border-none"
          >
            <Heart className={cn("h-5 w-5", isFavorite && "fill-red-500 text-red-500")} />
          </Button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {wallpaper.name && (
            <p className="text-white font-semibold text-sm truncate">
              {wallpaper.name}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WallpaperCard;