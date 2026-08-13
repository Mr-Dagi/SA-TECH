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

  if (normalized.includes('admin') || normalized.includes('login') || normalized.includes('/tlku')) {
    return 'The admin dashboard is restricted to authorized users only. For general questions, please use the public website and contact form.';
  }

  if (normalized.includes('security') || normalized.includes('password') || normalized.includes('api key') || normalized.includes('private')) {
    return 'For your security, please use only the official website contact methods. Do not share passwords, verification codes, admin credentials, or private account details in chat.';
  }

  if (normalized.includes('contact') || normalized.includes('email') || normalized.includes('phone') || normalized.includes('reach') || normalized.includes('hire')) {
    return 'You can contact SA teach startup through the contact form on the website or directly by email at dagia2061@gmail.com. You can also call +251-996-881-232. For project inquiries, the contact form is the best next step.';
  }

  if (normalized.includes('price') || normalized.includes('pricing') || normalized.includes('cost') || normalized.includes('estimate')) {
    return 'The website does not publish standard pricing. The cost depends on project scope, complexity, timeline, and requirements. The best way to get an estimate is to send your project details through the contact form or email.';
  }

  if (normalized.includes('project') || normalized.includes('portfolio') || normalized.includes('work') || normalized.includes('case study')) {
    return 'You can explore the portfolio on the Projects page. The site highlights examples such as an E-Commerce Platform, Task Management App, and Portfolio Website. Each project page includes more detail about the tools and purpose.';
  }

  if (normalized.includes('service') || normalized.includes('services') || normalized.includes('what do you do') || normalized.includes('offer')) {
    return 'SA teach startup offers web development, app development, AI and automation, branding and marketing, DevOps and cloud support, and consulting. The Home page and About page explain the services in more detail.';
  }

  if (normalized.includes('about') || normalized.includes('who is') || normalized.includes('who are you') || normalized.includes('dagmawi')) {
    return 'Dagmawi Alemayhu is presented as a product designer, digital creative director, and frontend/full-stack developer focused on modern, user-first digital experiences and business-friendly product design.';
  }

  if (normalized.includes('blog') || normalized.includes('article') || normalized.includes('write') || normalized.includes('content')) {
    return 'Yes, the website includes a blog section with technology, design, and development articles. You can read the latest posts on the Blog page and browse topics related to frontend work, product design, and digital trends.';
  }

  if (normalized.includes('website') || normalized.includes('this site') || normalized.includes('home') || normalized.includes('page')) {
    return 'This website is a portfolio and service site for SA teach startup. It helps visitors understand the brand, browse projects, read blog articles, and send project inquiries through the contact form.';
  }

  if (normalized.includes('design') || normalized.includes('ui') || normalized.includes('ux')) {
    return 'Yes, the brand strongly emphasizes product design, UI/UX, and user-first digital experiences. The site presents design thinking as part of the service offering alongside engineering and strategy.';
  }

  if (normalized.includes('thank') || normalized.includes('hello') || normalized.includes('hi') || normalized.includes('hey')) {
    return 'Hello! I can help with SA teach startup services, project examples, business information, blog content, and the official contact details.';
  }

  if (normalized.includes('location') || normalized.includes('addis')) {
    return 'The business is based in Addis Ababa, Ethiopia.';
  }

  if (normalized.includes('resume') || normalized.includes('cv') || normalized.includes('experience')) {
    return 'The portfolio presents Dagmawi Alemayhu as a product designer and digital creative director with experience in user-focused design, frontend development, and digital product work.';
  }

  if (normalized.includes('job') || normalized.includes('hiring') || normalized.includes('recruit') || normalized.includes('team')) {
    return 'For recruiting or partnership inquiries, please use the official contact form or email. The website is designed for business inquiries, services, and project discussions.';
  }

  return 'I can help with SA teach startup services, portfolio projects, blog content, business contact information, and general website guidance. For detailed project questions, the best next step is to use the contact form or email dagia2061@gmail.com.';
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
      text: 'Hello! I’m Dagmawi’s portfolio assistant. I can help you learn about his background, services, projects, and contact details.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const FALLBACK_RESPONSE = 'Sorry, I could not answer that right now. Please use the official contact form or email dagia2061@gmail.com for the fastest support.';

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
    const target = event.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }

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
    const safeQuestion = sanitizeText(trimmed).slice(0, 400);
    setQuestion('');
    addMessage('user', safeQuestion);
    setLoading(true);

    try {
      const localReply = getLocalAssistantReply(safeQuestion);
      const text = sanitizeText(localReply);
      addMessage('assistant', text);
    } catch (err) {
      setError('Sorry, I could not answer that right now. Please try again or use the official contact form.');
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
                  <p className="text-sm font-semibold">Dagmawi — Portfolio Assistant</p>
                  <p className="text-[11px] text-white/80">Ask about projects, skills, experience, or how to get in touch.</p>
                </div>
              </div>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
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
            aria-label="Open Dagmawi portfolio assistant"
            title="Open Dagmawi portfolio assistant"
          >
            <ArrowUpRight size={24} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatAssistant;
