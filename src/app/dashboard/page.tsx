'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';
import Loader from '~/app/_components/Loader';
import Sidebar from '~/app/_components/Sidebar';
import ComplaintCard from '~/app/_components/tickets/Ticket';
import ComplaintTabs from '~/app/_components/tickets/TIcketCategoryTabs';
import SecurityCodesModal from '~/app/_components/securityCodes/SecurityCodesModal';
import { api } from '~/trpc/react';
import '~/styles/globals.css';

const ComplaintPage = () => {
  const { user, isLoaded: userLoaded } = useUser();
  // Use a ref to track if we've already fetched codes
  // the reason why we are using a ref is to avoid re-fetching codes on every render
  // this will ensure that the codes are fetched only once when the user is visiting the dashboard
  const hasFetchedRef = useRef(false);
  const [codes, setCodes] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
    // fetching the 'codes'(boolean) from user public metadata
  const codesMetadata = Number(user?.publicMetadata?.codes ?? -1);
  console.log(user?.publicMetadata);
  // Check if we should trigger the mutation
  // This will be true if the user is loaded, has a valid user object, and codes metadata is 0
  const shouldTrigger = userLoaded && !!user && codesMetadata === 0;
  // which dashboard to render : for this we will check the role of the user from the public metadata
  const userRole = user?.publicMetadata?.role;
  console.log('User Role:', userRole);

  // creating a mutation to generate security codes
  const {
    mutate: generateCodes,
    isError,
    reset,
  } = api.auth.generateCodes.useMutation({
    onSuccess: (res) => {
      const newCodes = res.data?.codes ?? [];
      setCodes(newCodes);
      console.log('✅ Generated Codes:', newCodes);
    },
    onError: (err) => {
      console.error('❌ Failed to generate codes:', err);
    },
  });




  useEffect(() => {
    if (shouldTrigger && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      setShowModal(true);
      generateCodes(); // Trigger mutation
    }
  }, [shouldTrigger, generateCodes]);

  const retry = () => {
    hasFetchedRef.current = false;
    reset(); // Reset mutation state
  };

  // show the loader until the user data is loaded
  if (!userLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // const contentDashBoard = () => {
  //   switch (userRole) {
  //     case 'admin':
  //       return <AdminDashboard />;
  //     case 'employee':
  //       return <EmployeeDashboard />;
  //     case 'worker':
  //       return <WorkerDashboard />;
  //     case 'manager':
  //       return <ManagerDashboard />;        
  //     default:
  //       return <div>Default Dashboard Content</div>;
  //   }
  // };

  return (
    <div className="flex h-screen w-screen">
      {/* will show the modal if the user is visiting the dashboard page for the first time */}
      {showModal && (
        <SecurityCodesModal
          codes={codes}
          onClose={() => { setShowModal(false); reset(); }}
        />
      )}
      {/* Show error modal if there was an error generating codes */}
      {showModal && isError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
            <p className="text-gray-700 mb-4">Failed to generate security codes. Please try again.</p>
            <button
              onClick={retry}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <Sidebar />
      <main className="flex-1 bg-white p-6 overflow-y-auto">
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
