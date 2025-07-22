import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Wallpaper } from "@/components/WallpaperCard";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topWallpapers, setTopWallpapers] = useState<
    Pick<Wallpaper, "id" | "image_url">[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchTopWallpapers = async () => {
      const { data, error } = await supabase
        .from("wallpapers")
        .select("id, image_url")
        .order("download_count", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching top wallpapers:", error);
      } else if (data) {
        setTopWallpapers(data);
      }
    };

    fetchTopWallpapers();
  }, []);

  useEffect(() => {
    if (topWallpapers.length > 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          (prevIndex + 1) % topWallpapers.length
        );
      }, 3000); // Change image every 3 seconds

      return () => clearTimeout(timer);
    }
  }, [currentImageIndex, topWallpapers.length]);

  const handleJoinClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative text-center py-16 md:py-24 rounded-lg overflow-hidden my-8">
      <div className="absolute inset-0 z-0">
        {topWallpapers.length > 0 &&
          topWallpapers.map((wallpaper, index) => (
            <img
              key={wallpaper.id}
              src={wallpaper.image_url}
              alt="Top Wallpaper"
              className={`w-full h-full object-cover scale-110 absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      </div>
      <div className="relative z-10">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          PG Wallpaper
        </h1>
        <p
          className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Discover thousands of stunning wallpapers. Download in high quality
          and transform your devices.
        </p>
        <Button
          size="lg"
          className="mt-8 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
          onClick={handleJoinClick}
        >
          Join Now - It's Free
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;