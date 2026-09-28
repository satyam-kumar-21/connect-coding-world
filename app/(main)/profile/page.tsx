'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { currentUser } from '@/lib/mock-data';

export default function ProfileRedirect() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const targetUsername = user?.username || currentUser.username;
    router.push(`/profile/${targetUsername}`);
  }, [user, router]);

  return null;
}
