import Header from "@/components/Header";
import WallpaperGrid from "@/components/WallpaperGrid";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main>
          <WallpaperGrid />
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;