import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import WallpaperCard, { type Wallpaper } from '@/components/WallpaperCard';
import { Skeleton } from '@/components/ui/skeleton';
import WallpaperPreviewDialog from '@/components/WallpaperPreviewDialog';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';

const Profile = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null);

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

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
          const orderedWallpapers = wallpaperIds.map(favId => wallpapers?.find(w => w.id === favId.wallpaper_id)).filter(Boolean) as Wallpaper[];
          setFavorites(orderedWallpapers);
        }
        setLoadingFavorites(false);
      };
      fetchFavorites();
    }
  }, [user]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);
    const toastId = showLoading('Updating profile...');

    const { error } = await supabase.from('profiles').update({
      full_name: fullName,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    dismissToast(toastId);
    if (error) {
      showError('Failed to update profile.');
    } else {
      showSuccess('Profile updated successfully! Refresh to see changes.');
    }
    setUpdating(false);
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);

      const { error: updateError } = await supabase.from('profiles').update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      if (updateError) throw updateError;
      
      showSuccess('Avatar updated! Refresh to see changes.');
    } catch (error: any) {
      showError(error.message || 'Failed to upload avatar.');
    } finally {
      setUploading(false);
    }
  };

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
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl ?? ''} alt={profile?.full_name ?? 'User'} />
                <AvatarFallback className="text-3xl">{fullName?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
              {uploading && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>}
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h1 className="text-3xl font-bold">{fullName || 'Set Your Name'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="border-t border-border pt-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email ?? ''} disabled />
              </div>
              <Button type="submit" disabled={updating || uploading}>
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>

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