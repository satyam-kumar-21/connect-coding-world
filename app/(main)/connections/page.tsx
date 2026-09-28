'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  MessageSquare,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Briefcase,
  Share2,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  mockConnections,
  mockUsers,
  mockSuggestedDevelopers,
  currentUser,
} from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';
import { toast } from 'sonner';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState(
    mockConnections.filter((c) => c.status === 'ACCEPTED')
  );
  const [pendingRequests, setPendingRequests] = useState(
    mockConnections.filter((c) => c.status === 'PENDING')
  );
  const [suggestedList, setSuggestedList] = useState(mockSuggestedDevelopers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleAcceptRequest = (id: string, name: string) => {
    const req = pendingRequests.find((r) => r.id === id);
    if (req) {
      setPendingRequests(pendingRequests.filter((r) => r.id !== id));
      setConnections([...connections, { ...req, status: 'ACCEPTED' }]);
      toast.success(`Connected with ${name}!`, {
        description: 'You can now exchange direct messages and collaborate in live rooms.',
      });
    }
  };

  const handleRejectRequest = (id: string, name: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== id));
    toast.info(`Declined connection request from ${name}.`);
  };

  const handleConnectWithSuggested = (userId: string, name: string) => {
    setSuggestedList(suggestedList.filter((s) => s.user.id !== userId));
    toast.success(`Connection invitation sent to ${name}!`);
  };

  // Filter connections by search query
  const filteredConnections = connections.filter((conn) => {
    const targetUser = conn.requesterId === currentUser.id ? conn.addressee : conn.requester;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      targetUser.name.toLowerCase().includes(query) ||
      targetUser.username.toLowerCase().includes(query) ||
      targetUser.skills.some((s) => s.toLowerCase().includes(query))
    );
  });

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/15 via-blue-500/10 to-background p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-semibold text-primary">
                  <Users className="h-3.5 w-3.5" />
                  <span>Developer Network &amp; Peers</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Connections &amp; Network
                </h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                  Expand your professional developer graph. Connect with engineers, pair on projects, and follow technical updates from your peers.
                </p>
              </div>

              {/* Network quick stats */}
              <div className="flex items-center gap-4 bg-background/80 backdrop-blur border border-border/70 p-4 rounded-xl shadow-lg shrink-0">
                <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">
                    {connections.length} Active Connections
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pendingRequests.length} pending requests awaiting review
                  </div>
                  <div className="text-xs text-primary font-medium mt-0.5">
                    +142 profile views this week
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* Left Column: Connections Content */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-card/60 border border-border/70 rounded-xl backdrop-blur">
                  <TabsList className="bg-background/60">
                    <TabsTrigger value="all" className="gap-2 text-xs font-semibold">
                      <Users className="h-3.5 w-3.5" />
                      My Network ({connections.length})
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="gap-2 text-xs font-semibold relative">
                      <UserPlus className="h-3.5 w-3.5 text-orange-400" />
                      Pending Requests
                      {pendingRequests.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                          {pendingRequests.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="suggested" className="gap-2 text-xs font-semibold">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Suggested Peers ({suggestedList.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Search bar inside tab strip */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, skill..."
                      className="pl-8 h-8 text-xs bg-background/50 border-border/70"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tab: My Connections */}
                <TabsContent value="all" className="space-y-4 mt-0">
                  {filteredConnections.length === 0 ? (
                    <Card className="p-12 text-center bg-card/50 border-dashed border-border/80">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <h3 className="font-semibold text-lg">No connections found</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                        {searchQuery
                          ? 'No matching peers found for your search query.'
                          : 'You have not connected with anyone yet. Explore suggested developers!'}
                      </p>
                    </Card>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {filteredConnections.map((conn) => {
                        const targetUser =
                          conn.requesterId === currentUser.id ? conn.addressee : conn.requester;
                        return (
                          <Card
                            key={conn.id}
                            className="bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                          >
                            <div>
                              {/* Card Cover Header */}
                              <div
                                className="h-20 w-full bg-cover bg-center relative"
                                style={{
                                  backgroundImage: `url(${targetUser.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&fit=crop'})`,
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                              </div>

                              {/* Card Content & Avatar */}
                              <div className="px-5 pb-4 -mt-10 relative space-y-3">
                                <div className="flex items-end justify-between">
                                  <div className="relative">
                                    <Avatar className="h-16 w-16 border-4 border-card shadow-md">
                                      <AvatarImage src={targetUser.avatar} alt={targetUser.name} />
                                      <AvatarFallback>{getInitials(targetUser.name)}</AvatarFallback>
                                    </Avatar>
                                    {targetUser.isOnline && (
                                      <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card" />
                                    )}
                                  </div>

                                  <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                                    {targetUser.developerLevel || 'Senior'}
                                  </Badge>
                                </div>

                                <div>
                                  <Link
                                    href={`/profile/${targetUser.username}`}
                                    className="font-bold text-base hover:text-primary transition-colors block truncate"
                                  >
                                    {targetUser.name}
                                  </Link>
                                  <p className="text-xs text-muted-foreground truncate">
                                    @{targetUser.username} • {targetUser.company || 'Software Engineer'}
                                  </p>
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {targetUser.bio || 'Building scalable cloud applications and distributed systems.'}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {targetUser.skills.slice(0, 3).map((skill) => (
                                    <span
                                      key={skill}
                                      className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {targetUser.skills.length > 3 && (
                                    <span className="text-[10px] text-muted-foreground px-1 self-center">
                                      +{targetUser.skills.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 pt-3 border-t border-border/50 bg-background/30 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs h-8"
                                asChild
                              >
                                <Link href={`/messages?user=${targetUser.id}`}>
                                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                  Message
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8 px-2.5"
                                asChild
                              >
                                <Link href={`/profile/${targetUser.username}`}>
                                  Profile
                                </Link>
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Pending Requests */}
                <TabsContent value="requests" className="space-y-4 mt-0">
                  {pendingRequests.length === 0 ? (
                    <Card className="p-12 text-center bg-card/50 border-dashed border-border/80">
                      <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <h3 className="font-semibold text-lg">No pending invitations</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                        You have reviewed all incoming connection requests.
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {pendingRequests.map((req) => (
                        <Card
                          key={req.id}
                          className="p-5 bg-card/60 border-border/70 backdrop-blur hover:border-orange-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <Avatar className="h-12 w-12 border border-border shrink-0">
                              <AvatarImage src={req.requester.avatar} alt={req.requester.name} />
                              <AvatarFallback>{getInitials(req.requester.name)}</AvatarFallback>
                            </Avatar>

                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link
                                  href={`/profile/${req.requester.username}`}
                                  className="font-bold text-base hover:text-primary transition-colors"
                                >
                                  {req.requester.name}
                                </Link>
                                <span className="text-xs text-muted-foreground">@{req.requester.username}</span>
                                <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                                  {req.requester.developerLevel || 'Senior'}
                                </Badge>
                              </div>

                              <p className="text-xs text-foreground font-medium">
                                &quot;{req.message || 'I would like to connect with you on Coding World Connect!'}&quot;
                              </p>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {req.requester.skills.slice(0, 3).map((s) => (
                                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-xs h-8"
                              onClick={() => handleAcceptRequest(req.id, req.requester.name)}
                            >
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleRejectRequest(req.id, req.requester.name)}
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Suggested Developers */}
                <TabsContent value="suggested" className="space-y-4 mt-0">
                  <div className="grid gap-5 md:grid-cols-3">
                    {suggestedList.map((item) => (
                      <Card
                        key={item.user.id}
                        className="p-5 bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <Avatar className="h-14 w-14 border border-border">
                              <AvatarImage src={item.user.avatar} alt={item.user.name} />
                              <AvatarFallback>{getInitials(item.user.name)}</AvatarFallback>
                            </Avatar>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                              {item.matchPercentage}% Match
                            </Badge>
                          </div>

                          <div>
                            <Link
                              href={`/profile/${item.user.username}`}
                              className="font-bold text-base hover:text-primary transition-colors block"
                            >
                              {item.user.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              @{item.user.username} • {item.user.currentRole || 'Engineer'}
                            </p>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            {item.matchReason}
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {item.user.skills.slice(0, 3).map((s) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border/50 mt-4">
                          <Button
                            size="sm"
                            className="w-full text-xs h-8 bg-primary hover:bg-primary/90"
                            onClick={() => handleConnectWithSuggested(item.user.id, item.user.name)}
                          >
                            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                            Connect
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Network Growth Card */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Network Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Total Connections</span>
                      <span className="font-bold text-foreground">{connections.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Pending Received</span>
                      <span className="font-bold text-orange-400">{pendingRequests.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Profile Reach This Week</span>
                      <span className="font-bold text-emerald-400">142 views (+24%)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-background/50">
                      <span className="text-muted-foreground">Search Appearances</span>
                      <span className="font-bold text-primary">89 times</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Share Profile Invite */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-primary" />
                    Share Your Dev Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Invite colleagues and open-source contributors to connect with your Coding World profile.
                  </p>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border border-border/60 text-xs font-mono text-muted-foreground">
                    <span className="truncate">connect.codingworld.dev/@{currentUser.username}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://connect.codingworld.dev/@${currentUser.username}`);
                      toast.success('Profile URL copied to clipboard!');
                    }}
                  >
                    Copy Profile Link
                  </Button>
                </CardContent>
              </Card>

              {/* Connection Tips */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-amber-400" />
                    Community Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>• Include a short message explaining what project or skill you want to discuss.</p>
                  <p>• Engineers who connect frequently participate in 3x more live peer programming sessions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
