import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Wallpaper } from "./WallpaperCard";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils/toast";

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
    const toastId = showLoading("Preparing download...");
    try {
      // Increment download count in parallel
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
      
      // Clean up
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[95vh] w-auto h-auto p-4 bg-card flex flex-col">
        <DialogHeader>
          <DialogTitle className="truncate">{wallpaper.name || "Wallpaper Preview"}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center overflow-hidden">
          <img
            src={wallpaper.image_url}
            alt={wallpaper.name || "Wallpaper"}
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={handleDownload} size="lg">
            <Download className="h-5 w-5 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WallpaperPreviewDialog;