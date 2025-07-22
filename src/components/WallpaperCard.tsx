import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

export type Wallpaper = {
  id: number;
  name: string | null;
  image_url: string;
  thumb_url: string;
  tags: string[] | null;
};

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onPreview: (wallpaper: Wallpaper) => void;
}

const WallpaperCard = ({ wallpaper, onPreview }: WallpaperCardProps) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = wallpaper.image_url;
    link.download = wallpaper.name ? `${wallpaper.name}.jpg` : "wallpaper.jpg";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(wallpaper);
  };

  return (
    <Card className="overflow-hidden group relative border-none shadow-lg rounded-lg bg-muted">
      <CardContent className="p-0">
        <img
          src={wallpaper.thumb_url}
          alt={wallpaper.name || "Wallpaper"}
          className="aspect-[16/9] w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-center p-4">
          {wallpaper.name && (
            <p className="text-white font-semibold text-sm truncate mb-3 text-center">
              {wallpaper.name}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              onClick={handlePreview}
              variant="secondary"
              size="icon"
              className="rounded-full"
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="icon"
              className="rounded-full"
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WallpaperCard;