import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChatMessage, Room, FurnitureItem, DoorItem } from '@/types/editor';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface Props {
  rooms?: Room[];
  furniture?: FurnitureItem[];
  doors?: DoorItem[];
}

function buildLayoutContext(rooms: Room[], furniture: FurnitureItem[], doors: DoorItem[]): string {
  if (rooms.length === 0 && furniture.length === 0) return '';
  const lines: string[] = [];
  lines.push(`Rooms (${rooms.length}):`);
  rooms.forEach(r => {
    const w = (r.width / 50 * 1.5).toFixed(1);
    const h = (r.height / 50 * 1.5).toFixed(1);
    lines.push(`  - ${r.name}: ${w}m × ${h}m`);
  });
  lines.push(`Doors: ${doors.length}`);
  lines.push(`Furniture (${furniture.length}):`);
  furniture.forEach(f => lines.push(`  - ${f.label} at (${f.x}, ${f.y})`));
  const totalArea = rooms.reduce((s, r) => s + r.width * r.height, 0);
  const furnArea = furniture.reduce((s, f) => s + f.width * f.height, 0);
  if (totalArea > 0) lines.push(`Furniture density: ${((furnArea / totalArea) * 100).toFixed(1)}%`);
  return lines.join('\n');
}

export default function AIChatWidget({ rooms = [], furniture = [], doors = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: "I'm FloorWise AI — your spatial design assistant. Ask me about your layout, furniture placement, circulation, or any design question!" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const apiMessages = [...messages.filter(m => m.id !== '0'), userMsg].map(m => ({
      role: m.role, content: m.content,
    }));

    let assistantContent = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          layoutContext: buildLayoutContext(rooms, furniture, doors),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'AI service unavailable' }));
        throw new Error(err.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error('No response stream');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && last.id.startsWith('stream-')) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { id: `stream-${Date.now()}`, role: 'assistant', content: assistantContent }];
              });
            }
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Something went wrong';
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: `Sorry, I couldn't respond: ${errMsg}. Try again or ask about general design tips!` }]);
    }
    setIsTyping(false);
  }, [input, messages, isTyping, rooms, furniture, doors]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse-ring" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 w-[90vw] max-w-96 h-[70vh] max-h-[500px] glass-card flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="gradient-primary p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-foreground">FloorWise AI</div>
                  <div className="text-xs text-accent/70">Powered by AI</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-secondary/30">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'gradient-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && !messages.some(m => m.id.startsWith('stream-')) && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t flex gap-2 flex-shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your layout..."
                className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm outline-none focus:ring-2 focus:ring-secondary/50"
              />
              <Button variant="default" size="icon" onClick={sendMessage} disabled={!input.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
