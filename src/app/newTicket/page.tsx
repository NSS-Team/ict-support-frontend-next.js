'use client';

import { useEffect } from 'react';
import Sidebar from '../_components/Sidebar';
import { api } from '~/trpc/react';

export default function NewTicket() {
  const { data: ticketCategories, isLoading, error } =
    api.complaints.getCategories.useQuery();

  useEffect(() => {
    const cached = localStorage.getItem('ticketCategories');

    // Only cache if data is available and not already cached
    if (!cached && ticketCategories) {
      localStorage.setItem(
        'ticketCategories',
        JSON.stringify(ticketCategories)
      );
      console.log('Fetched and cached categories:', ticketCategories);
    }

    if (cached) {
      const parsed = JSON.parse(cached);
      console.log('Loaded categories from cache:', parsed);
    }
  }, [ticketCategories]);

  return (
    <>
      <Sidebar />

      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">New Ticket</h1>
        <p className="text-gray-600">This page is under construction.</p>
        <p className="text-gray-600">Please check back later.</p>
      </div>
    </>
  );
}
