import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { showError, showSuccess } from '@/utils/toast';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { useNavigate } from 'react-router-dom';

type CommentWithProfile = {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

interface CommentSectionProps {
  wallpaperId: number;
}

const CommentSection = ({ wallpaperId }: CommentSectionProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(full_name, avatar_url)')
        .eq('wallpaper_id', wallpaperId)
        .order('created_at', { ascending: false });

      if (error) {
        showError('Could not fetch comments.');
      } else {
        setComments(data as CommentWithProfile[]);
      }
      setLoading(false);
    };

    fetchComments();
  }, [wallpaperId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('You must be logged in to comment.');
      navigate('/login');
      return;
    }
    if (newComment.trim().length === 0) {
      showError('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from('comments')
      .insert({
        wallpaper_id: wallpaperId,
        user_id: user.id,
        content: newComment.trim(),
      })
      .select('*, profiles(full_name, avatar_url)')
      .single();

    if (error) {
      showError('Failed to post comment.');
    } else if (data) {
      setComments([data as CommentWithProfile, ...comments]);
      setNewComment('');
      showSuccess('Comment posted!');
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
      {user ? (
        <form onSubmit={handleSubmit} className="flex items-start gap-4 mb-6">
          <Avatar>
            <AvatarImage src={profile?.avatar_url ?? ''} />
            <AvatarFallback>{profile?.full_name?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
              disabled={submitting}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center text-muted-foreground mb-6">
          <Button variant="link" onClick={() => navigate('/login')}>Log in</Button> to post a comment.
        </div>
      )}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={comment.profiles?.avatar_url ?? ''} />
                <AvatarFallback>{comment.profiles?.full_name?.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{comment.profiles?.full_name ?? 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;