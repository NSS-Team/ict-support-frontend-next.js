'use client';

import { Home, Users, UserPlus, UserCircle, LogOut, Plus } from 'lucide-react';
import '~/styles/globals.css';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const navItems = [
    {
      name: 'New Complaint',
      icon: Plus,
      color: 'blue',
      size: 20,
      onClick: () => {
        router.push('/newTicket');
      },
    },
    {
      name: 'Complaints',
      icon: Home,
      color: 'black',
      size: 20,
      onClick: () => {
        router.push('/dashboard/employee');
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
        router.replace('/');
      },
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex group w-15 pl-3 pt-6 hover:w-64 bg-white h-screen flex-col transition-all duration-300 border-r border-gray-200">
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map(({ name, icon: Icon, color, size, red, onClick }) => (
            <button
              key={name}
              onClick={onClick}
              className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                red ? 'text-red-500 hover:bg-red-50' : 'text-gray-800 hover:bg-gray-200'
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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-screen-sm mx-auto">
          {navItems.map(({ name, icon: Icon, color, size, red, onClick }) => (
            <button
              key={name}
              onClick={onClick}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 ${
                red ? 'text-red-500' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon
                className="mb-1"
                size={size}
                color={color}
              />
              <span className={`text-xs font-medium truncate ${
                red ? 'text-red-500' : 'text-gray-600'
              }`}>
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Padding - Add this to your main content to prevent overlap */}
      <div className="md:hidden h-20" />
    </>
  );
};

export default Sidebar;