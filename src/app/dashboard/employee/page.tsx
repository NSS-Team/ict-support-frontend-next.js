'use client'

import { useSecurityCodes } from "~/hooks/securityCodes";
import { useUser } from "@clerk/nextjs";
import React from "react";
import '~/styles/globals.css';
import Loader from '~/app/_components/Loader';
import Sidebar from '~/app/_components/Sidebar';
import { api } from '~/trpc/react';
import SecurityCodeHandler from "~/app/_components/securityCodes/SecurityCodesPopupHandler";
import ComplaintTabs from '~/app/_components/tickets/TIcketCategoryTabs';
import ComplaintCard from "~/app/_components/tickets/Ticket";
import TicketsOncDash from "~/app/_components/tickets/TicketsOnDash";
import TicketsOnDash from "~/app/_components/tickets/TicketsOnDash";

export default function EmployeePage() {
    const {
    showModal,
    setShowModal,
    isError,
    codes,
    retry,
    userLoaded,
  } = useSecurityCodes();


  return (
    <div className="flex h-screen w-screen">
    <Sidebar />
    <SecurityCodeHandler
      showModal={showModal}
      setShowModal={setShowModal}
      codes={codes}
      isError={isError}
      retry={retry}
    />
    <main className="flex-1 bg-white p-6 overflow-y-auto">
        <TicketsOnDash />

      </main>
    </div>
  );
};
