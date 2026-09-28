'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  Send,
  Zap,
  Clock,
  Sparkles,
  Bookmark,
  Share2,
  Code2,
  BookOpen,
  Check,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockProblems, currentUser } from '@/lib/mock-data';
import { formatXP } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const problem =
    mockProblems.find((p) => p.slug === slug) || mockProblems[0];

  const [selectedLanguage, setSelectedLanguage] = useState('TypeScript');
  const [code, setCode] = useState(
    `function solution(input: any) {
  // Write your optimal solution here
  console.log("Processing input:", input);
  return true;
}`
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('Executing test cases in sandbox environment...\n');
    setTimeout(() => {
      setIsRunning(false);
      setTestResult({
        status: 'PASSED',
        runtime: 48,
        memory: 42.1,
        passedCases: 3,
        totalCases: 3,
      });
      setConsoleOutput(
        `✓ Test Case 1: Passed (nums = [2,7,11,15], target = 9) -> Output: [0, 1]\n✓ Test Case 2: Passed (nums = [3,2,4], target = 6) -> Output: [1, 2]\n✓ Test Case 3: Passed (nums = [3,3], target = 6) -> Output: [0, 1]\n\nAll public test cases passed in 48ms!`
      );
      toast.success('All public test cases passed!');
    }, 900);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Solution Accepted! +${problem.xpReward} XP earned! 🎉`, {
        description: 'Runtime: 52ms (Beats 92.4%) | Memory: 43.8MB (Beats 88.1%)',
      });
      setTestResult({
        status: 'ACCEPTED',
        runtime: 52,
        memory: 43.8,
        passedCases: 63,
        totalCases: 63,
        xpEarned: problem.xpReward,
      });
      setConsoleOutput(
        `================ SUBMISSION RESULT ================\nStatus: ACCEPTED (63/63 test cases passed)\nRuntime: 52 ms (faster than 92.4% of TypeScript submissions)\nMemory: 43.8 MB (less than 88.1% of submissions)\nXP Rewarded: +${problem.xpReward} XP added to your profile!\n===================================================`
      );
    }, 1200);
  };

  return (
    <MainLayout>
      <div className="w-full py-6">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Top Bar with Back and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                <Link href="/problems">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Problems
                </Link>
              </Button>
              <span className="text-muted-foreground">/</span>
              <h1 className="font-extrabold text-xl text-foreground truncate max-w-md">
                {problem.title}
              </h1>
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
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => {
                  setIsBookmarked(!isBookmarked);
                  toast[isBookmarked ? 'info' : 'success'](
                    isBookmarked ? 'Removed from saved' : 'Problem saved to bookmarks!'
                  );
                }}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 mr-1.5 ${isBookmarked ? 'fill-primary text-primary' : ''}`}
                />
                {isBookmarked ? 'Saved' : 'Bookmark'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success('Problem link copied to clipboard!');
                }}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                Share
              </Button>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-2.5 py-1">
                +{problem.xpReward} XP Reward
              </Badge>
            </div>
          </div>

          {/* 2-Column Split: Problem Description vs Code Editor */}
          <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)] min-h-[600px]">
            {/* Left Column: Problem Tabs & Description */}
            <Card className="flex flex-col h-full bg-card/60 border-border/70 backdrop-blur overflow-hidden">
              <div className="p-2 border-b border-border/70 bg-card/40">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-background/60">
                    <TabsTrigger value="description" className="text-xs">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="editorial" className="text-xs">
                      Editorial &amp; Hints
                    </TabsTrigger>
                    <TabsTrigger value="submissions" className="text-xs">
                      Submissions
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'description' && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{problem.title}</h2>
                        {problem.isSolved && (
                          <Badge variant="success" className="text-xs flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Solved
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{problem.category}</Badge>
                        <span>•</span>
                        <span>{problem.acceptanceRate}% Acceptance Rate</span>
                        <span>•</span>
                        <span>{problem.totalSubmissions.toLocaleString()} Submissions</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
                      {problem.description}
                    </div>

                    {problem.examples && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                          Examples:
                        </h3>
                        <div className="p-4 rounded-xl bg-background/60 border border-border/60 font-mono text-xs text-emerald-300 whitespace-pre-line leading-relaxed">
                          {problem.examples}
                        </div>
                      </div>
                    )}

                    {problem.constraints && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                          Constraints:
                        </h3>
                        <div className="p-3 rounded-xl bg-background/50 border border-border/50 font-mono text-xs text-muted-foreground whitespace-pre-line">
                          {problem.constraints}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 pt-2">
                      <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        Related Topics:
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {problem.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'editorial' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">Optimal Solution Approach</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {problem.editorial ||
                        'To solve this problem in linear O(N) time complexity, iterate through elements once while maintaining an auxiliary Hash Map to track indices and lookup complements in O(1) average time.'}
                    </p>
                    <div className="p-4 rounded-xl bg-background/60 border border-border/50 text-xs font-mono text-emerald-300">
                      Time Complexity: O(N) • Space Complexity: O(N)
                    </div>
                  </div>
                )}

                {activeTab === 'submissions' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-background/60 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-emerald-400">Accepted • 52ms</div>
                        <div className="text-muted-foreground mt-0.5">TypeScript • 1 hour ago</div>
                      </div>
                      <Badge variant="success">100 / 100</Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Right Column: Code Editor & Console Output */}
            <Card className="flex flex-col h-full bg-card/60 border-border/70 backdrop-blur overflow-hidden">
              {/* Editor Top Bar */}
              <div className="p-3 border-b border-border/70 flex items-center justify-between bg-card/40">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-background/80 border border-border/70 text-xs rounded-lg px-2.5 py-1 font-medium text-foreground focus:outline-none"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python 3</option>
                    <option value="Go">Go (Golang)</option>
                    <option value="Java">Java 17</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 px-3"
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitting}
                  >
                    <Play className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                    {isRunning ? 'Running...' : 'Run Test Cases'}
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-8 px-3.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow"
                    onClick={handleSubmit}
                    disabled={isRunning || isSubmitting}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    {isSubmitting ? 'Evaluating...' : 'Submit Solution'}
                  </Button>
                </div>
              </div>

              {/* Code Textarea / Editor */}
              <div className="flex-1 relative font-mono text-xs">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full p-4 bg-background/80 text-emerald-300 font-mono text-xs resize-none focus:outline-none leading-relaxed border-0"
                  spellCheck={false}
                />
              </div>

              {/* Bottom Test / Console Output */}
              <div className="h-48 border-t border-border/70 bg-black/60 flex flex-col">
                <div className="px-4 py-2 border-b border-border/40 flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Terminal className="h-3.5 w-3.5 text-primary" /> Console Output
                  </span>
                  {testResult && (
                    <span
                      className={
                        testResult.status === 'ACCEPTED' || testResult.status === 'PASSED'
                          ? 'text-emerald-400 font-bold'
                          : 'text-rose-400 font-bold'
                      }
                    >
                      {testResult.status} ({testResult.runtime}ms)
                    </span>
                  )}
                </div>

                <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {consoleOutput ||
                    'Click "Run Test Cases" to test with public inputs or "Submit Solution" to run full evaluation suite.'}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
