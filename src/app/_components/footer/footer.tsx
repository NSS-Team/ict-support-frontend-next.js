'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10 mt-10 md pl-20 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">NUST Support</h2>
          <p className="text-sm text-gray-400">
            A centralized platform to raise and track complaints within the NUST community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/guidelines" className="hover:text-white">Guidelines</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1" />
              NUST H-12, Islamabad
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-1" />
              +92 51 111 11 6878
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-1" />
              support@nust.edu.pk
            </li>
          </ul>
        </div>

        {/* Social Media (Optional) */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-blue-400">Facebook</Link>
            <Link href="#" className="hover:text-blue-300">Twitter</Link>
            <Link href="#" className="hover:text-pink-400">Instagram</Link>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} NUST Support System. All rights reserved.
      </div>
    </footer>
  );
}
