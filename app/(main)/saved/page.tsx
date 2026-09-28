'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Code,
  FileText,
  User,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockSavedItems } from '@/lib/mock-data';
import { SavedItem } from '@/types';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(mockSavedItems);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const handleRemove = (id: string, title: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    toast.info(`Removed "${title}" from saved items.`);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedSnippetId(id);
    toast.success('Code snippet copied to clipboard!');
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const filteredItems = savedItems.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'problems' && item.type === 'PROBLEM') ||
      (activeTab === 'posts' && item.type === 'POST') ||
      (activeTab === 'snippets' && item.type === 'SNIPPET') ||
      (activeTab === 'developers' && item.type === 'DEVELOPER');

    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'PROBLEM':
        return <Code className="h-4 w-4 text-emerald-400" />;
      case 'POST':
        return <FileText className="h-4 w-4 text-blue-400" />;
      case 'SNIPPET':
        return <Bookmark className="h-4 w-4 text-amber-400" />;
      case 'DEVELOPER':
        return <User className="h-4 w-4 text-purple-400" />;
      default:
        return <Bookmark className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <MainLayout>
      <div className="w-full py-8">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/15 via-purple-500/10 to-background p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-semibold text-primary">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Personal Library &amp; Bookmarks</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Saved Content &amp; Snippets
                </h1>
                <p className="text-muted-foreground text-base max-w-2xl">
                  Quick access to bookmarked interview challenges, architecture articles, peer profiles, and reusable code snippets.
                </p>
              </div>

              {/* Total items badge */}
              <div className="flex items-center gap-4 bg-background/80 backdrop-blur border border-border/70 p-4 rounded-xl shadow-lg shrink-0">
                <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-foreground">
                    {savedItems.length} Bookmarked Items
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Organized across 4 categories
                  </div>
                  <div className="text-xs text-primary font-medium mt-0.5">
                    Synced with your cloud notes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            {/* Left Column: Saved Items */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-card/60 border border-border/70 rounded-xl backdrop-blur">
                  <TabsList className="bg-background/60">
                    <TabsTrigger value="all" className="gap-2 text-xs font-semibold">
                      All Saved ({savedItems.length})
                    </TabsTrigger>
                    <TabsTrigger value="problems" className="gap-2 text-xs font-semibold">
                      Problems
                    </TabsTrigger>
                    <TabsTrigger value="posts" className="gap-2 text-xs font-semibold">
                      Articles
                    </TabsTrigger>
                    <TabsTrigger value="snippets" className="gap-2 text-xs font-semibold">
                      Code Snippets
                    </TabsTrigger>
                    <TabsTrigger value="developers" className="gap-2 text-xs font-semibold">
                      Peers
                    </TabsTrigger>
                  </TabsList>

                  {/* Search bar inside tab strip */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search saved items..."
                      className="pl-8 h-8 text-xs bg-background/50 border-border/70"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <TabsContent value={activeTab} className="space-y-4 mt-0">
                  {filteredItems.length === 0 ? (
                    <Card className="p-12 text-center bg-card/50 border-dashed border-border/80">
                      <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <h3 className="font-semibold text-lg">No saved items found</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                        {searchQuery
                          ? 'No bookmarks match your search keywords.'
                          : 'You have not saved any items in this category yet.'}
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredItems.map((item) => (
                        <Card
                          key={item.id}
                          className="p-5 bg-card/60 border-border/70 backdrop-blur hover:border-primary/50 transition-all duration-200 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="p-2 rounded-xl bg-background/60 border border-border/50 shrink-0">
                                {getItemIcon(item.type)}
                              </div>

                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link
                                    href={item.link}
                                    className="font-bold text-base hover:text-primary transition-colors truncate"
                                  >
                                    {item.title}
                                  </Link>
                                  <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                                    {item.category || item.type}
                                  </Badge>
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {item.description}
                                </p>

                                {/* Tags */}
                                {item.tags && item.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {item.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="text-[10px] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/40"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions & Timestamp */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
                              <span className="text-[11px] text-muted-foreground">{item.savedAt}</span>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-8 px-2.5 bg-background/50"
                                  asChild
                                >
                                  <Link href={item.link}>
                                    Open
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleRemove(item.id, item.title)}
                                  title="Remove from saved"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* If Code Snippet, render syntax highlighted card preview */}
                          {item.codeSnippet && (
                            <div className="pt-2">
                              <div className="p-3 rounded-xl bg-black/40 border border-border/50 space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="font-mono uppercase font-bold text-[11px] text-primary">
                                    {item.codeSnippet.language}
                                  </span>
                                  <button
                                    onClick={() => handleCopyCode(item.id, item.codeSnippet!.code)}
                                    className="flex items-center gap-1 hover:text-foreground text-xs transition-colors"
                                  >
                                    {copiedSnippetId === item.id ? (
                                      <>
                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3.5 w-3.5" />
                                        <span>Copy Code</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                                  {item.codeSnippet.code}
                                </pre>
                              </div>
                            </div>
                          )}

                          {/* If Developer item, render mini profile badge */}
                          {item.user && (
                            <div className="pt-2">
                              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border border-border/40">
                                <Avatar className="h-9 w-9 border border-border">
                                  <AvatarImage src={item.user.avatar} />
                                  <AvatarFallback>{getInitials(item.user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-foreground truncate">{item.user.name}</p>
                                  <p className="text-[11px] text-muted-foreground truncate">
                                    @{item.user.username} • {item.user.company}
                                  </p>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs h-7 px-2" asChild>
                                  <Link href={`/profile/${item.user.username}`}>View Profile</Link>
                                </Button>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Category Breakdown Card */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Bookmarks Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  <div
                    onClick={() => setActiveTab('problems')}
                    className="flex justify-between items-center p-2 rounded bg-background/50 hover:bg-accent cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Code className="h-3.5 w-3.5 text-emerald-400" /> Coding Problems
                    </span>
                    <span className="font-bold text-foreground">
                      {savedItems.filter((i) => i.type === 'PROBLEM').length}
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('posts')}
                    className="flex justify-between items-center p-2 rounded bg-background/50 hover:bg-accent cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-blue-400" /> Articles &amp; Posts
                    </span>
                    <span className="font-bold text-foreground">
                      {savedItems.filter((i) => i.type === 'POST').length}
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('snippets')}
                    className="flex justify-between items-center p-2 rounded bg-background/50 hover:bg-accent cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Bookmark className="h-3.5 w-3.5 text-amber-400" /> Code Snippets
                    </span>
                    <span className="font-bold text-foreground">
                      {savedItems.filter((i) => i.type === 'SNIPPET').length}
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('developers')}
                    className="flex justify-between items-center p-2 rounded bg-background/50 hover:bg-accent cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-purple-400" /> Saved Developers
                    </span>
                    <span className="font-bold text-foreground">
                      {savedItems.filter((i) => i.type === 'DEVELOPER').length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Note Helper */}
              <Card className="bg-card/70 border-border/70 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    Quick Save Snippet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Save reusable snippets, algorithms or commands straight to your private developer library.
                  </p>
                  <Button
                    className="w-full text-xs bg-primary hover:bg-primary/90"
                    onClick={() => {
                      toast.success('Snippet modal opened!', {
                        description: 'Paste your code and tags to add to your library.',
                      });
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    New Snippet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
