import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Wallpaper } from "./WallpaperCard";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WallpaperPreviewDialogProps {
  wallpaper: Wallpaper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WallpaperPreviewDialog = ({
  wallpaper,
  open,
  onOpenChange,
}: WallpaperPreviewDialogProps) => {
  if (!wallpaper) return null;

  const handleDownload = async () => {
    try {
      await supabase.functions.invoke('increment-download', {
        body: { wallpaperId: wallpaper.id },
      });
    } catch (error) {
      console.error('Failed to update download count:', error);
    }

    const link = document.createElement("a");
    link.href = wallpaper.image_url;
    link.download = wallpaper.name ? `${wallpaper.name}.jpg` : "wallpaper.jpg";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-0 shadow-none">
        <div className="relative">
          <img
            src={wallpaper.image_url}
            alt={wallpaper.name || "Wallpaper"}
            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          />
          <div className="absolute bottom-4 right-4">
            <Button onClick={handleDownload} size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WallpaperPreviewDialog;