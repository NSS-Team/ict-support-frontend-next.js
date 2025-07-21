'use client';

// this component contains the <TicketCategoryTabs> and <Ticket> components

import Ticket from "./Ticket";
import TicketCategoryTabs from "./TIcketCategoryTabs";
import type { ticket } from "~/types/tickets/ticket";
import TicketSkeleton from "./TicketSkeletonLoading";
import { useRouter } from "next/navigation";

interface TicketsOnDashProps {
    tickets?: ticket[]; 
    isLoading?: boolean;
    error?: string;
}


const TicketsOnDash = ({ tickets, isLoading, error }: TicketsOnDashProps) => {

    const Router = useRouter();
    return (
        <div className="flex flex-col items-center h-full mx-10">
            <TicketCategoryTabs/>

        {/* if the data is not loaded yet then we will show the skeleton loader */}
        {isLoading && (
            <div className="w-full max-w-6xl p-4">
                <TicketSkeleton />
                <TicketSkeleton />
            </div>
        )}

        {/* if the data has been loaded then we will map that array to ticket */}
        {!isLoading && (tickets?.length ?? 0) > 0 ? (
            tickets!.map((ticket) => (
                <div className="relative w-full max-w-6xl mx-auto" key={ticket.id} >
                    <Ticket ticket={ticket} />
                </div>
            ))
        ) : (
            <div>No tickets found</div> 
        )}
        </div>
    );
};
export default TicketsOnDash;