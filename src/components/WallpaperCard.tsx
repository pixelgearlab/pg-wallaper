import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, Eye, Expand } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils/toast";

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
  index: number;
}

const WallpaperCard = ({ wallpaper, onPreview, isFavorite, onToggleFavorite, index }: WallpaperCardProps) => {
  
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(wallpaper);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(wallpaper.id);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const toastId = showLoading("Preparing download...");
    try {
      supabase.functions.invoke('increment-download', {
        body: { wallpaperId: wallpaper.id },
      }).catch(console.error);

      const response = await fetch(wallpaper.image_url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = wallpaper.name ? `${wallpaper.name}.jpg` : "wallpaper.jpg";
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
      
      dismissToast(toastId);
      showSuccess("Download started!");

    } catch (error) {
      console.error("Download failed:", error);
      dismissToast(toastId);
      showError("Download failed. Please try again.");
    }
  };

  return (
    <div className="animate-scale-in" style={{ animationDelay: `${(index % 20) * 50}ms` }}>
      <Card 
        className="overflow-hidden group relative border-none shadow-lg rounded-lg bg-card"
      >
        <CardContent className="p-0 aspect-[16/9] relative">
          <img
            src={wallpaper.thumb_url}
            alt={wallpaper.name || "Wallpaper"}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          
          {wallpaper.tags && wallpaper.tags.length > 0 && (
            <Badge variant="default" className="absolute top-2 left-2 capitalize">
              {wallpaper.tags[0]}
            </Badge>
          )}
          
          <Badge variant="secondary" className="absolute top-2 right-2 bg-black/40 text-white">
            1920x1080
          </Badge>

          <div 
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Button onClick={handlePreview} size="icon" variant="ghost" className="bg-black/30 hover:bg-black/50 text-white rounded-lg">
              <Expand className="h-5 w-5" />
            </Button>
            <Button onClick={handleDownload} size="icon" variant="ghost" className="bg-black/30 hover:bg-black/50 text-white rounded-lg">
              <Download className="h-5 w-5" />
            </Button>
            <Button onClick={handleFavoriteClick} size="icon" variant="ghost" className="bg-black/30 hover:bg-black/50 text-white rounded-lg">
              <Heart className={cn("h-5 w-5", isFavorite && "fill-red-500 text-red-500")} />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start p-4">
          <h4 className="font-semibold text-base truncate w-full">{wallpaper.name || "Untitled Wallpaper"}</h4>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 w-full">
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{wallpaper.download_count ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>1.2k</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Eye className="h-4 w-4" />
              <span>71.6k</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WallpaperCard;