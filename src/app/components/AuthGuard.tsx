'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('token=authenticated');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}