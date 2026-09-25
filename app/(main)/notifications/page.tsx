'use client';

import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { notificationsService } from '@/services/notifications.service';
import { formatDate, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { data: all } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.getNotifications(),
  });

  const { data: unread } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsService.getUnreadNotifications(),
  });

  const handleMarkAllRead = async () => {
    await notificationsService.markAllAsRead();
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your activity</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-2">
              {all?.data?.data?.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No notifications yet</p>
                </Card>
              )}

              {all?.data?.data?.map((notification: any) => (
                <Card
                  key={notification.id}
                  className={cn(
                    'p-4 cursor-pointer hover:bg-accent transition-colors',
                    !notification.isRead && 'bg-primary/5'
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="mt-6">
            <div className="space-y-2">
              {unread?.data?.data?.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No unread notifications</p>
                </Card>
              )}

              {unread?.data?.data?.map((notification: any) => (
                <Card
                  key={notification.id}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors bg-primary/5"
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.createdAt)}
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
