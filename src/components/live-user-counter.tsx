
'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export function LiveUserCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // In a real app, you'd fetch this. For now, simulate it.
    const finalCount = 1337;
    let start = 0;
    const duration = 2000; // 2 seconds
    const incrementTime = 10; // update every 10ms
    const totalIncrements = duration / incrementTime;
    const increment = finalCount / totalIncrements;

    const timer = setInterval(() => {
      start += increment;
      if (start >= finalCount) {
        setCount(finalCount);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 shadow-sm">
      <Users className="h-5 w-5 text-primary" />
      <p className="font-medium text-muted-foreground">
        Join <span className="font-bold text-foreground">{count.toLocaleString()}</span> Students
      </p>
    </div>
  );
}
