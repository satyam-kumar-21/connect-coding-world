'use client';

import { useState } from 'react';
import { Radio, Send, MapPin, Code } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { mockUsers, currentUser } from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';
import { toast } from 'sonner';

export default function LivePage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState('');

  const liveDevelopers = mockUsers.filter(
    u => u.isOnline && u.isAvailableForConnection && u.id !== currentUser.id
  );

  const handleSendRequest = async () => {
    if (!selectedUser) return;
    
    toast.success(`Collaboration request sent to ${selectedUser.name}!`);
    setSelectedUser(null);
    setMessage('');
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
            <Radio className="h-8 w-8 text-green-500 animate-pulse-dot" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold">Developers Live Now</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Find someone to code, discuss, learn or collaborate with
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="success" className="text-sm">
                {liveDevelopers.length} developers online
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last updated: just now
              </span>
            </div>
          </div>
        </div>

        {liveDevelopers.length === 0 && (
          <Card className="p-16 text-center">
            <Radio className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No developers are currently available</h3>
            <p className="text-muted-foreground">
              Check back later or enable your availability in settings
            </p>
          </Card>
        )}

        {/* Live Developers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {liveDevelopers.map((developer: any) => (
            <Card key={developer.id} className="p-6 hover:shadow-lg transition-all hover:border-primary/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-green-500/20">
                      <AvatarImage src={developer.avatar} alt={developer.name} />
                      <AvatarFallback className="text-lg">{getInitials(developer.name)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-4 border-background animate-pulse-dot flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-white"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{developer.name}</h3>
                    <p className="text-sm text-muted-foreground">@{developer.username}</p>
                    {developer.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {developer.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Skills */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">SKILLS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {developer.skills?.slice(0, 4).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {developer.skills?.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{developer.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Code className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{developer.problemsSolved}</p>
                      <p className="text-xs text-muted-foreground">Solved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <span className="text-yellow-500">⚡</span>
                    </div>
                    <div>
                      <p className="font-bold">{formatXP(developer.xp)}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setSelectedUser(developer)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Request to Connect
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Request Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Collaboration Request</DialogTitle>
              <DialogDescription>
                Send a request to {selectedUser?.name} to start collaborating
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.name} />
                  <AvatarFallback>{getInitials(selectedUser?.name || '')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedUser?.name}</p>
                  <p className="text-sm text-muted-foreground">@{selectedUser?.username}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message (optional)</label>
                <Textarea
                  placeholder="I want to solve a problem together..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Let them know what you want to work on
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedUser(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSendRequest} className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Send Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
