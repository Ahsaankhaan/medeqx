'use client';

import { useEffect, useRef } from 'react';

const EQUIPMENT = [
  { src: '/equipment/sterilizer.jpg',  label: 'Sterilization'      },
  { src: '/equipment/analyzer.jpg',    label: 'Laboratory'         },
  { src: '/equipment/ultrasound.jpg',  label: 'Diagnostic Imaging' },
  { src: '/equipment/xray.jpg',        label: 'X-Ray Systems'      },
];

const COUNT  = EQUIPMENT.length;
const RX     = 190;    // horizontal orbit radius (px)
const RY     = 68;     // vertical orbit radius — controls ellipse depth
const PERIOD = 20000;  // ms per full revolution

export function OrbitalImages() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const t0       = useRef(Date.now());

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const items = Array.from(stage.querySelectorAll<HTMLDivElement>('.orb-item'));

    const tick = () => {
      const angle0 = ((Date.now() - t0.current) / PERIOD) * Math.PI * 2;

      items.forEach((el, i) => {
        const a = angle0 + (i / COUNT) * Math.PI * 2;
        const x = Math.sin(a) * RX;
        const y = -Math.cos(a) * RY;          // top = farther, bottom = nearer
        const depth = (1 - Math.cos(a)) / 2;  // 0 = back, 1 = front
        const scale  = 0.50 + 0.85 * depth;   // 0.50 (back) → 1.35 (front)
        const opac   = 0.38 + 0.62 * depth;   // 0.38 (back) → 1.00 (front)

        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        el.style.opacity   = opac.toFixed(2);
        el.style.zIndex    = String(Math.round(depth * 20));
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="orb3-scene" aria-hidden="true">
      {/* Ambient glow beneath the orbit */}
      <div className="orb3-glow" />
      {/* Decorative orbit ring */}
      <div className="orb3-ring" />
      {/* JS-driven item stage */}
      <div ref={stageRef} className="orb3-stage">
        {EQUIPMENT.map((item, i) => (
          <div key={i} className="orb-item">
            <div className="orb3-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.label}
                className="orb3-img"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="orb3-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
