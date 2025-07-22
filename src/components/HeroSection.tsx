import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { type Wallpaper } from "./WallpaperCard";
import Search from "./Search";
import { Skeleton } from "./ui/skeleton";

interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const HeroSection = ({ searchTerm, onSearchChange }: HeroSectionProps) => {
  const [topWallpapers, setTopWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  useEffect(() => {
    const fetchTopWallpapers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("wallpapers")
        .select("image_url, name")
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
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden rounded-lg mb-12 shadow-lg">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden rounded-lg mb-12 shadow-lg">
      <Carousel
        plugins={[plugin.current]}
        className="absolute inset-0 w-full h-full"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {topWallpapers.length > 0 ? (
            topWallpapers.map((wallpaper, index) => (
              <CarouselItem key={index} className="h-full">
                <img
                  src={wallpaper.image_url}
                  alt={wallpaper.name || "Top Wallpaper"}
                  className="w-full h-full object-cover filter blur-sm scale-105"
                />
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="h-full">
              <div className="w-full h-full bg-muted"></div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight drop-shadow-lg">
          PG WALLPAPER
        </h1>
        <p className="mt-4 text-lg md:text-xl drop-shadow">
          Discover your next favorite wallpaper
        </p>
        <div className="max-w-md w-full mx-auto mt-8">
          <Search variant="hero" searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;