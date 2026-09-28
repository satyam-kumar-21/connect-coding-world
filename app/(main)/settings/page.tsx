'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(user?.isAvailableForConnection || false);

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Settings &amp; Preferences</h1>
            <p className="text-muted-foreground mt-1">Manage your developer account, live privacy, and platform notifications</p>
          </div>

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={user?.username} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <Button>Save Changes</Button>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                  defaultValue={user?.bio}
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue={user?.location} placeholder="City, Country" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" defaultValue={user?.website} placeholder="https://" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" defaultValue={user?.github} placeholder="https://github.com/username" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" defaultValue={user?.linkedin} placeholder="https://linkedin.com/in/username" />
              </div>

              <Button>Save Changes</Button>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your profile
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Coding Statistics</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your problems solved and acceptance rate
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you&apos;re online
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button>Save Changes</Button>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="mt-6">
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Appear in Live Developers</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow other developers to see you&apos;re available for collaboration
                  </p>
                </div>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
              </div>

              <Button onClick={() => toast.success('Settings saved')}>Save Changes</Button>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Connection Requests</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>New Messages</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Post Reactions</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Comments & Replies</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Achievements</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Collaboration Requests</Label>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button>Save Changes</Button>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
