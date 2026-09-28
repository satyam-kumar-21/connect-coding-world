'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Search,
  Code,
  Copy,
  Check,
  Video,
  Radio,
  Sparkles,
  Phone,
  MoreVertical,
  Paperclip,
  Smile,
  Shield,
  ExternalLink,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  mockConversations,
  mockMessagesByConversation,
  mockUsers,
  currentUser,
} from '@/lib/mock-data';
import { Message, Conversation } from '@/types';
import { getInitials, formatDate, formatXP, cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConvId, setSelectedConvId] = useState<string>(mockConversations[0]?.id || 'conv-1');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(mockMessagesByConversation);
  const [inputText, setInputText] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeMessages = messagesMap[selectedConvId] || [];

  // Identify recipient / other user
  const otherParticipant = activeConversation?.participants.find((p) => p.id !== currentUser.id) || mockUsers[1];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      sender: currentUser,
      content: inputText.trim(),
      type: isSendingCode ? 'CODE' : 'TEXT',
      codeLanguage: isSendingCode ? 'typescript' : undefined,
      media: isSendingCode ? inputText.trim() : undefined,
      isRead: false,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = {
      ...messagesMap,
      [selectedConvId]: [...(messagesMap[selectedConvId] || []), newMessage],
    };
    setMessagesMap(updated);

    // Update conversation lastMessage preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConvId
          ? { ...c, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : c
      )
    );

    setInputText('');
    setIsSendingCode(false);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedMsgId(id);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <MainLayout>
      <div className="w-full py-4 sm:py-6">
        <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-border/70 bg-card/60 backdrop-blur shadow-2xl h-[calc(100vh-6.5rem)]">
            <div className="grid md:grid-cols-[330px_1fr] xl:grid-cols-[340px_1fr_320px] h-full">
              {/* 1. Conversations List (Left) */}
              <div className="border-r border-border/70 flex flex-col h-full bg-card/40">
                <div className="p-4 border-b border-border/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold tracking-tight">Direct Messages</h2>
                    <Badge variant="outline" className="text-xs text-primary border-primary/30">
                      {conversations.length} Active
                    </Badge>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search conversations & code..."
                      className="pl-9 h-9 text-xs bg-background/50 border-border/70"
                    />
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 divide-y divide-border/40">
                  {conversations.map((conv) => {
                    const otherUser =
                      conv.participants.find((p) => p.id !== currentUser.id) || conv.participants[0];
                    const isSelected = selectedConvId === conv.id;

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConvId(conv.id)}
                        className={cn(
                          'w-full p-4 flex items-start gap-3.5 hover:bg-accent/40 transition-colors text-left group',
                          isSelected && 'bg-primary/10 border-l-4 border-l-primary'
                        )}
                      >
                        <div className="relative shrink-0">
                          <Avatar className="h-12 w-12 border border-border shadow-sm">
                            <AvatarImage src={conv.type === 'GROUP' ? undefined : otherUser?.avatar} />
                            <AvatarFallback>
                              {conv.type === 'GROUP' ? 'GP' : getInitials(otherUser?.name || 'Dev')}
                            </AvatarFallback>
                          </Avatar>
                          {otherUser?.isOnline && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                              {conv.type === 'GROUP' ? conv.name : otherUser?.name}
                            </p>
                            <span className="text-[11px] text-muted-foreground shrink-0">
                              {conv.lastMessage?.createdAt
                                ? formatDate(conv.lastMessage.createdAt)
                                : 'Just now'}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage?.type === 'CODE' ? (
                              <span className="text-primary font-mono flex items-center gap-1">
                                <Code className="h-3 w-3 inline" /> [Code Snippet]
                              </span>
                            ) : (
                              conv.lastMessage?.content || 'No messages yet'
                            )}
                          </p>

                          {conv.unreadCount > 0 && (
                            <span className="inline-block mt-1.5 px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                              {conv.unreadCount} new
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Active Chat Area (Center) */}
              <div className="flex flex-col h-full bg-background/40">
                {/* Chat Top Header */}
                <div className="p-4 border-b border-border/70 flex items-center justify-between bg-card/40 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={activeConversation.type === 'GROUP' ? undefined : otherParticipant?.avatar} />
                        <AvatarFallback>{getInitials(otherParticipant?.name || 'Dev')}</AvatarFallback>
                      </Avatar>
                      {otherParticipant?.isOnline && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm">
                          {activeConversation.type === 'GROUP' ? activeConversation.name : otherParticipant?.name}
                        </h3>
                        {otherParticipant?.developerLevel && (
                          <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] h-4">
                            {otherParticipant.developerLevel}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Online &amp; available for peer coding
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 px-3"
                      asChild
                    >
                      <Link href="/live">
                        <Radio className="h-3.5 w-3.5 mr-1.5" />
                        Live Pair Room
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages Timeline */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  <div className="text-center my-2">
                    <span className="text-[11px] px-3 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/40">
                      End-to-end encrypted peer messaging
                    </span>
                  </div>

                  {activeMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;

                    return (
                      <div
                        key={msg.id}
                        className={cn('flex gap-2.5', isMe ? 'justify-end' : 'justify-start')}
                      >
                        {!isMe && (
                          <Avatar className="h-8 w-8 mt-1 border border-border shrink-0">
                            <AvatarImage src={msg.sender?.avatar || otherParticipant?.avatar} />
                            <AvatarFallback>{getInitials(msg.sender?.name || 'Dev')}</AvatarFallback>
                          </Avatar>
                        )}

                        <div className={cn('max-w-[85%] sm:max-w-[75%] space-y-1', isMe ? 'items-end' : 'items-start')}>
                          {/* Message bubble */}
                          <div
                            className={cn(
                              'rounded-2xl p-4 text-sm shadow-sm',
                              isMe
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-card border border-border/80 text-foreground rounded-bl-none'
                            )}
                          >
                            {msg.type === 'CODE' ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs pb-1 border-b border-white/20">
                                  <span className="font-mono uppercase font-bold text-[11px] opacity-80">
                                    {msg.codeLanguage || 'Code Snippet'}
                                  </span>
                                  <button
                                    onClick={() => handleCopyCode(msg.id, msg.media || msg.content)}
                                    className="flex items-center gap-1 hover:opacity-100 opacity-70 text-[11px] transition-opacity"
                                  >
                                    {copiedMsgId === msg.id ? (
                                      <>
                                        <Check className="h-3 w-3" /> Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3 w-3" /> Copy
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="font-mono text-xs overflow-x-auto p-2.5 rounded-lg bg-black/40 text-emerald-300 leading-relaxed">
                                  {msg.media || msg.content}
                                </pre>
                              </div>
                            ) : (
                              <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                            )}
                          </div>

                          <div
                            className={cn(
                              'text-[10px] text-muted-foreground px-1 flex items-center gap-1',
                              isMe ? 'justify-end' : 'justify-start'
                            )}
                          >
                            <span>{formatDate(msg.createdAt)}</span>
                            {isMe && <span>• Delivered</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Bar */}
                <div className="p-4 border-t border-border/70 bg-card/40 backdrop-blur">
                  {isSendingCode && (
                    <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary font-mono">
                      <span className="flex items-center gap-1.5">
                        <Code className="h-3.5 w-3.5" /> Code Snippet Mode Active (Markdown &amp; syntax formatted)
                      </span>
                      <button
                        onClick={() => setIsSendingCode(false)}
                        className="hover:underline text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant={isSendingCode ? 'default' : 'outline'}
                      size="icon"
                      className="h-10 w-10 shrink-0"
                      onClick={() => setIsSendingCode(!isSendingCode)}
                      title="Insert Code Snippet"
                    >
                      <Code className="h-4 w-4" />
                    </Button>

                    <Input
                      placeholder={
                        isSendingCode
                          ? 'Paste your code snippet here...'
                          : `Message ${activeConversation.type === 'GROUP' ? activeConversation.name : otherParticipant?.name}...`
                      }
                      className="flex-1 h-10 bg-background/50 border-border/80 font-normal"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />

                    <Button
                      size="icon"
                      className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* 3. Participant Details Drawer (Right - desktop only) */}
              <div className="hidden xl:flex flex-col h-full border-l border-border/70 p-5 bg-card/30 overflow-y-auto space-y-6">
                <div className="text-center space-y-3">
                  <Avatar className="h-20 w-20 border-2 border-primary/30 mx-auto shadow-md">
                    <AvatarImage src={otherParticipant?.avatar} />
                    <AvatarFallback className="text-lg">{getInitials(otherParticipant?.name || 'Dev')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{otherParticipant?.name}</h3>
                    <p className="text-xs text-muted-foreground">@{otherParticipant?.username}</p>
                    <Badge className="mt-1.5 bg-primary/10 text-primary border-primary/30 text-xs">
                      {otherParticipant?.developerLevel || 'Staff Engineer'}
                    </Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total XP:</span>
                    <span className="font-bold text-primary">{formatXP(otherParticipant?.xp || 12000)} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rank:</span>
                    <span className="font-bold text-foreground">#{otherParticipant?.rank || 2} Global</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Streak:</span>
                    <span className="font-bold text-orange-400">{otherParticipant?.streak || 32} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Solved:</span>
                    <span className="font-bold text-foreground">{otherParticipant?.problemsSolved || 230} Problems</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1">
                    {otherParticipant?.skills?.map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                    <Link href={`/profile/${otherParticipant?.username}`}>
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      View Full Profile
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-full text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                    asChild
                  >
                    <Link href="/live">
                      <Radio className="h-3.5 w-3.5 mr-1.5" />
                      Invite to Code Room
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
