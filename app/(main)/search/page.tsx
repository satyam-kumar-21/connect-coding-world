'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search as SearchIcon,
  Code,
  Users,
  FileText,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockUsers, mockProblems, mockPosts } from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return mockUsers;
    const q = query.toLowerCase();
    return mockUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q)) ||
        u.company?.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredProblems = useMemo(() => {
    if (!query.trim()) return mockProblems;
    const q = query.toLowerCase();
    return mockProblems.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return mockPosts;
    const q = query.toLowerCase();
    return mockPosts.filter(
      (p) =>
        p.content.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const totalResults =
    filteredUsers.length + filteredProblems.length + filteredPosts.length;

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Search &amp; Discovery</h1>
            <p className="text-muted-foreground mt-1">
              Find engineers, algorithmic challenges, technical posts, and code snippets across the platform.
            </p>
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by keywords, algorithms (e.g. Tree, Go, Redis), or developer names..."
              className="pl-12 h-12 text-base bg-card/60 border-border/80 rounded-xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="p-2 bg-card/60 border border-border/70 rounded-xl backdrop-blur">
              <TabsList className="bg-background/60">
                <TabsTrigger value="all" className="gap-2 text-xs font-semibold">
                  All Results ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="developers" className="gap-2 text-xs font-semibold">
                  <Users className="h-3.5 w-3.5" /> Developers ({filteredUsers.length})
                </TabsTrigger>
                <TabsTrigger value="problems" className="gap-2 text-xs font-semibold">
                  <Code className="h-3.5 w-3.5" /> Problems ({filteredProblems.length})
                </TabsTrigger>
                <TabsTrigger value="posts" className="gap-2 text-xs font-semibold">
                  <FileText className="h-3.5 w-3.5" /> Posts ({filteredPosts.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab: All */}
            <TabsContent value="all" className="space-y-8 mt-0">
              {/* Developers Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Developers ({filteredUsers.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('developers')}
                    className="text-xs text-primary hover:underline"
                  >
                    View all developers
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredUsers.slice(0, 3).map((user) => (
                    <Card
                      key={user.id}
                      className="p-4 bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 transition-all flex items-center gap-3.5"
                    >
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/profile/${user.username}`}
                          className="font-bold text-sm hover:text-primary transition-colors block truncate"
                        >
                          {user.name}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">
                          @{user.username} • {user.developerLevel || 'Engineer'}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {user.skills.slice(0, 2).map((s) => (
                            <span key={s} className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                        <Link href={`/profile/${user.username}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Problems Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Code className="h-4 w-4 text-emerald-400" /> Coding Problems ({filteredProblems.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('problems')}
                    className="text-xs text-primary hover:underline"
                  >
                    View all problems
                  </button>
                </div>

                <div className="space-y-2.5">
                  {filteredProblems.slice(0, 4).map((prob) => (
                    <Card
                      key={prob.id}
                      className="p-4 bg-card/60 border-border/70 backdrop-blur hover:border-emerald-500/50 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {prob.isSolved ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-muted-foreground/40 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/problems/${prob.slug}`}
                            className="font-bold text-sm hover:text-primary transition-colors block truncate"
                          >
                            {prob.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <span>{prob.category}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {prob.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="text-xs h-8" asChild>
                        <Link href={`/problems/${prob.slug}`}>Solve (+{prob.xpReward} XP)</Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Posts Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" /> Technical Posts ({filteredPosts.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="text-xs text-primary hover:underline"
                  >
                    View all posts
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredPosts.slice(0, 2).map((post) => (
                    <Card
                      key={post.id}
                      className="p-5 bg-card/60 border-border/70 backdrop-blur space-y-2 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-xs">{post.author.name}</span>
                        <span className="text-xs text-muted-foreground">@{post.author.username}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Developers */}
            <TabsContent value="developers" className="space-y-4 mt-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="p-5 bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5 mb-3">
                      <Avatar className="h-14 w-14 border border-border">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/profile/${user.username}`}
                          className="font-bold text-base hover:text-primary transition-colors block truncate"
                        >
                          {user.name}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">
                          @{user.username} • {user.developerLevel || 'Staff Engineer'}
                        </p>
                        <p className="text-xs text-primary font-semibold mt-1">
                          {formatXP(user.xp)} XP • #{user.rank} Global
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                      <Link href={`/profile/${user.username}`}>View Profile</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tab: Problems */}
            <TabsContent value="problems" className="space-y-3 mt-0">
              {filteredProblems.map((prob) => (
                <Card
                  key={prob.id}
                  className="p-4 bg-card/60 border-border/70 backdrop-blur hover:border-emerald-500/50 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {prob.isSolved ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-muted-foreground/40 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/problems/${prob.slug}`}
                        className="font-bold text-sm hover:text-primary transition-colors block truncate"
                      >
                        {prob.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{prob.category}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-[10px] h-4">
                          {prob.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="text-xs h-8" asChild>
                    <Link href={`/problems/${prob.slug}`}>Solve (+{prob.xpReward} XP)</Link>
                  </Button>
                </Card>
              ))}
            </TabsContent>

            {/* Tab: Posts */}
            <TabsContent value="posts" className="space-y-3 mt-0">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="p-5 bg-card/60 border-border/70 backdrop-blur space-y-2 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-bold text-sm block">{post.author.name}</span>
                      <span className="text-xs text-muted-foreground">@{post.author.username}</span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/90 whitespace-pre-line leading-relaxed">{post.content}</p>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
