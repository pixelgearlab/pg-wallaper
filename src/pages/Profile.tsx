import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';

const Profile = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
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
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name ?? 'User'} />
            <AvatarFallback>{profile?.full_name?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="border-t border-border pt-6">
          <h2 className="text-lg font-semibold mb-4">My Favorite Wallpapers</h2>
          <p className="text-muted-foreground">
            This section will show your favorite wallpapers soon.
          </p>
        </div>
        <Button onClick={handleLogout} variant="destructive" className="w-full mt-8">
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;