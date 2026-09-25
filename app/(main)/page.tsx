'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Radio, Trophy, TrendingUp, Code, Flame, Users } from 'lucide-react';
import { CreatePost } from '@/components/features/create-post';
import { PostCard } from '@/components/features/post-card';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockPosts, mockUsers, mockLeaderboard, currentUser } from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';

export default function HomePage() {
  const [posts, setPosts] = useState(mockPosts);
  const liveDevelopers = mockUsers.filter(u => u.isOnline && u.isAvailableForConnection && u.id !== currentUser.id);
  const topDevelopers = mockLeaderboard.slice(0, 5);

  return (
    <MainLayout>
      <div className="w-full py-6">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Main Feed */}
          <div className="space-y-6">
            {/* User Stats Banner */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-background relative">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-lg">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">
                      Welcome back, {currentUser.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-muted-foreground">Ready to code and connect today?</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur border border-border/50">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{formatXP(currentUser.xp)}</div>
                      <p className="text-xs text-muted-foreground">Total XP</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur border border-border/50">
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Flame className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{currentUser.streak}</div>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur border border-border/50">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Code className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">{currentUser.problemsSolved}</div>
                      <p className="text-xs text-muted-foreground">Problems Solved</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Create Post */}
            <CreatePost onPost={(content, visibility) => {
              const newPost = {
                id: Date.now().toString(),
                content,
                authorId: currentUser.id,
                author: currentUser,
                visibility: visibility as any,
                reactionCount: 0,
                commentCount: 0,
                shareCount: 0,
                reactions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setPosts([newPost, ...posts]);
            }} />

            {/* Feed Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Live Developers */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-green-500/5 to-background">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Radio className="h-4 w-4 text-green-500 animate-pulse-dot" />
                    </div>
                    Live Now
                  </h3>
                  <Badge variant="success" className="text-xs">
                    {liveDevelopers.length} online
                  </Badge>
                </div>

                {liveDevelopers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No developers currently available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {liveDevelopers.slice(0, 3).map((dev) => (
                      <Link
                        key={dev.id}
                        href={`/profile/${dev.username}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all group"
                      >
                        <div className="relative">
                          <Avatar className="border-2 border-green-500/20 group-hover:border-green-500/40 transition-colors">
                            <AvatarImage src={dev.avatar} alt={dev.name} />
                            <AvatarFallback>{getInitials(dev.name)}</AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                            <span className="h-2 w-2 rounded-full bg-white animate-pulse-dot"></span>
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{dev.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {dev.skills[0]}
                          </p>
                        </div>
                      </Link>
                    ))}
                    
                    <Button variant="outline" className="w-full mt-3" size="sm" asChild>
                      <Link href="/live">
                        View All ({liveDevelopers.length})
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Top Developers */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-background">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    Top Developers
                  </h3>
                </div>

                <div className="space-y-3">
                  {topDevelopers.map((entry, index) => (
                    <Link
                      key={entry.user.id}
                      href={`/profile/${entry.user.username}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/50 transition-all group"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-9 w-9 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                        <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                        <AvatarFallback className="text-xs">{getInitials(entry.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{entry.user.name}</p>
                        <p className="text-xs text-primary font-semibold">{formatXP(entry.xp)} XP</p>
                      </div>
                    </Link>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-3" size="sm" asChild>
                    <Link href="/leaderboard">
                      View Full Leaderboard
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500/5 to-background">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                    <Link href="/problems">
                      <Code className="mr-2 h-4 w-4" />
                      Solve Problems
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                    <Link href="/connections">
                      <Users className="mr-2 h-4 w-4" />
                      Find Developers
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
