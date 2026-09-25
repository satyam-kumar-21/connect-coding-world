'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function ActivityPage() {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Activity</h1>
            <p className="text-muted-foreground">Your recent actions and history</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Activity feed coming soon</p>
        </Card>
      </div>
    </MainLayout>
  );
}
