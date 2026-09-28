'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Trophy,
  Flame,
  Radio,
  UserPlus,
  Heart,
  MessageSquare,
  Sparkles,
  Check,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Settings,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockNotifications } from '@/lib/mock-data';
import { Notification } from '@/types';
import { formatDate, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read.');
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info('Notification dismissed.');
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'connections') return n.type.includes('CONNECTION');
    if (activeTab === 'achievements') return n.type.includes('ACHIEVEMENT') || n.type.includes('BADGE');
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return (
          <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <UserPlus className="h-5 w-5" />
          </div>
        );
      case 'ACHIEVEMENT_UNLOCKED':
      case 'BADGE_EARNED':
        return (
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="h-5 w-5" />
          </div>
        );
      case 'POST_REACTION':
        return (
          <div className="h-10 w-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Heart className="h-5 w-5" />
          </div>
        );
      case 'POST_COMMENT':
      case 'COMMENT':
        return (
          <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
        );
      case 'COLLABORATION_REQUEST':
      case 'COLLABORATION_ACCEPTED':
        return (
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="h-5 w-5" />
          </div>
        );
      case 'CODING_CHALLENGE':
        return (
          <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Flame className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Bell className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/15 via-purple-500/10 to-background p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-semibold text-primary">
                  <Bell className="h-3.5 w-3.5" />
                  <span>Activity &amp; Updates Feed</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Notification Center
                </h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                  Stay updated with peer collaboration invites, streak bonuses, code review comments, and rank advancements.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background/80 text-xs h-9 border-border/80"
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Mark all as read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-9"
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Preferences
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* Left Notifications List */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-card/60 border border-border/70 rounded-xl backdrop-blur">
                  <TabsList className="bg-background/60">
                    <TabsTrigger value="all" className="gap-2 text-xs font-semibold">
                      All Notifications ({notifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="gap-2 text-xs font-semibold">
                      Unread
                      {unreadCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="connections" className="gap-2 text-xs font-semibold">
                      Connections
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="gap-2 text-xs font-semibold">
                      Achievements
                    </TabsTrigger>
                  </TabsList>

                  <span className="text-xs text-muted-foreground px-3">
                    Showing {filteredNotifications.length} items
                  </span>
                </div>

                <TabsContent value={activeTab} className="space-y-3 mt-0">
                  {filteredNotifications.length === 0 ? (
                    <Card className="p-12 text-center bg-card/50 border-dashed border-border/80">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <h3 className="font-semibold text-lg">You are all caught up!</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                        No notifications in this filter category at this moment.
                      </p>
                    </Card>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <Card
                        key={notif.id}
                        className={cn(
                          'p-5 transition-all bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 duration-200 flex items-start gap-4',
                          !notif.isRead && 'bg-primary/5 border-l-4 border-l-primary'
                        )}
                      >
                        {getNotificationIcon(notif.type)}

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm md:text-base text-foreground">
                              {notif.title}
                            </h4>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatDate(notif.createdAt)}
                            </span>
                          </div>

                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            {notif.message}
                          </p>

                          {/* Quick actionable link if present */}
                          <div className="flex items-center gap-3 pt-2">
                            {notif.link && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 px-2.5 bg-background/60"
                                asChild
                              >
                                <Link href={notif.link}>
                                  View Details
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Link>
                              </Button>
                            )}

                            <button
                              onClick={() => handleToggleRead(notif.id)}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {notif.isRead ? 'Mark as unread' : 'Mark as read'}
                            </button>

                            <button
                              onClick={() => handleDelete(notif.id)}
                              className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Feed Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Unread Alerts</span>
                      <span className="font-bold text-primary">{unreadCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Total Logged</span>
                      <span className="font-bold text-foreground">{notifications.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Retention Policy</span>
                      <span className="text-muted-foreground">Last 30 Days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Categories Summary */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Alert Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                    <span className="flex items-center gap-2">
                      <UserPlus className="h-3.5 w-3.5 text-blue-400" /> Connection Requests
                    </span>
                    <Badge variant="outline" className="text-[10px]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                    <span className="flex items-center gap-2">
                      <Radio className="h-3.5 w-3.5 text-emerald-400" /> Collaboration Invites
                    </span>
                    <Badge variant="outline" className="text-[10px]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                    <span className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" /> Rank &amp; XP Updates
                    </span>
                    <Badge variant="outline" className="text-[10px]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background/50">
                    <span className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-orange-400" /> Daily Streak Reminders
                    </span>
                    <Badge variant="outline" className="text-[10px]">Active</Badge>
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
