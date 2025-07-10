'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Loader from '~/app/_components/Loader';
import Sidebar from '~/app/_components/Sidebar';
import ComplaintCard from '~/app/_components/ComplaintCard';
import ComplaintTabs from '~/app/_components/DashboardTabs';
import '~/styles/globals.css';

const ComplaintPage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
      return (<div className="h-screen w-screen flex items-center justify-center">
      <Loader />
    </div>);
    }


  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <main className="flex-1 bg-white p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-black mb-4">COMPLAINT SYSTEM</h1>
        <ComplaintTabs />
        <div className="space-y-4 mt-4">
          <ComplaintCard />
          <ComplaintCard />
          <ComplaintCard />
        </div>
      </main>
    </div>
  );
};

export default ComplaintPage;
