import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        WallpaperVault
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Discover thousands of stunning wallpapers. Download in high quality and transform your devices.
      </p>
      <Button size="lg" className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }} onClick={handleJoinClick}>
        Join Now - It's Free
      </Button>
    </div>
  );
};

export default HeroSection;