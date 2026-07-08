'use client';

import { useEffect, useRef } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

/** True when a reCAPTCHA site key is configured at build time. */
export const RECAPTCHA_ENABLED = !!SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => number;
      reset: (id?: number) => void;
    };
  }
}

/**
 * Google reCAPTCHA v2 ("I'm not a robot") checkbox — dependency-free explicit
 * render. Renders nothing when no site key is configured, so the site keeps
 * working before keys are added. Calls `onChange` with the token (or null when
 * it expires / errors).
 */
export function Recaptcha({ onChange }: { onChange: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const cbRef = useRef(onChange);
  cbRef.current = onChange;

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !window.grecaptcha || !containerRef.current || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => cbRef.current(token),
        'expired-callback': () => cbRef.current(null),
        'error-callback': () => cbRef.current(null),
      });
    };

    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      renderWidget();
      return () => { cancelled = true; };
    }

    const SCRIPT_ID = 'recaptcha-api';
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    const poll = setInterval(() => {
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        clearInterval(poll);
        renderWidget();
      }
    }, 200);
    return () => { cancelled = true; clearInterval(poll); };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className="flex justify-center sm:justify-start" />;
}
