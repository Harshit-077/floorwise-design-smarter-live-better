import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChatMessage } from '@/types/editor';

const MOCK_RESPONSES: Record<string, string> = {
  default: "I'm FloorWise AI — your spatial design assistant. I can help you with layout advice, furniture placement, room sizing, and explain design principles. What would you like to know?",
  circulation: "Good circulation means maintaining at least 90cm (3ft) clearance in walkways. In your layout, ensure doors don't clash and there's a clear path between rooms. The kitchen work triangle (sink-stove-fridge) should total 4-8 meters.",
  furniture: "When placing furniture, consider the room's focal point. In living rooms, arrange seating to face the TV or fireplace. Keep 45cm between coffee table and sofa. Allow 60cm behind dining chairs for movement.",
  bedroom: "A standard double bed needs a room at least 3m × 3.5m. Leave 60cm on each side for access. The bed should ideally face the door but not be directly in front of it. Natural light from the side is optimal.",
  kitchen: "The kitchen work triangle (sink, stove, fridge) should have sides between 1.2m and 2.7m each. Total perimeter should be 4-8m. Keep 1m of counter space on each side of the stove for prep work.",
  small: "For small spaces: use multi-functional furniture, mirrors to create depth, and vertical storage. Open shelving feels less heavy than closed cabinets. Light colors make rooms feel larger.",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('circulation') || lower.includes('walkway') || lower.includes('clearance')) return MOCK_RESPONSES.circulation;
  if (lower.includes('furniture') || lower.includes('sofa') || lower.includes('place')) return MOCK_RESPONSES.furniture;
  if (lower.includes('bedroom') || lower.includes('bed')) return MOCK_RESPONSES.bedroom;
  if (lower.includes('kitchen') || lower.includes('cook')) return MOCK_RESPONSES.kitchen;
  if (lower.includes('small') || lower.includes('tiny') || lower.includes('compact')) return MOCK_RESPONSES.small;
  return "That's a great question! For the best results, I recommend analyzing your current layout by clicking 'Analyze Layout' in the toolbar. I can then provide specific recommendations based on your room dimensions and furniture placement. Feel free to ask about circulation, furniture sizing, or specific room types!";
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: MOCK_RESPONSES.default },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(input);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse-ring" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] glass-card flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="gradient-primary p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-foreground">FloorWise AI</div>
                  <div className="text-xs text-accent/70">Spatial Design Assistant</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-secondary/30">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
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
              {isTyping && (
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

            {/* Input */}
            <div className="p-3 border-t flex gap-2 flex-shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your layout..."
                className="flex-1 px-3 py-2 bg-muted rounded-xl text-sm outline-none focus:ring-2 focus:ring-secondary/50"
              />
              <Button variant="default" size="icon" onClick={sendMessage} disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
