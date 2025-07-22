import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';
import Search from './Search';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header = ({ searchTerm, onSearchChange }: HeaderProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Failed to log out.');
    } else {
      showSuccess('Logged out successfully.');
      navigate('/');
    }
  };

  return (
    <header className="py-3 border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="https://i.ibb.co/23fx2fQg/20250722-063513.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold hidden sm:block">PG Wallpaper</h1>
        </Link>
        
        <div className="flex-1 px-4 sm:px-8 lg:px-16 hidden md:block">
          <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loading ? (
            <div className="h-10 w-20 bg-muted rounded-md animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name ?? ''} />
                    <AvatarFallback>{profile?.full_name?.charAt(0) ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;