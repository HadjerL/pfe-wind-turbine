'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); // or whatever key you use

    if (!token) {
      router.push('/login');  // redirect to login if no token
    }
  }, [router]);

  return <>{children}</>; // render children if token exists (auth passed)
}
