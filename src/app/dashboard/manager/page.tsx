'use client'

import { useSecurityCodes } from "~/hooks/securityCodes";
import React, { useState } from "react";
import '~/styles/globals.css';
import Loader from '~/app/_components/Loader';
import Sidebar from '~/app/_components/Sidebar';
import { api } from '~/trpc/react';
import SecurityCodeHandler from "~/app/_components/securityCodes/SecurityCodesPopupHandler";
import TicketsOnDash from "~/app/_components/tickets/TicketsOnDash";
import { useUser } from "@clerk/nextjs";

export default function ManagerPage() {
  const { showModal, setShowModal, isError, codes, retry, userLoaded,
  } = useSecurityCodes();
  
//   calling the login-check api to verify if the user is logged in and has the right permissions
//   const { data: loginData, isLoading: loginLoading, error: loginError } = api.auth.loginCheck.useQuery();
    // here we will make an api call to get the complaints created by the employee
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = api.managerDash.getTeamComplaints.useQuery();


//   this verifies if the user has the right permissions to access this page
  const { user } = useUser();
    if (!userLoaded) {
    return <div className="flex min-h-screen items-center justify-center">
      <Loader />
      <p className="text-gray-500 pl-5">Please wait, while we authorize you...</p>
    </div>;
    }

    if(!user) {
        return <div className="flex h-screen items-center justify-center bg-black">
            <div className="justify-center items-center text-center p-20">
            <p className="text-white text-xl font-bold ">Error | user not found</p>
            </div>
        </div>;
    }

    if(user.publicMetadata.role !== 'manager') {
        return <div className="flex h-screen items-center justify-center bg-black">
            <div className="justify-center items-center text-center p-20">
            <p className="text-white text-xl font-bold ">Unauthorized | You do not have permission to access this page.</p>
            </div>
        </div>;
    }




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
