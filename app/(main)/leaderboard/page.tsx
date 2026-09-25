'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Award, TrendingUp, Medal } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockLeaderboard, currentUser } from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('global');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-700" />;
    return null;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700';
    return 'bg-muted';
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Top developers in the community
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="global">
              <TrendingUp className="h-4 w-4 mr-2" />
              Global
            </TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-4">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {mockLeaderboard.slice(0, 3).map((entry, index) => {
                const positions = [1, 0, 2]; // Second place in middle
                const actualIndex = positions[index];
                const actualEntry = mockLeaderboard[actualIndex];
                
                return (
                  <Card
                    key={actualEntry.user.id}
                    className={cn(
                      'p-6 text-center',
                      actualEntry.rank === 1 ? 'border-yellow-500/50 bg-yellow-500/5' :
                      actualEntry.rank === 2 ? 'border-gray-400/50 bg-gray-400/5' :
                      'border-amber-600/50 bg-amber-600/5'
                    )}
                  >
                    <div className="relative inline-block mb-4">
                      <Avatar className="h-20 w-20 border-4 border-background">
                        <AvatarImage src={actualEntry.user.avatar} alt={actualEntry.user.name} />
                        <AvatarFallback className="text-xl">
                          {getInitials(actualEntry.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        'absolute -top-2 -right-2 h-10 w-10 rounded-full flex items-center justify-center border-4 border-background',
                        getRankBadgeColor(actualEntry.rank)
                      )}>
                        {getRankIcon(actualEntry.rank)}
                      </div>
                    </div>
                    <Link href={`/profile/${actualEntry.user.username}`}>
                      <h3 className="font-bold text-lg hover:underline">{actualEntry.user.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3">@{actualEntry.user.username}</p>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-primary">{formatXP(actualEntry.xp)}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Rest of Leaderboard */}
            <div className="space-y-2">
              {mockLeaderboard.slice(3).map((entry) => (
                <Card
                  key={entry.user.id}
                  className={cn(
                    'p-4 transition-all hover:shadow-md',
                    entry.user.id === currentUser.id && 'border-primary bg-primary/5'
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-12 text-center">
                      <span className="text-2xl font-bold text-muted-foreground">#{entry.rank}</span>
                    </div>

                    {/* Avatar & User Info */}
                    <Link
                      href={`/profile/${entry.user.username}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                        <AvatarFallback>{getInitials(entry.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold hover:underline truncate">{entry.user.name}</h3>
                          {entry.user.id === currentUser.id && (
                            <Badge variant="default" className="text-xs">You</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          @{entry.user.username}
                        </p>
                      </div>
                    </Link>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center min-w-[80px]">
                        <p className="font-bold text-primary text-lg">{formatXP(entry.xp)}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="font-bold text-lg">{entry.problemsSolved}</p>
                        <p className="text-xs text-muted-foreground">Problems</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="font-bold text-lg">{entry.streak}</p>
                        <p className="text-xs text-muted-foreground">Streak</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="font-bold text-lg">{entry.acceptanceRate}%</p>
                        <p className="text-xs text-muted-foreground">Accepted</p>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="md:hidden text-right">
                      <p className="font-bold text-primary">{formatXP(entry.xp)}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.problemsSolved} problems
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
