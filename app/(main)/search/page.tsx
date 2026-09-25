'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { searchService } from '@/services/search.service';

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchService.search(query),
    enabled: query.length > 0,
  });

  useEffect(() => {
    const q = searchParams?.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-muted-foreground mt-2">
            Find developers, problems, posts, and more
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search developers, problems, posts..."
            className="pl-12 h-12 text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {query && (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="developers">Developers</TabsTrigger>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Searching...</p>
                </Card>
              )}

              {data && (
                <div className="space-y-6">
                  {data.data?.users?.length === 0 &&
                    data.data?.problems?.length === 0 &&
                    data.data?.posts?.length === 0 && (
                      <Card className="p-12 text-center">
                        <p className="text-muted-foreground">No results found for &quot;{query}&quot;</p>
                      </Card>
                    )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="developers" className="mt-6">
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Developer search results</p>
              </Card>
            </TabsContent>

            <TabsContent value="problems" className="mt-6">
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Problem search results</p>
              </Card>
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Post search results</p>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<MainLayout><div className="container max-w-6xl py-6"><Card className="p-12 text-center"><p className="text-muted-foreground">Loading...</p></Card></div></MainLayout>}>
      <SearchContent />
    </Suspense>
  );
}
