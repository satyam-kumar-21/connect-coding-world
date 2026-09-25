'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { connectionsService } from '@/services/connections.service';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';

export default function ConnectionsPage() {
  const { data: connections } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionsService.getConnections(),
  });

  const { data: requests } = useQuery({
    queryKey: ['connection-requests'],
    queryFn: () => connectionsService.getConnectionRequests(),
  });

  const handleAccept = async (id: string) => {
    try {
      await connectionsService.acceptRequest(id);
      toast.success('Connection accepted!');
    } catch (error) {
      toast.error('Failed to accept connection');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await connectionsService.rejectRequest(id);
      toast.success('Connection rejected');
    } catch (error) {
      toast.error('Failed to reject connection');
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Connections</h1>
            <p className="text-muted-foreground">Manage your developer network</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Connections</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {requests?.data?.data && requests.data.data.length > 0 && (
                <Badge variant="default" className="ml-2">
                  {requests.data.data.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {connections?.data?.data?.map((conn: any) => {
                const user = conn.requester.id === 'current-user' ? conn.addressee : conn.requester;
                return (
                  <Card key={conn.id} className="p-6">
                    <Link href={`/profile/${user.username}`} className="block mb-4">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-3">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </Link>

                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {user.skills?.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/messages?user=${user.id}`}>Message</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/profile/${user.username}`}>View Profile</Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {connections?.data?.data?.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">You haven&apos;t connected with anyone yet</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-3">
              {requests?.data?.data?.map((request: any) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.requester.avatar} alt={request.requester.name} />
                        <AvatarFallback>{getInitials(request.requester.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/profile/${request.requester.username}`}
                          className="font-semibold hover:underline"
                        >
                          {request.requester.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          @{request.requester.username}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(request.id)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                      >
                        <UserMinus className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {requests?.data?.data?.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No pending connection requests</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
