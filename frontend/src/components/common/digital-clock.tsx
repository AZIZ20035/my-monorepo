'use client';

import { useState, useEffect } from 'react';

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-1 bg-[var(--secondary)] rounded-xl border border-[var(--border)] hidden md:flex">
      <div className="text-lg font-bold text-[var(--foreground)] tabular-nums tracking-wider font-mono">
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </div>
      <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest">
        {time.toLocaleDateString('en-GB')}
      </div>
    </div>
  );
}
