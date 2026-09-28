'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, MessageSquare, Plus, User, Settings, LogOut, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { ROUTES } from '@/lib/config';
import { getInitials } from '@/lib/utils';
import { authService } from '@/services/auth.service';
import { useState } from 'react';
import { toast } from 'sonner';
import { currentUser } from '@/lib/mock-data';

export function Navbar() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { toggleMobileMenu } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const user = currentUser;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logged out successfully');
      router.push(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden flex-shrink-0"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo - Fixed Width */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 lg:w-64 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold leading-none">Coding World</span>
            <span className="text-xs text-muted-foreground leading-none">Connect</span>
          </div>
        </Link>

        {/* Search - Centered & Expanded */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search developers, problems, posts..."
              className="w-full pl-10 bg-muted/50 border-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right Actions - Fixed Width */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Button
            size="sm"
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 via-primary to-purple-600 hover:opacity-90 text-white font-semibold text-xs h-8 px-3 shadow-md shadow-primary/20 border-0"
            asChild
          >
            <Link href="/world">
              <Globe className="h-3.5 w-3.5 animate-spin-slow" />
              <span>Virtual World</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse ml-0.5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href={ROUTES.NOTIFICATIONS}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href={ROUTES.MESSAGES}>
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500"></span>
            </Link>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {getInitials(user?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{getInitials(user?.name || 'User')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">@{user?.username}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROUTES.PROFILE} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.SETTINGS} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
