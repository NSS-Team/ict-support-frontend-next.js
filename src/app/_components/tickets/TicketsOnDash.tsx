import Ticket from "./Ticket";
import TicketCategoryTabs from "./TIcketCategoryTabs";

const TicketsOnDash = () => {
    return (
        <div className="flex flex-col items-center h-full">
            <TicketCategoryTabs/>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tickets on Dashboard</h2>
            <p className="text-gray-600">This section will display tickets assigned to you.</p>
            <div className="mt-6">
                <Ticket />
            </div>
        </div>
    );
};
export default TicketsOnDash;