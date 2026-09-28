'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Trophy,
  Zap,
  Code,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileCode,
  Radio,
  Share2,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  mockSubmissions,
  mockAchievements,
  mockActivityFeed,
  currentUser,
} from '@/lib/mock-data';
import { formatXP, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState('submissions');
  const [selectedSubmissionCode, setSelectedSubmissionCode] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" /> Accepted
          </Badge>
        );
      case 'TIME_LIMIT_EXCEEDED':
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs flex items-center gap-1 font-semibold">
            <Clock className="h-3 w-3" /> Time Limit
          </Badge>
        );
      case 'WRONG_ANSWER':
        return (
          <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-xs flex items-center gap-1 font-semibold">
            <XCircle className="h-3 w-3" /> Wrong Answer
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/15 via-blue-500/10 to-background p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-semibold text-primary">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Developer Performance &amp; History</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  My Activity &amp; Records
                </h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                  Comprehensive audit trail of your code submissions, algorithm runtimes, unlocked achievements, live collaboration hours, and XP transactions.
                </p>
              </div>

              {/* High-level status */}
              <div className="flex items-center gap-4 bg-background/80 backdrop-blur border border-border/70 p-4 rounded-xl shadow-lg shrink-0">
                <div className="h-12 w-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">
                    45-Day Consecutive Streak
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Active streak multiplier: <span className="text-orange-400 font-semibold">1.5x XP</span>
                  </div>
                  <div className="text-xs text-primary font-medium mt-0.5">
                    Total: {formatXP(currentUser.xp)} XP earned
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-5 bg-card/60 border-border/70 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Submissions</span>
                <Code className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{currentUser.problemsSolved}</div>
              <p className="text-xs text-muted-foreground mt-1">Across 4 programming languages</p>
            </Card>

            <Card className="p-5 bg-card/60 border-border/70 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Acceptance Rate</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{currentUser.acceptanceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Top 5% community consistency</p>
            </Card>

            <Card className="p-5 bg-card/60 border-border/70 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Live Pair Time</span>
                <Radio className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400">38.5 Hours</div>
              <p className="text-xs text-muted-foreground mt-1">24 collaborative rooms hosted</p>
            </Card>

            <Card className="p-5 bg-card/60 border-border/70 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Global Standing</span>
                <Trophy className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400">Rank #1</div>
              <p className="text-xs text-muted-foreground mt-1">Tier 9: Architect Level</p>
            </Card>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* Left Content Area */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="p-2 bg-card/60 border border-border/70 rounded-xl backdrop-blur">
                  <TabsList className="bg-background/60 w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
                    <TabsTrigger value="submissions" className="gap-2 text-xs font-semibold">
                      <Code className="h-3.5 w-3.5 text-primary" />
                      Recent Submissions ({mockSubmissions.length})
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="gap-2 text-xs font-semibold">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" />
                      Achievements &amp; Badges ({mockAchievements.length})
                    </TabsTrigger>
                    <TabsTrigger value="feed" className="gap-2 text-xs font-semibold">
                      <Activity className="h-3.5 w-3.5 text-emerald-400" />
                      Timeline Log
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab: Recent Submissions */}
                <TabsContent value="submissions" className="space-y-4 mt-0">
                  <div className="space-y-3">
                    {mockSubmissions.map((sub) => (
                      <Card
                        key={sub.id}
                        className="p-5 bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <FileCode className="h-5 w-5 text-primary shrink-0" />
                            <div>
                              <Link
                                href={`/problems/${sub.problem?.slug || 'two-sum'}`}
                                className="font-bold text-base hover:text-primary transition-colors"
                              >
                                {sub.problemTitle || sub.problem?.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-[10px] h-4">
                                  {sub.language}
                                </Badge>
                                <span>•</span>
                                <span>{formatDate(sub.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {getStatusBadge(sub.status)}
                            <span className="text-xs font-bold text-primary">+{sub.xpEarned || 10} XP</span>
                          </div>
                        </div>

                        {/* Runtime & Memory Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40 text-xs">
                          <div className="p-2 rounded bg-background/50">
                            <span className="text-muted-foreground block text-[11px]">Runtime</span>
                            <span className="font-mono font-semibold">{sub.runtime} ms</span>
                          </div>
                          <div className="p-2 rounded bg-background/50">
                            <span className="text-muted-foreground block text-[11px]">Memory</span>
                            <span className="font-mono font-semibold">{sub.memory} MB</span>
                          </div>
                          <div className="p-2 rounded bg-background/50">
                            <span className="text-muted-foreground block text-[11px]">Test Cases</span>
                            <span className="font-mono font-semibold">
                              {sub.testCasesPassed} / {sub.totalTestCases} Passed
                            </span>
                          </div>
                          <div className="p-2 rounded bg-background/50">
                            <span className="text-muted-foreground block text-[11px]">Score</span>
                            <span className="font-mono font-semibold text-emerald-400">{sub.score} / 100</span>
                          </div>
                        </div>

                        {/* Code snippet if present */}
                        {sub.code && (
                          <div className="pt-2">
                            <div className="text-[11px] font-mono text-muted-foreground mb-1 flex items-center justify-between">
                              <span>Submitted Source:</span>
                              <button
                                onClick={() =>
                                  setSelectedSubmissionCode(
                                    selectedSubmissionCode === sub.id ? null : sub.id
                                  )
                                }
                                className="text-primary hover:underline"
                              >
                                {selectedSubmissionCode === sub.id ? 'Hide Code' : 'View Code'}
                              </button>
                            </div>
                            {selectedSubmissionCode === sub.id && (
                              <pre className="p-3 rounded-lg bg-black/50 border border-border/50 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                                {sub.code}
                              </pre>
                            )}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab: Achievements & Badges */}
                <TabsContent value="achievements" className="space-y-4 mt-0">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {mockAchievements.map((ach) => (
                      <Card
                        key={ach.id}
                        className={cn(
                          'p-5 bg-card/60 border-border/70 backdrop-blur transition-all flex flex-col justify-between',
                          ach.isUnlocked
                            ? 'hover:border-amber-500/50 hover:shadow-md'
                            : 'opacity-70 border-dashed'
                        )}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <span className="text-3xl p-2 rounded-xl bg-background/60 border border-border/50">
                              {ach.icon}
                            </span>
                            <Badge
                              className={cn(
                                'text-xs',
                                ach.isUnlocked
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {ach.isUnlocked ? 'Unlocked' : 'In Progress'}
                            </Badge>
                          </div>

                          <div>
                            <h3 className="font-bold text-base text-foreground">{ach.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{ach.description}</p>
                          </div>

                          {/* Progress bar if not unlocked */}
                          {!ach.isUnlocked && ach.progress && ach.maxProgress && (
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-[11px] text-muted-foreground">
                                <span>Progress</span>
                                <span className="font-semibold text-foreground">
                                  {ach.progress} / {ach.maxProgress}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{
                                    width: `${(ach.progress / ach.maxProgress) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-border/50 mt-4 flex items-center justify-between text-xs">
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Zap className="h-3.5 w-3.5" /> +{ach.xpReward} XP Reward
                          </span>
                          {ach.earnedAt && (
                            <span className="text-[11px] text-muted-foreground">
                              Earned {ach.earnedAt}
                            </span>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab: Timeline Feed */}
                <TabsContent value="feed" className="space-y-4 mt-0">
                  <div className="space-y-3">
                    {mockActivityFeed.map((item) => (
                      <Card
                        key={item.id}
                        className="p-5 bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 transition-all flex items-start gap-4"
                      >
                        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                          {item.type === 'SUBMISSION' ? (
                            <Code className="h-5 w-5" />
                          ) : item.type === 'COLLABORATION' ? (
                            <Radio className="h-5 w-5" />
                          ) : item.type === 'ACHIEVEMENT' ? (
                            <Trophy className="h-5 w-5" />
                          ) : (
                            <Flame className="h-5 w-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                            <span className="text-xs text-muted-foreground shrink-0">{item.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                          {item.xpEarned && (
                            <div className="pt-1">
                              <span className="text-xs font-bold text-primary">+{item.xpEarned} XP</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar: Breakdown & Heatmap Summary */}
            <div className="space-y-6">
              {/* Consistency Calendar Card */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Weekly Consistency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <div key={day} className="space-y-1.5">
                        <span className="text-[11px] text-muted-foreground">{day}</span>
                        <div
                          className={cn(
                            'h-8 w-8 rounded-lg flex items-center justify-center mx-auto text-xs font-bold transition-all',
                            idx < 6
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                              : 'bg-primary/20 text-primary border border-primary/40'
                          )}
                        >
                          ✓
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-background/60 border border-border/50 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consistency Score:</span>
                      <span className="font-bold text-emerald-400">98% Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Streak:</span>
                      <span className="font-bold text-orange-400">45 Days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Language Proficiency Breakdown */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    Language Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-foreground">TypeScript / React</span>
                      <span className="text-muted-foreground">45%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[45%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-foreground">Go (Golang)</span>
                      <span className="text-muted-foreground">30%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full w-[30%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-foreground">Python</span>
                      <span className="text-muted-foreground">15%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[15%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-foreground">Rust</span>
                      <span className="text-muted-foreground">10%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full w-[10%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
