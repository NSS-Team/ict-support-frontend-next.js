'use client'
import Ticket from "~/app/_components/tickets/Ticket";


export default function AdminDashboard() {
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
