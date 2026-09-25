'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ThumbsUp, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
  onReaction?: (postId: string, type: string) => void;
  onDelete?: (postId: string) => void;
}

export function PostCard({ post, onReaction, onDelete }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleReaction = () => {
    setIsLiked(!isLiked);
    onReaction?.(post.id, 'LIKE');
    toast.success(isLiked ? 'Reaction removed' : 'Post liked!');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Post unsaved' : 'Post saved!');
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              href={`/profile/${post.author.username}`}
              className="font-semibold hover:underline"
            >
              {post.author.name}
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>@{post.author.username}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.visibility !== 'PUBLIC' && (
                <>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {post.visibility}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(post.id)}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="mt-4">
        <p className="whitespace-pre-wrap text-sm">{post.content}</p>
        {post.media && post.media.length > 0 && (
          <div className="mt-4 grid gap-2">
            {post.media.map((url, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={url}
                alt="Post media"
                className="rounded-lg object-cover w-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={isLiked ? 'text-primary' : ''}
          onClick={handleReaction}
        >
          <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          {post.reactionCount || 0}
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href={`/posts/${post.id}`}>
            <MessageCircle className="mr-2 h-4 w-4" />
            {post.commentCount || 0}
          </Link>
        </Button>

        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          {post.shareCount || 0}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`ml-auto ${isSaved ? 'text-primary' : ''}`}
          onClick={handleSave}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </Card>
  );
}
