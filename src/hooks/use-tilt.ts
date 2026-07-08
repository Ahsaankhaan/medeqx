'use client';

import { useRef, useCallback } from 'react';

export function useTilt(maxTilt = 12) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || window.matchMedia('(hover:none),(pointer:coarse)').matches) return;

      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      const rotX = (-dy * maxTilt).toFixed(2);
      const rotY = (dx * maxTilt).toFixed(2);

      el.style.transition = 'transform 0.08s linear';
      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1)`;

      const imgEl = el.querySelector<HTMLElement>('.tilt-image');
      if (imgEl) {
        imgEl.style.transition = 'transform 0.08s linear';
        imgEl.style.transform = `translateZ(35px) translate(${dx * -8}px, ${dy * -8}px)`;
      }
    },
    [maxTilt]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.65s cubic-bezier(0.23,1,0.32,1)';
    el.style.transform = '';

    const imgEl = el.querySelector<HTMLElement>('.tilt-image');
    if (imgEl) {
      imgEl.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      imgEl.style.transform = 'translateZ(0px)';
    }
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
