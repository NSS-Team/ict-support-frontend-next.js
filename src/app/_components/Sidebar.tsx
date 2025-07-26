'use client';

import { Home, Users, UserPlus, UserCircle, LogOut, Plus, Menu, X } from 'lucide-react';
import '~/styles/globals.css';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { userRolesEnum } from '~/types/enums';
import { useState } from 'react';

const Sidebar = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const userRole =
    typeof user?.publicMetadata?.role === 'string'
      ? user.publicMetadata.role
      : 'user';
  const userRoles = userRolesEnum.options;

  const navItems = [
    {
      name: 'New Complaint',
      icon: Plus,
      color: 'blue',
      size: 20,
      onClick: () => {
        router.push('/newTicket');
        setIsExpanded(false); // Close sidebar on mobile after navigation
      },
      roles: ['employee'],
    },
    {
      name: 'Complaints',
      icon: Home,
      color: 'black',
      size: 20,
      onClick: () => {
        if(userRole === 'employee') {
          router.push('/dashboard/employee');
        } else if(userRole === 'worker') {
          router.push('/dashboard/worker');
        } else if(userRole === 'manager') {
          router.push('/dashboard/manager');
        } else if(userRole === 'admin') {
          router.push('/dashboard/admin');
        }
        setIsExpanded(false); // Close sidebar on mobile after navigation
      },
      roles: ['employee', 'worker', 'admin', 'manager'],
    },
    {
      name: 'Teams',
      icon: Users,
      color: 'black',
      size: 20,
      onClick: () => {
        console.log('Teams clicked');
        setIsExpanded(false);
      },
      roles: ['admin'],
    },
    {
      name: 'My Team',
      icon: Users,
      color: 'black',
      size: 20,
      onClick: () => {
        router.push('/MyTeam');
        setIsExpanded(false);
      },
      roles : ['manager']
    },
    {
      name: 'Registrations',
      icon: UserPlus,
      color: 'black',
      size: 20,
      onClick: () => {
        console.log('Registrations clicked');
        setIsExpanded(false);
      },
      roles: ['admin'],
    },
    {
      name: 'My Account',
      icon: UserCircle,
      color: 'black',
      size: 20,
      onClick: () => {
        router.push('/MyProfile');
        setIsExpanded(false);
      },
      roles: ['employee', 'worker', 'admin', 'manager'],
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
        setIsExpanded(false);
      },
      roles: ['employee', 'worker', 'admin', 'manager'],
    },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Hamburger Button - Fixed position */}
      {/* only display if the user is approved and not a guest */}
      {user && user?.publicMetadata?.role !== 'user' && (
        <div>
      <button
        onClick={toggleSidebar}
        className="hidden md:block fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-gray-50 transition-colors"
      >
        {isExpanded ? (
          <X size={20} className="text-gray-600" />
        ) : (
          <Menu size={20} className="text-gray-600" />
        )}
      </button>
      

      {/* Overlay for expanded sidebar */}
      {isExpanded && (
        <div 
          className="hidden md:block fixed inset-0 bg-opacity-50 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-screen bg-white z-40 flex-col transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}>
        {/* Header space for hamburger button */}
        <div className="h-16 flex items-center justify-center">
          {/* Empty space for hamburger button */}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems
            .filter(item => item.roles.includes(userRole))
            .map(({ name, icon: Icon, color, size, red, onClick }) => (
              <button
                key={name}
                onClick={onClick}
                className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  red ? 'text-red-500 hover:bg-red-50' : 'text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Icon
                  className="flex-shrink-0"
                  size={size}
                  color={color}
                />
                <span className={`whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 w-0 overflow-hidden'
                }`}>
                  {name}
                </span>
              </button>
            ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-screen-sm mx-auto">
          {navItems
            .filter(item => item.roles.includes(userRole))
            .map(({ name, icon: Icon, color, size, red, onClick }) => (
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
      </div>
      )}
      {/* Main Content Padding - Add this to your main content to prevent overlap */}
      {/* <div className="md:hidden h-20" /> */}
    </>
        
  );
};

export default Sidebar;