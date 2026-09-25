'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send, Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { messagesService } from '@/services/messages.service';
import { getInitials, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesService.getConversations(),
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', selectedConversation?.id],
    queryFn: () => messagesService.getMessages(selectedConversation.id),
    enabled: !!selectedConversation,
  });

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-[320px_1fr] h-[calc(100vh-8rem)]">
            {/* Conversations List */}
            <div className="border-r border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold mb-3">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="pl-10" />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100%-5rem)]">
                {conversations?.data?.data?.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No conversations yet
                  </div>
                )}

                {conversations?.data?.data?.map((conv: any) => {
                  const otherUser = conv.participants.find((p: any) => p.id !== 'current-user-id');
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        'w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors border-b border-border',
                        selectedConversation?.id === conv.id && 'bg-accent'
                      )}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                          <AvatarFallback>{getInitials(otherUser?.name || '')}</AvatarFallback>
                        </Avatar>
                        {otherUser?.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{otherUser?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(conv.lastMessage?.createdAt || conv.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge variant="default" className="mt-1">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col">
              {!selectedConversation ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">Select a conversation to start messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.participants[0]?.avatar} />
                      <AvatarFallback>
                        {getInitials(selectedConversation.participants[0]?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedConversation.participants[0]?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.participants[0]?.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages?.data?.data?.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex gap-2',
                          msg.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg px-4 py-2',
                            msg.senderId === 'current-user-id'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">{formatDate(msg.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && messageText.trim()) {
                            // Send message
                            setMessageText('');
                          }
                        }}
                      />
                      <Button size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
