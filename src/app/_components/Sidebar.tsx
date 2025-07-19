'use client';

import { Home,Users, UserPlus, UserCircle, LogOut,} from 'lucide-react';
import Link from 'next/link';
import '~/styles/globals.css';

const navItems = [
  { name: 'Complaints', icon: Home },
  { name: 'Teams', icon: Users },
  { name: 'Registrations', icon: UserPlus },
  { name: 'My Account', icon: UserCircle },
  { name: 'Logout', icon: LogOut, red: true },
];

const Sidebar = () => {
  return (
    <aside
      className="group w-15 pl-3 pt-6 hover:w-64 bg-white h-min flex flex-col transition-all duration-300"
    >
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(({ name, icon: Icon, red }) => (
          <Link
            key={name}
            href="#"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              red ? 'text-red-500' : 'text-gray-800 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-300" />
            <span
              className="whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
            >
              {name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
