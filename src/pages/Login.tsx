import { useState, FormEvent, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Login - PG WALLPAPER";
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError('Please enter your email address.');
      return;
    }
    setLoading(true);
    const toastId = showLoading('Sending magic link...');

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // This is where the user will be redirected after clicking the magic link.
        emailRedirectTo: window.location.origin,
      },
    });

    dismissToast(toastId);
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Check your email for the magic link!');
      setEmail('');
    }
    setLoading(false);
  };

  const handleCreateAccountClick = () => {
    emailInputRef.current?.focus();
  };

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
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Sign in to your account with your email</p>
      </div>
      <div className="w-full max-w-sm bg-card p-8 rounded-lg shadow-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send you a magic link</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={emailInputRef}
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              'Sending...'
            ) : (
              <>
                Send magic link
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <span 
            className="font-medium text-primary cursor-pointer hover:underline"
            onClick={handleCreateAccountClick}
          >
            Create one here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;