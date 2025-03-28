'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.push('/student')}>student</button>;
      <button onClick={() => router.push('/professor')}>professor</button>
    </div>
  );
}
