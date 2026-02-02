import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getAnonymousId, canPost, setLastPostTime } from '@/lib/anonymousId';
import { shouldHideContent } from '@/lib/contentModeration';

export interface Thought {
  id: string;
  content: string;
  created_at: string;
}

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anonymousId = typeof window !== 'undefined' ? getAnonymousId() : '';

  const fetchThoughts = useCallback(async () => {
    if (!anonymousId) return;
    
    try {
      const { data, error } = await supabase
        .from('thoughts')
        .select('id, content, created_at')
        .neq('author_hash', anonymousId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setThoughts(data || []);
    } catch (err) {
      console.error('Error fetching thoughts:', err);
      setError('Failed to load thoughts');
    } finally {
      setLoading(false);
    }
  }, [anonymousId]);

  const postThought = async (content: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedContent = content.trim();
    
    if (!trimmedContent) {
      return { success: false, error: 'Please write something before dumping.' };
    }

    if (trimmedContent.length > 1000) {
      return { success: false, error: 'Keep it under 1000 characters.' };
    }

    const rateLimit = canPost();
    if (!rateLimit.allowed) {
      const minutes = Math.floor(rateLimit.waitSeconds / 60);
      const seconds = rateLimit.waitSeconds % 60;
      return { 
        success: false, 
        error: `Wait ${minutes}:${seconds.toString().padStart(2, '0')} before dumping again.` 
      };
    }

    setPosting(true);
    setError(null);

    try {
      const isHidden = shouldHideContent(trimmedContent);
      
      const { error } = await supabase
        .from('thoughts')
        .insert({
          content: trimmedContent,
          author_hash: anonymousId,
          is_hidden: isHidden,
        });

      if (error) throw error;
      
      setLastPostTime();
      return { success: true };
    } catch (err) {
      console.error('Error posting thought:', err);
      return { success: false, error: 'Failed to dump thought. Try again.' };
    } finally {
      setPosting(false);
    }
  };

  // Initial fetch and realtime subscription
  useEffect(() => {
    fetchThoughts();

    // Subscribe to new thoughts (excluding own)
    const channel = supabase
      .channel('thoughts-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'thoughts',
        },
        (payload) => {
          const newThought = payload.new as { id: string; content: string; created_at: string; author_hash: string; is_hidden: boolean };
          // Only add if not from this user and not hidden
          if (newThought.author_hash !== anonymousId && !newThought.is_hidden) {
            setThoughts(prev => [{
              id: newThought.id,
              content: newThought.content,
              created_at: newThought.created_at,
            }, ...prev].slice(0, 50));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [anonymousId, fetchThoughts]);

  return {
    thoughts,
    loading,
    posting,
    error,
    postThought,
    refreshThoughts: fetchThoughts,
  };
}
