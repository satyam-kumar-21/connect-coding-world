'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Medal,
  TrendingUp,
  Flame,
  Code,
  Shield,
  Award,
  Crown,
  Sparkles,
  ArrowUpRight,
  UserPlus,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockLeaderboard, currentUser } from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'monthly'>('global');

  // Sort leaderboard according to selected timeframe
  const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => {
    if (activeTab === 'weekly') return (b.weeklyXp || 0) - (a.weeklyXp || 0);
    if (activeTab === 'monthly') return (b.monthlyXp || 0) - (a.monthlyXp || 0);
    return b.xp - a.xp;
  }).map((entry, idx) => ({ ...entry, currentRank: idx + 1 }));

  const topThree = [
    sortedLeaderboard[1], // Rank 2 on Left
    sortedLeaderboard[0], // Rank 1 in Middle (Champion)
    sortedLeaderboard[2], // Rank 3 on Right
  ];

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-amber-500/10 via-primary/10 to-background p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-400">
                  <Crown className="h-3.5 w-3.5" />
                  <span>Season 4 Competitive Standings</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Global Developer Leaderboard
                </h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                  Compete with top engineers worldwide. Earn XP by solving coding problems, contributing to open discussions, and pair programming live.
                </p>
              </div>

              {/* Time remaining in season */}
              <div className="flex items-center gap-4 bg-background/80 backdrop-blur border border-border/70 p-4 rounded-xl shadow-lg shrink-0">
                <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs uppercase font-semibold text-muted-foreground">Season 4 Ending In</div>
                  <div className="text-lg font-bold text-foreground">12 Days, 8 Hours</div>
                  <div className="text-xs text-primary font-medium">Top 10 receive Grandmaster Badge</div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Main Layout */}
          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* Left Content Area */}
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-card/60 border border-border/70 rounded-xl backdrop-blur">
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => setActiveTab(val as any)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-3 w-full sm:w-[360px] bg-background/60">
                    <TabsTrigger value="global" className="gap-1.5 text-xs font-semibold">
                      <TrendingUp className="h-3.5 w-3.5" />
                      All-Time Global
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="gap-1.5 text-xs font-semibold">
                      <Flame className="h-3.5 w-3.5 text-orange-400" />
                      This Week
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="gap-1.5 text-xs font-semibold">
                      <Award className="h-3.5 w-3.5 text-blue-400" />
                      This Month
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="text-xs text-muted-foreground px-3">
                  Updated every 5 minutes from Redis leaderboard sets
                </div>
              </div>

              {/* Top 3 Podium Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {/* 2nd Place */}
                {topThree[0] && (
                  <Card className="p-6 text-center bg-card/70 border-gray-400/30 backdrop-blur relative overflow-hidden flex flex-col justify-between hover:border-gray-400/60 transition-all hover:shadow-lg order-2 md:order-1 mt-0 md:mt-6">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
                    <div>
                      <div className="relative inline-block mb-4">
                        <Avatar className="h-20 w-20 border-4 border-gray-400/40 shadow-md">
                          <AvatarImage src={topThree[0].user.avatar} alt={topThree[0].user.name} />
                          <AvatarFallback>{getInitials(topThree[0].user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-slate-300 text-slate-900 font-extrabold flex items-center justify-center text-sm shadow border-2 border-background">
                          #2
                        </div>
                      </div>
                      <Link href={`/profile/${topThree[0].user.username}`}>
                        <h3 className="font-bold text-lg hover:text-primary transition-colors">
                          {topThree[0].user.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-3">@{topThree[0].user.username}</p>
                      <Badge variant="outline" className="mb-4 text-xs border-gray-400/40 text-gray-300">
                        {topThree[0].levelTitle || 'Lead'} • Lvl {topThree[0].level || 8}
                      </Badge>
                    </div>

                    <div className="pt-4 border-t border-border/50 space-y-2">
                      <div className="text-2xl font-black text-foreground">
                        {formatXP(
                          activeTab === 'weekly'
                            ? topThree[0].weeklyXp || topThree[0].xp
                            : activeTab === 'monthly'
                            ? topThree[0].monthlyXp || topThree[0].xp
                            : topThree[0].xp
                        )} <span className="text-xs text-primary font-bold">XP</span>
                      </div>
                      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                        <span>{topThree[0].problemsSolved} solved</span>
                        <span>•</span>
                        <span className="text-orange-400 font-medium flex items-center gap-0.5">
                          <Flame className="h-3 w-3" /> {topThree[0].streak}d
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 1st Place - Champion */}
                {topThree[1] && (
                  <Card className="p-6 text-center bg-gradient-to-b from-amber-500/15 via-card to-card border-amber-500/50 backdrop-blur relative overflow-hidden flex flex-col justify-between hover:border-amber-500/80 transition-all shadow-xl shadow-amber-500/5 order-1 md:order-2">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300 mb-3">
                        <Crown className="h-3.5 w-3.5 text-amber-400" />
                        <span>REIGNING CHAMPION</span>
                      </div>

                      <div className="relative inline-block mb-4">
                        <Avatar className="h-24 w-24 border-4 border-amber-400 shadow-xl">
                          <AvatarImage src={topThree[1].user.avatar} alt={topThree[1].user.name} />
                          <AvatarFallback>{getInitials(topThree[1].user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-3 -right-2 h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-base shadow-lg border-2 border-background">
                          👑
                        </div>
                      </div>

                      <Link href={`/profile/${topThree[1].user.username}`}>
                        <h3 className="font-extrabold text-xl hover:text-primary transition-colors">
                          {topThree[1].user.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-3">@{topThree[1].user.username}</p>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs font-semibold mb-4">
                        {topThree[1].levelTitle || 'Architect'} • Level {topThree[1].level || 9}
                      </Badge>
                    </div>

                    <div className="pt-4 border-t border-border/50 space-y-2">
                      <div className="text-3xl font-black text-amber-400">
                        {formatXP(
                          activeTab === 'weekly'
                            ? topThree[1].weeklyXp || topThree[1].xp
                            : activeTab === 'monthly'
                            ? topThree[1].monthlyXp || topThree[1].xp
                            : topThree[1].xp
                        )} <span className="text-sm text-foreground font-bold">XP</span>
                      </div>
                      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                        <span>{topThree[1].problemsSolved} solved</span>
                        <span>•</span>
                        <span className="text-orange-400 font-semibold flex items-center gap-0.5">
                          <Flame className="h-3.5 w-3.5" /> {topThree[1].streak}d streak
                        </span>
                        <span>•</span>
                        <span>{topThree[1].acceptanceRate}% acc</span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <Card className="p-6 text-center bg-card/70 border-amber-700/30 backdrop-blur relative overflow-hidden flex flex-col justify-between hover:border-amber-700/60 transition-all hover:shadow-lg order-3 md:order-3 mt-0 md:mt-8">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
                    <div>
                      <div className="relative inline-block mb-4">
                        <Avatar className="h-20 w-20 border-4 border-amber-700/40 shadow-md">
                          <AvatarImage src={topThree[2].user.avatar} alt={topThree[2].user.name} />
                          <AvatarFallback>{getInitials(topThree[2].user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-amber-700 text-amber-100 font-extrabold flex items-center justify-center text-sm shadow border-2 border-background">
                          #3
                        </div>
                      </div>
                      <Link href={`/profile/${topThree[2].user.username}`}>
                        <h3 className="font-bold text-lg hover:text-primary transition-colors">
                          {topThree[2].user.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-3">@{topThree[2].user.username}</p>
                      <Badge variant="outline" className="mb-4 text-xs border-amber-700/40 text-amber-500">
                        {topThree[2].levelTitle || 'Senior'} • Lvl {topThree[2].level || 7}
                      </Badge>
                    </div>

                    <div className="pt-4 border-t border-border/50 space-y-2">
                      <div className="text-2xl font-black text-foreground">
                        {formatXP(
                          activeTab === 'weekly'
                            ? topThree[2].weeklyXp || topThree[2].xp
                            : activeTab === 'monthly'
                            ? topThree[2].monthlyXp || topThree[2].xp
                            : topThree[2].xp
                        )} <span className="text-xs text-primary font-bold">XP</span>
                      </div>
                      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                        <span>{topThree[2].problemsSolved} solved</span>
                        <span>•</span>
                        <span className="text-orange-400 font-medium flex items-center gap-0.5">
                          <Flame className="h-3 w-3" /> {topThree[2].streak}d
                        </span>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Ranks 4+ Table / Cards */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Global Rank Index
                </h3>

                {sortedLeaderboard.map((entry) => (
                  <Card
                    key={entry.user.id}
                    className={cn(
                      'p-4 bg-card/60 backdrop-blur hover:bg-accent/40 border-border/60 transition-all flex items-center justify-between gap-4',
                      entry.user.id === currentUser.id && 'border-primary/60 bg-primary/5 shadow-sm'
                    )}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Rank Number */}
                      <div className="w-10 text-center font-black text-lg text-muted-foreground/80 shrink-0">
                        #{entry.currentRank}
                      </div>

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <Avatar className="h-11 w-11 border border-border">
                          <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                          <AvatarFallback>{getInitials(entry.user.name)}</AvatarFallback>
                        </Avatar>
                        {entry.user.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/profile/${entry.user.username}`}
                            className="font-bold text-sm md:text-base hover:text-primary transition-colors truncate"
                          >
                            {entry.user.name}
                          </Link>
                          {entry.user.id === currentUser.id && (
                            <Badge className="bg-primary text-[10px] h-4 px-1.5 font-bold">You</Badge>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50 text-[11px]">
                            {entry.levelTitle || 'Senior'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          @{entry.user.username} • {entry.user.skills?.slice(0, 3).join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Stats Metrics */}
                    <div className="flex items-center gap-6 text-sm shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold flex items-center justify-end gap-1">
                          <Code className="h-3.5 w-3.5 text-muted-foreground" />
                          {entry.problemsSolved}
                        </div>
                        <div className="text-[11px] text-muted-foreground">Solved</div>
                      </div>

                      <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-orange-400 flex items-center justify-end gap-1">
                          <Flame className="h-3.5 w-3.5" />
                          {entry.streak}d
                        </div>
                        <div className="text-[11px] text-muted-foreground">Streak</div>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <div className="text-base font-extrabold text-primary">
                          {formatXP(
                            activeTab === 'weekly'
                              ? entry.weeklyXp || entry.xp
                              : activeTab === 'monthly'
                              ? entry.monthlyXp || entry.xp
                              : entry.xp
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">Total XP</div>
                      </div>

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden sm:flex" asChild>
                        <Link href={`/profile/${entry.user.username}`}>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Your Personal Rank Card */}
              <Card className="bg-card/70 border-primary/30 backdrop-blur relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-primary tracking-wider">Your Position</span>
                    <Badge className="bg-primary/20 text-primary border-primary/40 text-xs">Top 0.1%</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 mt-1">
                    <Crown className="h-5 w-5 text-amber-400" />
                    Rank #1 • Architect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-background/60 border border-border/50 text-center">
                    <div>
                      <div className="text-2xl font-black text-primary">{formatXP(currentUser.xp)}</div>
                      <div className="text-xs text-muted-foreground">Total XP</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                        <Flame className="h-4 w-4" /> {currentUser.streak}
                      </div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tier Tier 9: Architect</span>
                      <span className="font-semibold text-foreground">15,420 / 20,000 XP</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full w-[77%]" />
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center pt-1">
                      4,580 XP until Grandmaster Architect Tier 10
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Hall of Fame Badges */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Hall of Fame Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Grandmaster #1', desc: 'Held rank #1 for 30 consecutive days', icon: '👑', color: 'border-amber-500/30' },
                    { title: '45-Day Fire Streak', desc: 'Zero missed days of coding practice', icon: '🔥', color: 'border-orange-500/30' },
                    { title: 'System Polyglot', desc: 'Mastery in Go, TypeScript and Rust', icon: '⚡', color: 'border-blue-500/30' },
                    { title: 'Peer Mentor Pro', desc: 'Guided 50+ engineers in code rooms', icon: '🤝', color: 'border-emerald-500/30' },
                  ].map((badge) => (
                    <div
                      key={badge.title}
                      className={cn(
                        'flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border transition-all hover:bg-accent/40',
                        badge.color
                      )}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground">{badge.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* XP Multipliers Guide */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    How to Earn XP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-background/50">
                    <span className="text-muted-foreground">Solve Easy Challenge</span>
                    <span className="font-bold text-emerald-400">+10 XP</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-background/50">
                    <span className="text-muted-foreground">Solve Medium Challenge</span>
                    <span className="font-bold text-amber-400">+25 XP</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-background/50">
                    <span className="text-muted-foreground">Solve Hard / Expert</span>
                    <span className="font-bold text-rose-400">+40-50 XP</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-background/50">
                    <span className="text-muted-foreground">Host / Join Live Peer Room</span>
                    <span className="font-bold text-primary">+35 XP / hr</span>
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
