import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { type Wallpaper } from "./WallpaperCard";
import { Skeleton } from "./ui/skeleton";
import Autoplay from "embla-carousel-autoplay";

const TopDownloadsSlider = () => {
  const [topWallpapers, setTopWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  useEffect(() => {
    const fetchTopWallpapers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("wallpapers")
        .select("*")
        .order("download_count", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching top wallpapers:", error);
      } else if (data) {
        setTopWallpapers(data);
      }
      setLoading(false);
    };

    fetchTopWallpapers();
  }, []);

  if (loading) {
    return (
      <div className="w-full mb-12">
        <Skeleton className="w-full aspect-[16/9] rounded-lg" />
      </div>
    );
  }

  if (topWallpapers.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-6">Top Downloads</h2>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {topWallpapers.map((wallpaper) => (
            <CarouselItem key={wallpaper.id}>
              <Card className="border-none overflow-hidden rounded-lg shadow-lg">
                <CardContent className="p-0">
                  <img
                    src={wallpaper.image_url}
                    alt={wallpaper.name || "Top Wallpaper"}
                    className="w-full h-auto object-cover aspect-[16/9]"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex left-[-1rem]" />
        <CarouselNext className="hidden sm:flex right-[-1rem]" />
      </Carousel>
    </div>
  );
};

export default TopDownloadsSlider;