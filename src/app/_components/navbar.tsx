'use client';

import { Bell } from 'lucide-react';
import {
  SignedIn,
  UserButton,
} from '@clerk/nextjs';
import Image from 'next/image';
import '~/styles/globals.css'; // Ensure global styles are imported

const Navbar = () => {
  return (
    <header className="w-full h-16 bg-white px-6 flex items-center justify-between border-b border-gray-200">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Image
          src="/nust-seeklogo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-md"
        />

        {/* Title */}
        <h1 className="text-xl font-semibold tracking-wide text-gray-800">
          NSS
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <SignedIn>
          {/* Notification Bell */}
          <div className="relative group">
            <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          </div>

          {/* User Profile
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "ring-2 ring-blue-500 hover:ring-offset-2 transition-all duration-200",
              },
            }}
          /> */}
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
