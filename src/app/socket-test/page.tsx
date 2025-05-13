'use client';

import useValueListener from '@/hooks/useValueListener';

export default function Home() {
  const counter = useValueListener<number>('counter');

  return (
    <div>
      <p>Current counter: {counter ?? 'Not connected yet...'}</p>
    </div>
  );
}
