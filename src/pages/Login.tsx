import { useState, FormEvent, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtSign, Lock, User as UserIcon } from 'lucide-react';

const Login = () => {
  const { session, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  useEffect(() => {
    document.title = "Login / Sign Up - PG WALLPAPER";
  }, []);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const toastId = showLoading('Signing in...');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    dismissToast(toastId);
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Welcome back!');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      showError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const toastId = showLoading('Creating account...');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    dismissToast(toastId);
    if (error) {
      showError(error.message);
    } else if (data.user) {
      showSuccess('Account created successfully! Welcome!');
    } else {
      showError('An unexpected error occurred during sign up.');
    }
    setLoading(false);
  };

  const onTabChange = (value: string) => {
    setEmail('');
    setPassword('');
    setFullName('');
    setActiveTab(value);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
       <Link to="/" className="absolute top-4 left-4 flex items-center gap-2 flex-shrink-0">
          <img src="https://i.ibb.co/23fx2fQg/20250722-063513.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold hidden sm:block">PG Wallpaper</h1>
        </Link>
      <div className="w-full max-w-sm animate-fade-in-up">
        <Tabs defaultValue="signin" value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <div className="bg-card p-8 rounded-b-lg shadow-lg">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Welcome Back</h2>
                <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
              </div>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative mt-1">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="signup">
            <div className="bg-card p-8 rounded-b-lg shadow-lg">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold">Create an Account</h2>
                <p className="text-sm text-muted-foreground mt-1">Join us and explore amazing wallpapers</p>
              </div>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-fullname">Full Name</Label>
                  <div className="relative mt-1">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative mt-1">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;