'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  MapPin, Link as LinkIcon, Github, Linkedin, Trophy, Code, Award, 
  Calendar, Flame, TrendingUp, Target, Check, Users, MessageCircle,
  ExternalLink, Mail, Globe, Clock, Zap, Star, Activity
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PostCard } from '@/components/features/post-card';
import { getInitials, formatXP } from '@/lib/utils';
import { mockUsers, mockPosts, mockProblems, currentUser } from '@/lib/mock-data';

export default function ProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  
  // Find user from mock data
  const user = mockUsers.find(u => u.username === username) || mockUsers[0];
  const isOwnProfile = user.id === currentUser.id;
  
  // Get user's posts
  const userPosts = mockPosts.filter(p => p.authorId === user.id);
  
  // Get user's solved problems
  const solvedProblems = mockProblems.filter(p => p.isSolved);
  
  // Calculate stats
  const joinDate = new Date(user.createdAt);
  const daysSinceJoined = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <MainLayout>
      <div className="w-full">
        {/* Cover Section with Gradient */}
        <div className="relative">
          <div className="h-56 bg-gradient-to-br from-primary via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          </div>
          
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="relative -mt-20">
              {/* Profile Header Card */}
              <Card className="p-6 border-0 bg-gradient-to-br from-card/95 to-card backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex flex-col sm:flex-row gap-6 flex-1">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-2xl ring-4 ring-background">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-green-500 border-4 border-background flex items-center justify-center shadow-lg">
                          <div className="h-3 w-3 rounded-full bg-white animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h1 className="text-3xl font-bold">{user.name}</h1>
                          {user.rank <= 3 && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                              <Star className="h-3 w-3 mr-1" />
                              Top {user.rank}
                            </Badge>
                          )}
                          {user.isAvailableForConnection && (
                            <Badge variant="success" className="gap-1">
                              <Zap className="h-3 w-3" />
                              Available for Connection
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg text-muted-foreground mt-1">@{user.username}</p>
                      </div>
                      
                      {user.bio && (
                        <p className="text-base text-foreground/90 leading-relaxed max-w-2xl">
                          {user.bio}
                        </p>
                      )}
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        {user.location && (
                          <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <MapPin className="h-4 w-4" />
                            {user.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          Joined {joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {daysSinceJoined} days active
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </span>
                      </div>
                      
                      {/* Social Links */}
                      <div className="flex flex-wrap gap-3">
                        {user.website && (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
                          >
                            <Globe className="h-4 w-4" />
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {user.github && (
                          <a
                            href={user.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
                          >
                            <Github className="h-4 w-4" />
                            GitHub
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {user.linkedin && (
                          <a
                            href={user.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors text-sm font-medium"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {!isOwnProfile && (
                    <div className="flex sm:flex-col gap-3 lg:w-48">
                      <Button className="flex-1 sm:w-full gap-2 h-11">
                        <Users className="h-4 w-4" />
                        Connect
                      </Button>
                      <Button variant="outline" className="flex-1 sm:w-full gap-2 h-11">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left Column - Stats & Content */}
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-5 border-0 bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">Total XP</div>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatXP(user.xp)}</p>
                </Card>

                <Card className="p-5 border-0 bg-gradient-to-br from-orange-500/10 to-orange-500/5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">Streak</div>
                  </div>
                  <p className="text-2xl font-bold text-orange-500">{user.streak} days</p>
                </Card>

                <Card className="p-5 border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Code className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">Problems</div>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{user.problemsSolved}</p>
                </Card>

                <Card className="p-5 border-0 bg-gradient-to-br from-green-500/10 to-green-500/5 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">Accuracy</div>
                  </div>
                  <p className="text-2xl font-bold text-green-500">{user.acceptanceRate}%</p>
                </Card>
              </div>

              {/* Additional Stats */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="p-5 border-0 bg-gradient-to-br from-purple-500/5 to-background">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground">Ranking</h3>
                    <Award className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-purple-500">#{user.rank}</span>
                      <span className="text-sm text-muted-foreground">Global</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-medium">Top {((user.rank / mockUsers.length) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border-0 bg-gradient-to-br from-cyan-500/5 to-background">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-muted-foreground">Activity</h3>
                    <Activity className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-cyan-500">{userPosts.length}</span>
                      <span className="text-sm text-muted-foreground">Posts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-cyan-500" />
                      Active contributor
                    </div>
                  </div>
                </Card>
              </div>

              {/* Content Tabs */}
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="posts"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Posts ({userPosts.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="problems"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Problems ({user.problemsSolved})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Activity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-6 space-y-4">
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <Card className="p-12 text-center border-0 bg-muted/30">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                          <MessageCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">No posts yet</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {isOwnProfile ? "Start sharing your thoughts!" : `${user.name} hasn't posted anything yet`}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="problems" className="mt-6">
                  <Card className="border-0 divide-y divide-border">
                    {solvedProblems.map((problem) => (
                      <div key={problem.id} className="p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Check className="h-4 w-4 text-green-500" />
                              </div>
                              <h3 className="font-semibold hover:text-primary cursor-pointer">
                                {problem.title}
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-2 ml-11">
                              <Badge variant={
                                problem.difficulty === 'EASY' ? 'success' : 
                                problem.difficulty === 'MEDIUM' ? 'warning' : 'destructive'
                              } className="text-xs">
                                {problem.difficulty}
                              </Badge>
                              {problem.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-500">+{problem.xpReward} XP</div>
                            <div className="text-xs text-muted-foreground">{problem.acceptanceRate}% accepted</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <Card className="p-8 text-center border-0 bg-muted/30">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Activity className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Activity Timeline</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Recent activity and achievements will appear here
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Skills & Technologies */}
              <Card className="p-6 border-0 bg-gradient-to-br from-card to-card/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Skills & Technologies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="px-3 py-1.5 text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <Card className="p-6 border-0 bg-gradient-to-br from-card to-card/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Star className="h-4 w-4 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Interests</h3>
                  </div>
                  <div className="space-y-2">
                    {user.interests.map((interest) => (
                      <div 
                        key={interest}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                        <span className="text-sm">{interest}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Quick Stats Card */}
              <Card className="p-6 border-0 bg-gradient-to-br from-primary/5 to-background">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-sm text-muted-foreground">Total Submissions</span>
                    <span className="font-semibold">
                      {solvedProblems.reduce((acc, p) => acc + p.totalSubmissions, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-sm text-muted-foreground">Avg. Acceptance</span>
                    <span className="font-semibold text-green-500">{user.acceptanceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-sm text-muted-foreground">Total Posts</span>
                    <span className="font-semibold">{userPosts.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-semibold">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
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
