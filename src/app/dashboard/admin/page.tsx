'use client'
import Ticket from "~/app/_components/tickets/Ticket";
import { useUser } from "@clerk/nextjs";
import Loader from "~/app/_components/Loader";
import LoginRequired from "~/app/_components/unauthorized/loginToContinue";
import Unauthorized from "~/app/_components/unauthorized/unauthorized";



export default function AdminDashboard() {

    const { user, isLoaded, isSignedIn } = useUser();

    // below 3 if's are used to handle the loading state, unauthorized access, and user role verification
      // and the same is being used in all the dashboard pages
    
      if (!isLoaded) {
        return <div className="flex min-h-screen items-center justify-center">
          <Loader />
          <p className="text-gray-500 pl-5">Please wait, while we authorize you...</p>
        </div>;
      }
      if (isLoaded && !isSignedIn) {
        return <LoginRequired />;
      }
      if (user.publicMetadata.role !== 'admin') {
    
        console.log(user.publicMetadata.role);
    
        return <Unauthorized />;
      }


    return (
        <div className="flex flex-col items-center h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
            <p className="text-gray-600">This section will display admin specific content.</p>
            <div className="mt-6">
                <Ticket />
            </div>
        </div>
    );
};
