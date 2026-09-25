'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ExplorePage() {
  return (
    <MainLayout>
      <div className="container max-w-6xl py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="text-muted-foreground mt-2">Discover developers, problems, and content</p>
        </div>

        <Tabs defaultValue="developers">
          <TabsList>
            <TabsTrigger value="developers">Developers</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="developers" className="mt-6">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Explore developers feature coming soon</p>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="mt-6">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Browse all problems</p>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Explore posts from the community</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
