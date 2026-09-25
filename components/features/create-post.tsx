'use client';

import { useState } from 'react';
import { Image, Link as LinkIcon, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/auth.store';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CreatePost({ onPost }: { onPost?: (content: string, visibility: string) => void }) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsPosting(true);
    try {
      await onPost?.(content, visibility);
      setContent('');
      toast.success('Post published successfully!');
    } catch (error) {
      toast.error('Failed to publish post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>{getInitials(user?.name || 'User')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="What are you working on?"
            className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" type="button" title="Add image">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" type="button">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="CONNECTIONS">Connections</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handlePost}
                disabled={isPosting || !content.trim()}
                size="sm"
              >
                <Send className="mr-2 h-4 w-4" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
