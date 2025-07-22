import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { useEffect, useState } from 'react';
import WallpaperCard, { type Wallpaper } from '@/components/WallpaperCard';
import { Skeleton } from '@/components/ui/skeleton';
import WallpaperPreviewDialog from '@/components/WallpaperPreviewDialog';
import Header from '@/components/Header';

const Profile = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My Profile - PG WALLPAPER";
    if (user) {
      const fetchFavorites = async () => {
        setLoadingFavorites(true);
        const { data: favoriteIds, error: favError } = await supabase
          .from('favorites')
          .select('wallpaper_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (favError) {
          showError("Could not fetch your favorites.");
          setFavorites([]);
          setLoadingFavorites(false);
          return;
        }
        
        if (!favoriteIds || favoriteIds.length === 0) {
          setFavorites([]);
          setLoadingFavorites(false);
          return;
        }

        const wallpaperIds = favoriteIds.map(fav => fav.wallpaper_id);
        const { data: wallpapers, error: wallpaperError } = await supabase
          .from('wallpapers')
          .select('*')
          .in('id', wallpaperIds);

        if (wallpaperError) {
          showError("Could not fetch favorite wallpapers.");
        } else {
          // Preserve the order from the favorites table
          const orderedWallpapers = wallpaperIds.map(favId => wallpapers?.find(w => w.id === favId.wallpaper_id)).filter(Boolean) as Wallpaper[];
          setFavorites(orderedWallpapers);
        }
        setLoadingFavorites(false);
      };
      fetchFavorites();
    }
  }, [user]);

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Failed to log out.');
    } else {
      showSuccess('Logged out successfully.');
      navigate('/');
    }
  };

  const handleToggleFavorite = async (wallpaperId: number) => {
    setFavorites(prev => prev.filter(w => w.id !== wallpaperId));
    
    const { error } = await supabase.from('favorites').delete().match({ user_id: user.id, wallpaper_id: wallpaperId });
    if (error) {
      showError("Failed to remove from favorites.");
      // In a real app, you might want to re-fetch or add the wallpaper back on error.
    } else {
      showSuccess("Removed from favorites.");
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name ?? 'User'} />
              <AvatarFallback className="text-3xl">{profile?.full_name?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <h2 className="text-2xl font-semibold mb-6">My Favorite Wallpapers</h2>
            {loadingFavorites ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-full aspect-[16/9] rounded-lg" />
                ))}
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {favorites.map(wallpaper => (
                  <WallpaperCard
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    onPreview={setPreviewWallpaper}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground">You haven't favorited any wallpapers yet.</p>
                <Button onClick={() => navigate('/')} className="mt-4">Explore Wallpapers</Button>
              </div>
            )}
          </div>
          <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto sm:ml-auto mt-8 flex">
            Log Out
          </Button>
        </div>
      </div>
      <WallpaperPreviewDialog
        wallpaper={previewWallpaper}
        open={!!previewWallpaper}
        onOpenChange={() => setPreviewWallpaper(null)}
      />
    </>
  );
};

export default Profile;