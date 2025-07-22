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
import CommentSection from "./CommentSection";
import { ScrollArea } from "./ui/scroll-area";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="truncate">{wallpaper.name || "Wallpaper Preview"}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 flex-grow overflow-hidden">
          <div className="flex items-center justify-center bg-muted/40 overflow-hidden p-4">
            <img
              src={wallpaper.image_url}
              alt={wallpaper.name || "Wallpaper"}
              className="max-w-full max-h-full object-contain rounded-md"
            />
          </div>
          <ScrollArea className="h-full">
            <div className="p-6">
              <Button onClick={handleDownload} size="lg" className="w-full">
                <Download className="h-5 w-5 mr-2" />
                Download
              </Button>
              <CommentSection wallpaperId={wallpaper.id} />
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WallpaperPreviewDialog;