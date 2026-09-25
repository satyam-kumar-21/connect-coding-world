'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { mockUsers, mockProblems, mockPosts } from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';
import { 
  MapPin, 
  Link as LinkIcon, 
  Github, 
  Linkedin, 
  UserPlus, 
  Code,
  Trophy,
  Target,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  CheckCircle2,
  Circle,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/config';

export default function ExplorePage() {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <MainLayout>
      <div className="w-full py-6">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Explore</h1>
            <p className="text-muted-foreground mt-2">Discover developers, problems, and content</p>
          </div>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <Tabs defaultValue="developers" className="space-y-6">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="developers" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                  >
                    Developers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="problems"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                  >
                    Problems
                  </TabsTrigger>
                  <TabsTrigger 
                    value="posts"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6"
                  >
                    Posts
                  </TabsTrigger>
                </TabsList>

                {/* Developers Tab */}
                <TabsContent value="developers" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {mockUsers.map((user) => (
                      <Card key={user.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="space-y-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/20">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <Link href={`${ROUTES.PROFILE}/${user.username}`}>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors truncate">
                                  {user.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  Rank #{user.rank}
                                </Badge>
                                <span className="text-xs font-semibold text-primary">
                                  {formatXP(user.xp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                          
                          {/* Location & Links */}
                          <div className="space-y-2">
                            {user.location && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{user.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {user.github && (
                                <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                  <Github className="h-4 w-4" />
                                </a>
                              )}
                              {user.linkedin && (
                                <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                  <Linkedin className="h-4 w-4" />
                                </a>
                              )}
                              {user.website && (
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                  <LinkIcon className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1">
                            {user.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {user.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.skills.length - 3}
                              </Badge>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Code className="h-3 w-3 text-muted-foreground" />
                              <span>{user.problemsSolved} solved</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 text-muted-foreground" />
                              <span>{user.streak} day streak</span>
                            </div>
                          </div>

                          {/* Connect Button */}
                          <Button className="w-full" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Problems Tab */}
                <TabsContent value="problems" className="space-y-4 mt-6">
                  <div className="space-y-3">
                    {mockProblems.map((problem) => (
                      <Card key={problem.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Status Icon */}
                            <div className="flex-shrink-0 mt-1">
                              {problem.isSolved ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>

                            {/* Problem Info */}
                            <div className="flex-1 min-w-0 space-y-3">
                              <div>
                                <Link href={`/problems/${problem.slug}`}>
                                  <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                    {problem.title}
                                  </h3>
                                </Link>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {problem.description}
                                </p>
                              </div>

                              {/* Tags & Category */}
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge 
                                  variant={
                                    problem.difficulty === 'EASY' 
                                      ? 'default' 
                                      : problem.difficulty === 'MEDIUM' 
                                      ? 'secondary' 
                                      : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {problem.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {problem.category}
                                </Badge>
                                {problem.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* Stats */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  <span>{problem.acceptanceRate}% acceptance</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Code className="h-3 w-3" />
                                  <span>{problem.totalSubmissions.toLocaleString()} submissions</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Trophy className="h-3 w-3 text-primary" />
                                  <span className="text-primary font-semibold">{problem.xpReward} XP</span>
                                </div>
                              </div>
                            </div>

                            {/* Solve Button */}
                            <Button size="sm" asChild>
                              <Link href={`/problems/${problem.slug}`}>
                                Solve
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Posts Tab */}
                <TabsContent value="posts" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    {mockPosts.map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border border-border">
                              <AvatarImage src={post.author.avatar} alt={post.author.name} />
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {getInitials(post.author.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Link href={`${ROUTES.PROFILE}/${post.author.username}`}>
                                  <h4 className="font-semibold hover:text-primary transition-colors">
                                    {post.author.name}
                                  </h4>
                                </Link>
                                <span className="text-sm text-muted-foreground">
                                  @{post.author.username}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimeAgo(post.createdAt)}</span>
                                <Badge variant="outline" className="text-xs">
                                  Rank #{post.author.rank}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm whitespace-pre-line">{post.content}</p>

                          {/* Engagement Stats */}
                          <div className="flex items-center gap-6 pt-3 border-t">
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <Heart className="h-4 w-4" />
                              <span>{post.reactionCount}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.commentCount}</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <Share2 className="h-4 w-4" />
                              <span>{post.shareCount}</span>
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block w-80 flex-shrink-0 space-y-6">
              {/* Trending Tags */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    Trending Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: 'React', count: 1245, trend: '+12%' },
                    { name: 'TypeScript', count: 1089, trend: '+8%' },
                    { name: 'Python', count: 987, trend: '+15%' },
                    { name: 'Node.js', count: 856, trend: '+6%' },
                    { name: 'Docker', count: 734, trend: '+10%' },
                    { name: 'AWS', count: 621, trend: '+5%' },
                  ].map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{skill.count}</span>
                        <Badge variant="secondary" className="text-xs">{skill.trend}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-500" />
                    </div>
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Developers</span>
                      <span className="text-lg font-bold text-primary">12.5K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Problems Solved</span>
                      <span className="text-lg font-bold text-green-500">1.2M+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Posts Today</span>
                      <span className="text-lg font-bold text-blue-500">342</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Live Sessions</span>
                      <span className="text-lg font-bold text-orange-500">28</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Code className="h-4 w-4 text-purple-500" />
                    </div>
                    Problem Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: 'Data Structures & Algorithms', count: 450, color: 'bg-blue-500' },
                    { name: 'JavaScript', count: 234, color: 'bg-yellow-500' },
                    { name: 'System Design', count: 189, color: 'bg-green-500' },
                    { name: 'APIs & Backend', count: 156, color: 'bg-purple-500' },
                    { name: 'Frontend', count: 142, color: 'bg-pink-500' },
                  ].map((category) => (
                    <div key={category.name} className="p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`h-2 w-2 rounded-full ${category.color}`} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${category.color}`} 
                            style={{ width: `${(category.count / 450) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{category.count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Suggested Connections */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-500" />
                    </div>
                    Suggested
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.skills[0]}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 px-2">
                        <UserPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/connections">View All</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
