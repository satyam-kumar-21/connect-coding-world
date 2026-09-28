'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Code,
  Trophy,
  Radio,
  Globe,
  Users,
  MessageSquare,
  Bell,
  Bookmark,
  Activity,
  User,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { currentUser } from '@/lib/mock-data';
import { getInitials, formatXP } from '@/lib/utils';
import { useUIStore } from '@/stores/ui.store';
import { useEffect } from 'react';

const navItems = [
  { icon: Home, label: 'Home', href: ROUTES.HOME },
  { icon: Compass, label: 'Explore', href: ROUTES.EXPLORE },
  { icon: Code, label: 'Problems', href: ROUTES.PROBLEMS },
  { icon: Trophy, label: 'Leaderboard', href: ROUTES.LEADERBOARD },
  { icon: Radio, label: 'Live', href: ROUTES.LIVE, badge: '3' },
  { icon: Globe, label: 'Virtual World', href: '/world', badge: 'Live 3D' },
  { icon: Users, label: 'Connections', href: ROUTES.CONNECTIONS },
  { icon: MessageSquare, label: 'Messages', href: ROUTES.MESSAGES, badge: '1' },
  { icon: Bell, label: 'Notifications', href: ROUTES.NOTIFICATIONS, badge: '2' },
];

const secondaryItems = [
  { icon: Activity, label: 'My Activity', href: '/activity' },
  { icon: Bookmark, label: 'Saved', href: '/saved' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out",
        // Mobile: slide in/out
        "lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Close button for mobile */}
          <div className="lg:hidden absolute top-3 right-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeMobileMenu}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        {/* User Profile Card */}
        <div className="p-4 border-b border-border/40">
          <Link href={ROUTES.PROFILE} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group">
            <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">@{currentUser.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  Rank #{currentUser.rank}
                </Badge>
                <span className="text-xs text-primary font-semibold">{formatXP(currentUser.xp)}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && !isActive && (
                  <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-3 border-t border-border/40" />

          {/* Secondary Items */}
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Settings */}
        <div className="p-3 border-t border-border/40">
          <Link
            href={ROUTES.SETTINGS}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              pathname === ROUTES.SETTINGS
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
    </>
  );
}
