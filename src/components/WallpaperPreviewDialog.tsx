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
import { Badge } from "./ui/badge";

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
        <div className="grid md:grid-cols-2 flex-grow overflow-hidden">
          <div className="flex items-center justify-center bg-muted/40 overflow-hidden p-4 h-full">
            <img
              src={wallpaper.image_url}
              alt={wallpaper.name || "Wallpaper"}
              className="max-w-full max-h-full object-contain rounded-md"
            />
          </div>
          <ScrollArea className="h-full">
            <div className="p-6">
              <DialogHeader className="p-0 pb-4">
                <DialogTitle className="text-2xl truncate">{wallpaper.name || "Wallpaper Preview"}</DialogTitle>
              </DialogHeader>
              
              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {wallpaper.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleDownload} size="lg" className="w-full my-4">
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