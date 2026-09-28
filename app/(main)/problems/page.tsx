'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  Code2,
  BookOpen,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProblems, currentUser } from '@/lib/mock-data';

const CATEGORIES = [
  'all',
  'DSA',
  'JAVASCRIPT',
  'SYSTEM_DESIGN',
  'APIs',
  'REACT',
  'NODEJS',
  'PYTHON',
];

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved'>('all');

  const filteredProblems = useMemo(() => {
    return mockProblems.filter((problem) => {
      const matchesSearch =
        search === '' ||
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        problem.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === 'all' || problem.category.toUpperCase() === category.toUpperCase();
      const matchesDifficulty =
        difficulty === 'all' || problem.difficulty.toUpperCase() === difficulty.toUpperCase();
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'solved' && problem.isSolved) ||
        (statusFilter === 'unsolved' && !problem.isSolved);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [search, category, difficulty, statusFilter]);

  const stats = {
    total: mockProblems.length,
    solved: mockProblems.filter((p) => p.isSolved).length,
    easy: mockProblems.filter((p) => p.difficulty === 'EASY').length,
    medium: mockProblems.filter((p) => p.difficulty === 'MEDIUM').length,
    hard: mockProblems.filter((p) => p.difficulty === 'HARD').length,
    expert: mockProblems.filter((p) => p.difficulty === 'EXPERT').length,
  };

  const solvedPercentage = Math.round((stats.solved / stats.total) * 100);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-semibold">Easy</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs font-semibold">Medium</Badge>;
      case 'HARD':
        return <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-xs font-semibold">Hard</Badge>;
      case 'EXPERT':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs font-semibold">Expert</Badge>;
      default:
        return <Badge variant="outline">{diff}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/15 via-purple-500/10 to-background p-6 md:p-8">
            <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Curated Algorithms & System Design</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Coding Problem Repository
                </h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                  Solve industry-tested coding challenges, practice algorithm patterns, and level up your developer rank with instant XP rewards.
                </p>
              </div>

              {/* Quick Daily Banner CTA */}
              <div className="flex items-center gap-4 bg-background/80 backdrop-blur border border-border/70 p-4 rounded-xl shadow-lg">
                <div className="h-12 w-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-semibold tracking-wider text-orange-400">Daily Challenge</span>
                    <span className="text-xs text-muted-foreground">• +25 XP Bonus</span>
                  </div>
                  <p className="font-semibold text-sm">Implement Debounce Function</p>
                </div>
                <Button size="sm" className="ml-2 bg-primary hover:bg-primary/90 text-xs" asChild>
                  <Link href="/problems/implement-debounce">Solve</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 bg-card/60 backdrop-blur border-border/60 hover:border-primary/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Bank</span>
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Available challenges</p>
            </Card>

            <Card className="p-4 bg-card/60 backdrop-blur border-border/60 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Solved</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{stats.solved}</div>
              <div className="w-full bg-muted/60 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${solvedPercentage}%` }} />
              </div>
            </Card>

            <Card className="p-4 bg-card/60 backdrop-blur border-border/60 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Easy</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">10 XP</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">{stats.easy}</div>
              <p className="text-xs text-muted-foreground mt-1">Foundational DSA</p>
            </Card>

            <Card className="p-4 bg-card/60 backdrop-blur border-border/60 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Medium</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">20-25 XP</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">{stats.medium}</div>
              <p className="text-xs text-muted-foreground mt-1">Interview Core</p>
            </Card>

            <Card className="p-4 bg-card/60 backdrop-blur border-border/60 hover:border-rose-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-rose-400 font-medium uppercase tracking-wider">Hard</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400">40 XP</span>
              </div>
              <div className="text-2xl font-bold text-rose-400">{stats.hard}</div>
              <p className="text-xs text-muted-foreground mt-1">Complex Optimization</p>
            </Card>

            <Card className="p-4 bg-card/60 backdrop-blur border-border/60 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">Expert</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">50 XP</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{stats.expert}</div>
              <p className="text-xs text-muted-foreground mt-1">Competitive Elite</p>
            </Card>
          </div>

          {/* Main 2-Column Layout */}
          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* Left Main Column: Filters & Problem List */}
            <div className="space-y-6">
              {/* Filter Control Bar */}
              <Card className="p-4 bg-card/70 border-border/70 backdrop-blur">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search by title, algorithm tags (e.g. Hash Table, Tree, Closures)..."
                        className="pl-10 h-10 bg-background/50 border-border/80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="w-[140px] h-10 bg-background/50">
                          <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                          <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Difficulties</SelectItem>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                          <SelectItem value="EXPERT">Expert</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                        <SelectTrigger className="w-[130px] h-10 bg-background/50">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="solved">Solved</SelectItem>
                          <SelectItem value="unsolved">Unsolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs">
                    <span className="text-muted-foreground font-medium shrink-0">Category:</span>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-full border transition-all shrink-0 capitalize ${
                          category === cat
                            ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-sm'
                            : 'bg-background/60 hover:bg-accent border-border/60 text-muted-foreground'
                        }`}
                      >
                        {cat === 'all' ? 'All Domains' : cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Problems List */}
              <div className="space-y-3">
                {filteredProblems.length === 0 ? (
                  <Card className="p-12 text-center bg-card/50 border-dashed border-border/80">
                    <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                    <h3 className="font-semibold text-lg">No matching challenges found</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                      Try adjusting your keywords or clearing the category and difficulty filters.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setSearch('');
                        setCategory('all');
                        setDifficulty('all');
                        setStatusFilter('all');
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </Card>
                ) : (
                  filteredProblems.map((problem) => (
                    <Link key={problem.id} href={`/problems/${problem.slug}`} className="block group">
                      <Card className="p-5 bg-card/60 backdrop-blur hover:bg-accent/40 border-border/60 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Left: Info */}
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            <div className="mt-1 flex-shrink-0">
                              {problem.isSolved ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                              )}
                            </div>

                            <div className="space-y-2 flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                  {problem.title}
                                </h3>
                                {getDifficultyBadge(problem.difficulty)}
                                <Badge variant="outline" className="text-xs text-muted-foreground border-border/80">
                                  {problem.category}
                                </Badge>
                                {problem.type && problem.type !== 'CODING' && (
                                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                                    {problem.type.replace('_', ' ')}
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-1 max-w-3xl">
                                {problem.description}
                              </p>

                              {/* Tags & Meta */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {problem.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[11px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/40"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right: Stats & Action */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                            <div className="text-left sm:text-right">
                              <div className="text-base font-bold text-primary flex items-center gap-1">
                                <Zap className="h-4 w-4" />
                                +{problem.xpReward} XP
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <div className="w-12 bg-muted h-1 rounded-full overflow-hidden hidden sm:inline-block">
                                  <div
                                    className="bg-primary/70 h-full rounded-full"
                                    style={{ width: `${problem.acceptanceRate}%` }}
                                  />
                                </div>
                                <span>{problem.acceptanceRate}% passed</span>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant={problem.isSolved ? 'outline' : 'default'}
                              className="text-xs h-8 px-3 shrink-0"
                            >
                              {problem.isSolved ? 'Review' : 'Solve'}
                              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Right Sidebar: Contextual Analytics & Community Events */}
            <div className="space-y-6">
              {/* Daily Challenge Card */}
              <Card className="overflow-hidden border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-background to-background">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 animate-pulse" />
                      Day 45 Streak
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Resets in 14h
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold mt-2">
                    Implement Debounce Function
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Build a resilient rate limiter in TypeScript with closure timer states. Essential for frontend performance.
                  </p>
                  <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-background/60 border border-border/50">
                    <span className="text-muted-foreground">Bonus Reward</span>
                    <span className="font-bold text-orange-400">+25 XP &amp; Streak Freeze</span>
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-500 text-white" asChild>
                    <Link href="/problems/implement-debounce">
                      Start Challenge
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Your Progress Overview */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Your Practice Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Solved Challenges</span>
                    <span className="font-bold text-sm">
                      {stats.solved} / {stats.total} ({solvedPercentage}%)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-400 font-medium">Easy ({stats.easy}/{stats.easy})</span>
                        <span className="text-muted-foreground">100%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-amber-400 font-medium">Medium (2/{stats.medium})</span>
                        <span className="text-muted-foreground">50%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-1/2" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-rose-400 font-medium">Hard (0/{stats.hard})</span>
                        <span className="text-muted-foreground">0%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full w-0" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                    <span>Rank Tier</span>
                    <span className="font-semibold text-primary">{currentUser.developerLevel} (Rank #1)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Community Contest Banner */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-xs uppercase font-bold text-primary tracking-wider">Weekly Arena</span>
                  </div>
                  <CardTitle className="text-base">Bi-Weekly Speed Contest #42</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    4 algorithmic challenges in 90 minutes. Win XP boosts, badges, and leaderboard glory.
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-background/50 p-2.5 rounded-lg border border-border/40">
                    <span>Saturday • 8:00 PM UTC</span>
                    <Badge variant="outline" className="text-primary text-[10px]">1.2k Registered</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Register Free
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
