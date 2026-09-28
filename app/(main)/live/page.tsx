'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Radio,
  Send,
  MapPin,
  Code,
  Users,
  Video,
  Sparkles,
  Zap,
  Globe,
  Share2,
  Lock,
  PlusCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  mockUsers,
  currentUser,
  mockCollaborationSessions,
} from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';
import { toast } from 'sonner';

export default function LivePage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [myActivity, setMyActivity] = useState('Building real-time collaborative code editor engine');
  const [myLanguage, setMyLanguage] = useState('TypeScript');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('all');

  const liveDevelopers = mockUsers.filter(
    (u) => u.isOnline && u.isLive && u.id !== currentUser.id
  );

  const filteredDevelopers = liveDevelopers.filter((dev) => {
    if (selectedLanguageFilter === 'all') return true;
    return dev.codingLanguage?.toLowerCase() === selectedLanguageFilter.toLowerCase();
  });

  const languages = ['all', 'TypeScript', 'Go', 'JavaScript', 'Rust', 'Python', 'Dart'];

  const handleSendRequest = () => {
    if (!selectedUser) return;
    toast.success(`Collaboration invite sent to ${selectedUser.name}!`, {
      description: 'They will receive a notification to join your live code session.',
    });
    setSelectedUser(null);
    setRequestMessage('');
  };

  const handleToggleLive = () => {
    setIsLiveActive(!isLiveActive);
    if (!isLiveActive) {
      toast.success('You are now LIVE! Other developers can see your activity.');
    } else {
      toast.info('You are no longer broadcasting live status.');
    }
  };

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/15 via-green-500/10 to-background p-6 md:p-8">
            <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Developer Network</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Developers Live Now
                </h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                  Connect with engineers coding right now. Pair program, review architecture PRs, work through hard algorithms, or debug microservices together in collaborative rooms.
                </p>
              </div>

              {/* Status summary */}
              <div className="flex items-center gap-4 bg-background/80 backdrop-blur border border-border/70 p-4 rounded-xl shadow-lg shrink-0">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Radio className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-semibold text-muted-foreground">Broadcasting Live</span>
                    <Badge variant="success" className="text-[10px] px-1.5 h-4">
                      {liveDevelopers.length + 1} online
                    </Badge>
                  </div>
                  <div className="text-base font-bold text-foreground">3 Active Rooms</div>
                  <div className="text-xs text-emerald-400 font-medium">Earn +35 XP/hr during pair sessions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* Left Column: Live Developers & Rooms */}
            <div className="space-y-6">
              <Tabs defaultValue="developers" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-card/60 border border-border/70 rounded-xl backdrop-blur">
                  <TabsList className="bg-background/60">
                    <TabsTrigger value="developers" className="gap-2 text-xs font-semibold">
                      <Radio className="h-3.5 w-3.5 text-emerald-400" />
                      Live Developers ({liveDevelopers.length})
                    </TabsTrigger>
                    <TabsTrigger value="rooms" className="gap-2 text-xs font-semibold">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      Collaborative Rooms ({mockCollaborationSessions.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Language filter pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
                    <span className="text-muted-foreground text-xs font-medium px-2">Language:</span>
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguageFilter(lang)}
                        className={`px-2.5 py-1 rounded-full border text-xs capitalize transition-colors shrink-0 ${
                          selectedLanguageFilter === lang
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                            : 'bg-background/50 border-border/60 text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Developers Tab Content */}
                <TabsContent value="developers" className="space-y-4 mt-0">
                  <div className="grid gap-5 md:grid-cols-2">
                    {filteredDevelopers.map((dev) => (
                      <Card
                        key={dev.id}
                        className="p-6 bg-card/60 border-border/70 backdrop-blur hover:border-emerald-500/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          {/* Top row: Avatar & Identity */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5">
                              <div className="relative">
                                <Avatar className="h-14 w-14 border-2 border-emerald-500/40 shadow-sm">
                                  <AvatarImage src={dev.avatar} alt={dev.name} />
                                  <AvatarFallback>{getInitials(dev.name)}</AvatarFallback>
                                </Avatar>
                                <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                                </span>
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link
                                    href={`/profile/${dev.username}`}
                                    className="font-bold text-base hover:text-primary transition-colors"
                                  >
                                    {dev.name}
                                  </Link>
                                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                                    {dev.developerLevel || 'Senior'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">@{dev.username} • {dev.company || 'Open Source'}</p>
                                {dev.location && (
                                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3 text-muted-foreground/80" /> {dev.location}
                                  </p>
                                )}
                              </div>
                            </div>

                            {dev.codingLanguage && (
                              <Badge variant="outline" className="text-xs border-primary/40 text-primary shrink-0">
                                {dev.codingLanguage}
                              </Badge>
                            )}
                          </div>

                          {/* Current Activity Box */}
                          <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              CURRENT ACTIVITY
                            </div>
                            <p className="text-xs text-foreground font-medium line-clamp-2">
                              {dev.currentActivity || 'Solving coding challenges and exploring system designs.'}
                            </p>
                            {dev.liveNote && (
                              <p className="text-[11px] text-muted-foreground italic border-t border-border/40 pt-1 mt-1">
                                &quot;{dev.liveNote}&quot;
                              </p>
                            )}
                          </div>

                          {/* Skills badges */}
                          <div className="flex flex-wrap gap-1.5">
                            {dev.skills.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="text-[11px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50"
                              >
                                {skill}
                              </span>
                            ))}
                            {dev.skills.length > 4 && (
                              <span className="text-[10px] text-muted-foreground px-1 self-center">
                                +{dev.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-4 border-t border-border/50 mt-4 flex items-center justify-between gap-3">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-bold text-foreground">{dev.problemsSolved}</span> solved •{' '}
                            <span className="font-bold text-primary">{formatXP(dev.xp)} XP</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 px-2.5"
                              asChild
                            >
                              <Link href={`/messages?user=${dev.id}`}>
                                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                Chat
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              className="text-xs h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white"
                              onClick={() => setSelectedUser(dev)}
                            >
                              <Radio className="h-3.5 w-3.5 mr-1.5" />
                              Collaborate
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Collaborative Rooms Tab Content */}
                <TabsContent value="rooms" className="space-y-4 mt-0">
                  <div className="grid gap-5">
                    {mockCollaborationSessions.map((session) => (
                      <Card
                        key={session.id}
                        className="p-6 bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="space-y-3 flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                              #{session.roomCode}
                            </span>
                            <Badge variant="success" className="text-xs flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                              Active Live Session
                            </Badge>
                            {session.codingLanguage && (
                              <Badge variant="outline" className="text-xs">
                                {session.codingLanguage}
                              </Badge>
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-foreground">{session.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 max-w-3xl">
                              {session.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1">
                            <div className="flex items-center gap-2">
                              <span>Hosted by:</span>
                              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={session.initiator.avatar} />
                                  <AvatarFallback>{getInitials(session.initiator.name)}</AvatarFallback>
                                </Avatar>
                                <span>{session.initiator.name}</span>
                              </div>
                            </div>

                            <span>•</span>

                            <div className="flex items-center gap-1.5">
                              <span>Participants:</span>
                              <div className="flex -space-x-1.5 overflow-hidden">
                                {session.participants.map((p) => (
                                  <Avatar key={p.id} className="h-5 w-5 border border-background">
                                    <AvatarImage src={p.avatar} />
                                    <AvatarFallback>{getInitials(p.name)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="font-semibold text-foreground ml-1">
                                {session.participants.length} coders
                              </span>
                            </div>

                            {session.problem && (
                              <>
                                <span>•</span>
                                <span className="text-primary font-medium">
                                  Working on: {session.problem.title}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-border/40">
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <Zap className="h-3.5 w-3.5" /> +35 XP / hr
                          </span>
                          <Button
                            className="bg-primary hover:bg-primary/90 text-xs px-4"
                            onClick={() => {
                              toast.success(`Joined Room #${session.roomCode}!`, {
                                description: 'Connecting WebSocket session for real-time pair programming...',
                              });
                            }}
                          >
                            <Video className="h-3.5 w-3.5 mr-1.5" />
                            Join Session
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar: Your Status & Quick Actions */}
            <div className="space-y-6">
              {/* Your Broadcast Status Card */}
              <Card className="bg-card/70 border-emerald-500/30 backdrop-blur">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Your Live Broadcast</span>
                    <Badge variant={isLiveActive ? 'success' : 'outline'} className="text-xs">
                      {isLiveActive ? 'Online & Available' : 'Offline'}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold mt-1">Live Developer Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-muted-foreground font-medium block mb-1">Current Activity</label>
                      <Input
                        value={myActivity}
                        onChange={(e) => setMyActivity(e.target.value)}
                        className="bg-background/60 text-xs h-9"
                        placeholder="What are you currently coding?"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground font-medium block mb-1">Primary Language</label>
                      <Input
                        value={myLanguage}
                        onChange={(e) => setMyLanguage(e.target.value)}
                        className="bg-background/60 text-xs h-9"
                        placeholder="e.g. TypeScript, Go, Rust"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button
                      variant={isLiveActive ? 'destructive' : 'default'}
                      size="sm"
                      className="w-full text-xs"
                      onClick={handleToggleLive}
                    >
                      {isLiveActive ? 'Stop Live Broadcast' : 'Go Live Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Start a New Room Card */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <PlusCircle className="h-4 w-4 text-primary" />
                    Host Collaborative Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Create an instant pairing room with live collaborative editor, WebRTC audio, and shared terminal output.
                  </p>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-xs"
                    onClick={() => {
                      toast.success('Room #PEER-819 created!', {
                        description: 'Share your link with any developer to start coding.',
                      });
                    }}
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                    Create New Room
                  </Button>
                </CardContent>
              </Card>

              {/* Pair Programming Etiquette */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Collaboration Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-primary">1.</span>
                    <span>State your session objective (e.g. debugging, DSA, or system design review).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-primary">2.</span>
                    <span>Use driver/navigator roles to maintain smooth communication flow.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-primary">3.</span>
                    <span>Both engineers earn +35 XP bonus upon 30+ minutes of active session.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Send Request Dialog */}
          <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
            <DialogContent className="sm:max-w-md bg-card border-border/80">
              <DialogHeader>
                <DialogTitle className="text-lg">Send Collaboration Request</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Invite {selectedUser?.name} to collaborate on code or review solutions together.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border border-border/50">
                  <Avatar className="h-11 w-11 border border-border">
                    <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.name} />
                    <AvatarFallback>{getInitials(selectedUser?.name || '')}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-bold text-sm">{selectedUser?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedUser?.currentRole || selectedUser?.skills?.[0]} • {selectedUser?.codingLanguage}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Message Note (optional)</label>
                  <Textarea
                    placeholder="Hey! Want to pair on the Rate Limiter problem or review microservices architecture?"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={3}
                    className="resize-none text-xs bg-background/50 border-border/60"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={handleSendRequest}>
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Send Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
}
