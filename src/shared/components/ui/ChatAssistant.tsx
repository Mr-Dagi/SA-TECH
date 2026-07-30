import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X, Send, ArrowUpRight } from 'lucide-react';

const STORAGE_KEY = 'assistant-position';
const CHAT_STATE_KEY = 'assistant-open';

const sanitizeText = (text: string) => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r|\n/g, ' ')
    .trim();
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getLocalAssistantReply = (question: string) => {
  const normalized = question.toLowerCase();

  if (normalized.includes('contact') || normalized.includes('email') || normalized.includes('phone') || normalized.includes('reach')) {
    return 'You can reach me at dagia2061@gmail.com or +251-996-881-232. The contact page also has a form if you want to send a message directly.';
  }

  if (normalized.includes('project') || normalized.includes('portfolio') || normalized.includes('work')) {
    return 'This portfolio highlights selected projects, services, and a short introduction to my background. The Projects page is the best place to see examples of my work.';
  }

  if (normalized.includes('service') || normalized.includes('services')) {
    return 'I work across web development, app development, UI/UX design, cloud infrastructure, and AI automation. The Home page summarizes the main services.';
  }

  if (normalized.includes('about') || normalized.includes('who')) {
    return 'I am a product designer and full-stack developer focused on building polished digital products with strong user experience and reliable implementation.';
  }

  if (normalized.includes('blog')) {
    return 'You can browse the blog section for articles about web development, design, and modern product work.';
  }

  if (normalized.includes('hello') || normalized.includes('hi') || normalized.includes('thanks')) {
    return 'Hello! I can help you explore the site, explain the services, point you to the contact details, or guide you to the projects and blog.';
  }

  return 'I can help you navigate the site and answer simple questions about services, projects, contact details, and the about page. Try asking something like “What services do you offer?”';
};

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; initX: number; initY: number } | null>(null);
  const [position, setPosition] = useState({ x: 24, y: window.innerHeight - 180 });
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Hi there! I am Chuna, your AI chatbot assistant. I can help you explore the website, explain pages, answer FAQs, and guide you to contact options.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const FALLBACK_RESPONSE = 'Our assistant is temporarily offline. Please use the contact page or email for immediate support.';

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.x != null && parsed?.y != null) {
          setPosition({ x: Number(parsed.x), y: Number(parsed.y) });
        }
      } catch {
        // ignore invalid storage content
      }
    }
    const savedOpen = window.localStorage.getItem(CHAT_STATE_KEY);
    if (savedOpen === 'true') {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CHAT_STATE_KEY, String(open));
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => ({ x: clamp(current.x, 16, window.innerWidth - 340), y: clamp(current.y, 16, window.innerHeight - 520) }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!dragging) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    }
  }, [dragging, position]);

  const savePosition = (nextPosition: { x: number; y: number }) => {
    setPosition(nextPosition);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPosition));
  };

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    const startX = event.clientX;
    const startY = event.clientY;
    setDragStart({ x: startX, y: startY, initX: position.x, initY: position.y });
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !dragStart) return;
    const nextX = clamp(dragStart.initX + event.clientX - dragStart.x, 16, window.innerWidth - 340);
    const nextY = clamp(dragStart.initY + event.clientY - dragStart.y, 16, window.innerHeight - 520);
    savePosition({ x: nextX, y: nextY });
  };

  const handleDragEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    setDragStart(null);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const addMessage = (role: 'user' | 'assistant', text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setError('Please type a question before sending.');
      return;
    }

    setError(null);
    setNotice(null);
    const safeQuestion = sanitizeText(trimmed).slice(0, 400);
    setQuestion('');
    addMessage('user', safeQuestion);
    setLoading(true);

    try {
      const localReply = getLocalAssistantReply(safeQuestion);
      const text = sanitizeText(localReply);
      addMessage('assistant', text);
      setNotice('The assistant is running in local fallback mode because no external AI backend is configured.');
    } catch (err) {
      setError('Unable to generate a response right now. Please try again later.');
      addMessage('assistant', FALLBACK_RESPONSE);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = () => setOpen((current) => !current);

  const messageList = useMemo(
    () => messages.map((message, index) => (
      <div
        key={`${message.role}-${index}`}
        className={`rounded-3xl p-4 ${message.role === 'assistant' ? 'bg-accent-blue/10 text-primary dark:bg-slate-900 dark:text-white' : 'bg-secondary border border-color text-secondary dark:bg-slate-900 dark:text-white dark:border-slate-700'}`}>
        <div className="text-xs uppercase tracking-[0.24em] font-semibold text-tertiary dark:text-slate-400 mb-2">
          {message.role === 'assistant' ? 'Assistant' : 'You'}
        </div>
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>
    )),
    [messages]
  );

  return (
    <div
      className="fixed z-50"
      style={{ left: position.x, top: position.y, touchAction: 'none' }}>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22 }}
            className="flex max-h-[min(82vh,560px)] w-[320px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[32px] border border-color bg-secondary shadow-[0_22px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950"
          >
            <div
              className="flex shrink-0 cursor-grab items-center justify-between rounded-t-[32px] bg-accent-blue px-4 py-3 text-white"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleOpen();
                }
              }}
              aria-label="Drag assistant window"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Chuna — Chatbot Assistant</p>
                  <p className="text-[11px] text-white/80">Hover for help or drag to reposition. Click the close button when finished.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleOpen();
                }}
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close assistant window"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden rounded-b-[32px] bg-gradient-to-b from-white to-slate-50 p-4 dark:from-slate-900 dark:to-slate-950">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 pb-2">
                {messageList}
              </div>

              <form onSubmit={handleSend} className="mt-4 shrink-0 space-y-3">
                <label htmlFor="assistant-input" className="sr-only">
                  Ask a question
                </label>
                <textarea
                  id="assistant-input"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  rows={3}
                  maxLength={400}
                  className="w-full resize-none rounded-3xl border border-color bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 dark:bg-slate-900 dark:text-white dark:border-slate-700 dark:placeholder:text-slate-400"
                  placeholder="Ask me anything about the website, services, or how to get started..."
                  aria-label="Ask the assistant a question"
                />
                {notice && (
                  <div role="status" className="rounded-2xl border border-yellow-400/40 bg-yellow-50 px-3 py-2 text-sm text-yellow-900 dark:border-yellow-500/40 dark:bg-yellow-500/10 dark:text-yellow-200 max-h-24 overflow-auto">
                    <strong className="uppercase tracking-[0.16em]">Assistant offline:</strong>
                    <div className="mt-1 text-sm">{notice}</div>
                  </div>
                )}
                {error && <p className="text-sm text-accent-red">{error}</p>}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-3xl bg-accent-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-orange/90 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    <Send size={16} aria-hidden="true" />
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestion('')}
                    className="text-sm text-secondary transition hover:text-accent-blue dark:text-slate-300"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-blue text-white shadow-2xl shadow-accent-blue/30 transition focus:outline-none focus:ring-2 focus:ring-accent-orange"
            onClick={toggleOpen}
            aria-label="Open Chuna chatbot assistant"
            title="Open Chuna chatbot assistant"
          >
            <ArrowUpRight size={24} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatAssistant;
