'use client';
import { useToast } from './_components/ToastProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, SignIn } from '@clerk/nextjs';
import Loader from '~/app/_components/Loader';
import { api } from '~/trpc/react';


export default function Home() {
  const { addToast } = useToast();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const { data, isLoading } = api.auth.loginCheck.useQuery(undefined, { enabled: isLoaded && isSignedIn,});
  const responseData = data?.data;
  // Handle navigation based on loginCheck data
  useEffect(() => {
    if (data?.success) {
      if (responseData) {
        // if exists and not approved, redirect to complete profile
        if (!responseData.exist) {
          router.push('/complete-profile');
        } else if (!responseData.approved) {
          router.push('/complete-profile');
          addToast('Your account is not approved yet.');
        }
        else if (responseData.approved) {
          router.push('/dashboard');
        }
      }
    }
  }, [data, router]);



  if (!isLoaded || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center mx-auto">
        <Loader />
      </div>
    );
  }

  if (!isSignedIn || ( !responseData?.approved && responseData?.exist)) {
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
