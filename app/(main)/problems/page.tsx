'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, CheckCircle2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProblems } from '@/lib/mock-data';
import { PROBLEM_CATEGORIES } from '@/lib/config';

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const filteredProblems = useMemo(() => {
    return mockProblems.filter(problem => {
      const matchesSearch = search === '' || 
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = category === 'all' || problem.category === category;
      const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, category, difficulty]);

  const stats = {
    total: mockProblems.length,
    solved: mockProblems.filter(p => p.isSolved).length,
    easy: mockProblems.filter(p => p.difficulty === 'EASY').length,
    medium: mockProblems.filter(p => p.difficulty === 'MEDIUM').length,
    hard: mockProblems.filter(p => p.difficulty === 'HARD').length,
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Coding Problems</h1>
          <p className="text-muted-foreground mt-2">
            Solve problems, earn XP, and improve your skills
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.solved}</div>
            <div className="text-sm text-muted-foreground">Solved</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.easy}</div>
            <div className="text-sm text-muted-foreground">Easy</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.medium}</div>
            <div className="text-sm text-muted-foreground">Medium</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.hard}</div>
            <div className="text-sm text-muted-foreground">Hard</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search problems by title or tags..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {PROBLEM_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No problems found matching your filters</p>
            </Card>
          )}

          {filteredProblems.map((problem) => (
            <Link key={problem.id} href={`/problems/${problem.slug}`}>
              <Card className="p-4 hover:bg-accent/50 transition-all cursor-pointer hover:border-primary/50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {problem.isSolved && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                      <h3 className="font-semibold text-lg truncate">{problem.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          problem.difficulty === 'EASY'
                            ? 'success'
                            : problem.difficulty === 'MEDIUM'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="text-xs"
                      >
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {problem.category}
                      </Badge>
                      {problem.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-primary">+{problem.xpReward} XP</div>
                    <div className="text-xs text-muted-foreground">
                      {problem.acceptanceRate}% accepted
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
