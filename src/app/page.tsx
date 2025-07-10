'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, SignIn } from '@clerk/nextjs';
import Loader from '~/app/_components/Loader';
import { api } from '~/trpc/react';
import type { AppRouter } from '~/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';


type LoginCheckResponse = inferRouterOutputs<AppRouter>['auth']['loginCheck'];

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

const { data, isLoading } = api.auth.loginCheck.useQuery(undefined, {
  enabled: isLoaded && isSignedIn,
});

// Handle navigation based on loginCheck data
  useEffect(() => {
  if (data) {
    if (!data.exist) {
      router.push('/complete-profile');
    } else if (!data.approved) {
      router.push('/approval-pending');
    } else {
      router.push('/dashboard');
    }
  }
}, [data, router]);



  if (!isLoaded || isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="main bg-white h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="signInContainer m-auto">
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  return null;
}
