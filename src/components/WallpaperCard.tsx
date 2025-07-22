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
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = wallpaper.image_url;
    link.download = wallpaper.name ? `${wallpaper.name}.jpg` : 'wallpaper.jpg';
    link.target = '_blank'; // Open in new tab to avoid navigation issues
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
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button onClick={handleDownload} variant="secondary" size="icon" className="rounded-full">
            <Download className="h-5 w-5" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WallpaperCard;