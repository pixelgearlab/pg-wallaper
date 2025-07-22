import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export type Wallpaper = {
  id: number;
  name: string | null;
  image_url: string;
  thumb_url: string;
  tags: string[] | null;
};

interface WallpaperCardProps {
  wallpaper: Wallpaper;
}

const WallpaperCard = ({ wallpaper }: WallpaperCardProps) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click events
    const link = document.createElement('a');
    link.href = wallpaper.image_url;
    link.download = wallpaper.name ? `${wallpaper.name}.jpg` : 'wallpaper.jpg';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="overflow-hidden group relative border-none shadow-lg rounded-lg">
      <CardContent className="p-0">
        <img
          src={wallpaper.thumb_url}
          alt={wallpaper.name || "Wallpaper"}
          className="aspect-[9/16] w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {wallpaper.name && (
            <p className="text-white font-semibold text-sm truncate">{wallpaper.name}</p>
          )}
          <Button 
            onClick={handleDownload} 
            variant="secondary" 
            size="sm" 
            className="rounded-full w-full mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WallpaperCard;