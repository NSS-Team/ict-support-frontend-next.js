'use client'

import { useSecurityCodes } from "~/hooks/securityCodes";
import React, { useState } from "react";
import '~/styles/globals.css';
import Loader from '~/app/_components/Loader';
import Sidebar from '~/app/_components/Sidebar';
import { api } from '~/trpc/react';
import SecurityCodeHandler from "~/app/_components/securityCodes/SecurityCodesPopupHandler";
import TicketsOnDash from "~/app/_components/tickets/TicketsOnDash";

export default function EmployeePage() {
  const { showModal, setShowModal, isError, codes, retry, userLoaded,
  } = useSecurityCodes();
  const [showNewTicketModal, setShowTicketModal] = useState(true);


  // here we will make an api call to get the complaints created by the employee
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = api.dash.getComplainsEmp.useQuery();

  if (!userLoaded) {
    return <div className="flex min-h-screen items-center justify-center">
      <Loader />
    </div>;
  }
  return (
    <div className="flex min-h-screen w-screen">
      <Sidebar />
      <SecurityCodeHandler
        showModal={showModal}
        setShowModal={setShowModal}
        codes={codes}
        isError={isError}
        retry={retry}
      />

      <main className="flex-1 bg-white overflow-y-hidden mr-auto ml-auto">

        {/* this is where the tickets will be displayed, this component has the tabs and the ticket cards */}
        <TicketsOnDash tickets={tickets?.data} isLoading={ticketsLoading} error={ticketsError ? ticketsError.message : undefined} />

      </main>
    </div>
  );
};
