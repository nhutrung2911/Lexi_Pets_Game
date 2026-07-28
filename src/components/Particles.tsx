import { useEffect, useState } from 'react';

export function Particles() {
  const [particles, setParticles] = useState<Array<{id: number, left: string, size: string, duration: string, delay: string}>>([]);

  useEffect(() => {
    // Generate 25 random leaves/particles
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 120}%`, // Can start slightly off-screen right
      size: `${Math.random() * 8 + 4}px`, // 4px to 12px
      duration: `${Math.random() * 15 + 10}s`, // 10s to 25s
      delay: `${Math.random() * -20}s` // Negative delay so they are already on screen when loaded
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute top-[-10%] bg-green-400/40 rounded-full blur-[1px] shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-[wind-fall_linear_infinite]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay
          }}
        />
      ))}
    </div>
  );
}
