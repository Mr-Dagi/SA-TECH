import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;

    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 240);
        frameId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-blue text-white shadow-xl shadow-accent-blue/20 transition hover:-translate-y-1 hover:bg-accent-blue/90 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:ring-offset-2 focus:ring-offset-transparent"
      aria-label="Back to top"
    >
      <ArrowUp size={24} aria-hidden="true" />
    </button>
  );
};
