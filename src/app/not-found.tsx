
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Frown } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 5000);

    // Cleanup timers on component unmount
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <div className="space-y-4">
        <Frown className="mx-auto h-24 w-24 text-primary" />
        <h1 className="text-6xl font-extrabold text-primary font-headline">404</h1>
        <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          Sorry, the page you are looking for does not exist or has been moved.
          You will be redirected to the homepage shortly.
        </p>
        <div className="text-lg font-medium text-accent">
          Redirecting in {countdown}...
        </div>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage Now
          </Link>
        </Button>
      </div>
    </div>
  );
}
