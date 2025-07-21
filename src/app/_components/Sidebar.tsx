'use client';

import { Home, Users, UserPlus, UserCircle, LogOut, Plus, Router } from 'lucide-react';
import '~/styles/globals.css';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';




const Sidebar = () => {

  const { signOut } = useClerk();
  const Router = useRouter();

  const navItems = [
    {
      name: 'New Complaint',
      icon: Plus,
      color: 'blue',
      size: 20,
      onClick: () => 
        {
          Router.push('/newTicket');
        },
    },
    {
      name: 'Complaints',
      icon: Home,
      color: 'black',
      size: 20,
      onClick: () => {
        Router.push('/dashboard/employee');
      },
    },
    {
      name: 'Teams',
      icon: Users,
      color: 'black',
      size: 20,
      onClick: () => console.log('Teams clicked'),
    },
    {
      name: 'Registrations',
      icon: UserPlus,
      color: 'black',
      size: 20,
      onClick: () => console.log('Registrations clicked'),
    },
    {
      name: 'My Account',
      icon: UserCircle,
      color: 'black',
      size: 20,
      onClick: () => console.log('My Account clicked'),
    },
    {
      name: 'Logout',
      icon: LogOut,
      color: '#EF4444',
      size: 20,
      red: true,
      onClick: async () => {
        await signOut();
      Router.replace('/');
        },
    },
  ];

  return (
    <aside className="group w-15 pl-3 pt-6 hover:w-64 bg-white h-min flex flex-col transition-all duration-300">
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(({ name, icon: Icon, color, size, red, onClick }) => (
          <button
            key={name}
            onClick={onClick}
            className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${red ? 'text-red-500' : 'text-gray-800 hover:bg-gray-200'
              }`}
          >
            <Icon
              className="flex-shrink-0 transition-transform duration-300"
              size={size}
              color={color}
            />
            <span className="whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
              {name}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
