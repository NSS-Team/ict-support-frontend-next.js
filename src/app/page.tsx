'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, SignIn } from '@clerk/nextjs';
import Loader from '~/app/_components/Loader';
import { api } from '~/trpc/react';
import { useUserStatus } from '~/store/loginCheck';


export default function Home() {

  // Zustand store for login check
  const { setExist, setApproved } = useUserStatus();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const { data, isLoading } = api.auth.loginCheck.useQuery(undefined, { enabled: isLoaded && isSignedIn,});
  const responseData = data?.data;
  // Handle navigation based on loginCheck data
  useEffect(() => {
    
    if (data?.success) {
      const role = responseData?.role;
      if (responseData) {
        // if exists and not approved, redirect to complete profile
        if (!responseData.exist) {
          
          router.push('/complete-profile');
          setExist(false);
          setApproved(false);
        } else if (!responseData.approved) {
          setExist(true);
          setApproved(false);
          router.push('/complete-profile');
          
        }
        else if (responseData.approved) {
          setExist(true);
          setApproved(true);
          // Redirect based on role
          if (role === 'admin') {
            router.push('/dashboard/admin');
          }
          else if (role === 'manager') {
            router.push('/dashboard/manager');
          }
          else if (role === 'employee') {
            router.push('/dashboard/employee');
          }
          else if (role === 'worker') {
            router.push('/dashboard/worker');
          } 
          else {
            console.error('Unknown role:', role);
            // Optionally handle unknown roles
          }
        }
      }
    }
  }, [data, responseData, router, setApproved, setExist]);



  if (!isLoaded || isLoading) {
    return (
      <div className="main bg-white h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isSignedIn || (!responseData?.approved && responseData?.exist && !data?.success)) {
  // Shows SignIn only if not signed in or loginCheck hasn't succeeded
  return (
    <div className="main bg-white h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="signInContainer m-auto">
        <SignIn routing="hash" />
        {/* <AuthModal open={true} onOpenChange={() => {}} /> */}
        {/* <CustomAuthForm /> */}
      </div>
    </div>
  );
}

  return null;
}
