'use client';

// this component contains the <TicketCategoryTabs> and <Ticket> components

import Ticket from "./Ticket";
import TicketCategoryTabs from "./TicketFilterBar";
import type { ticket } from "~/types/tickets/ticket";
import TicketSkeleton from "./TicketSkeletonLoading";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

interface TicketsOnDashProps {
    tickets?: ticket[]; 
    isLoading?: boolean;
}

interface FilterState {
    priority: string;
    status: string;
    date: string;
    search: string;
}


const TicketsOnDash = ({ tickets, isLoading}: TicketsOnDashProps) => {
    const Router = useRouter();
    
    // Filter state management
    const [filters, setFilters] = useState<FilterState>({
        priority: '',
        status: '',
        date: '',
        search: '',
    });

    // Filter function
    const filteredTickets = useMemo(() => {
        if (!tickets) return [];

        return tickets.filter((ticket) => {
            // Priority filter
            if (filters.priority && ticket.priority !== filters.priority) {
                return false;
            }

            // Status filter
            if (filters.status && ticket.status !== filters.status) {
                return false;
            }

            // Date filter (filter by creation date)
            if (filters.date) {
                const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0];
                if (ticketDate !== filters.date) {
                    return false;
                }
            }

            // Search filter (search in title, ID, employee name)
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const titleMatch = ticket.title.toLowerCase().includes(searchTerm);
                const idMatch = ticket.id.toString().includes(searchTerm);
                const employeeMatch = ticket.employeeName.toLowerCase().includes(searchTerm);
                const categoryMatch = ticket.categoryName.toLowerCase().includes(searchTerm);
                const subCategoryMatch = ticket.subCategoryName.toLowerCase().includes(searchTerm);
                
                if (!titleMatch && !idMatch && !employeeMatch && !categoryMatch && !subCategoryMatch) {
                    return false;
                }
            }

            return true;
        });
    }, [tickets, filters]);

    // Handle filter changes
    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    return (
        <div className="flex flex-col items-center h-full mx-10 pt-6">
            <TicketCategoryTabs onFiltersChange={handleFiltersChange} />

        {/* if the data is not loaded yet then we will show the skeleton loader */}
        {isLoading && (
            <div className="w-full max-w-6xl p-4">
                <TicketSkeleton />
                <TicketSkeleton />
            </div>
        )}

        {/* if the data has been loaded then we will map that array to ticket */}
        {!isLoading && (filteredTickets?.length ?? 0) > 0 ? (
            filteredTickets!.map((ticket) => (
                <div className="relative w-full max-w-6xl mx-auto" key={ticket.id} >
                    <Ticket ticket={ticket} />
                </div>
            ))
        ) : (
            !isLoading && (
                <div className="w-full max-w-6xl mx-auto p-8 text-center">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-600 text-lg">
                            {(tickets?.length ?? 0) === 0 
                                ? "No tickets found" 
                                : "No tickets match the current filters"
                            }
                        </p>
                        {(tickets?.length ?? 0) > 0 && Object.values(filters).some(value => value !== '') && (
                            <button
                                onClick={() => setFilters({ priority: '', status: '', date: '', search: '' })}
                                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            )
        )}
        </div>
    );
};
export default TicketsOnDash;