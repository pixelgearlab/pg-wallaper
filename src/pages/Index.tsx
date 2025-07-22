import { useState } from "react";
import Header from "@/components/Header";
import WallpaperGrid from "@/components/WallpaperGrid";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <main>
          <WallpaperGrid searchTerm={searchTerm} />
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;