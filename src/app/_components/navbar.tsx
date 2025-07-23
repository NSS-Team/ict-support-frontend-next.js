'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Bell, User, Settings, LogOut, Check, X, Clock, AlertCircle } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'ticket',
    title: 'New ticket assigned',
    message: 'Ticket #12345 has been assigned to you',
    time: '5 minutes ago',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'system',
    title: 'System maintenance',
    message: 'Scheduled maintenance on Sunday at 2 AM',
    time: '1 hour ago',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'ticket',
    title: 'Ticket resolved',
    message: 'Your ticket #12340 has been resolved',
    time: '2 hours ago',
    read: true,
    priority: 'low'
  },
  {
    id: 4,
    type: 'update',
    title: 'Status update',
    message: 'Ticket #12342 status changed to In Progress',
    time: '3 hours ago',
    read: true,
    priority: 'medium'
  }
];

interface Notification {
  id: number;
  type: 'ticket' | 'system' | 'update';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const Navbar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const notificationRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    interface Notification {
      id: number;
      type: 'ticket' | 'system' | 'update';
      title: string;
      message: string;
      time: string;
      read: boolean;
      priority: 'high' | 'medium' | 'low';
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !(notificationRef.current as HTMLDivElement).contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  interface Notification {
    id: number;
    type: 'ticket' | 'system' | 'update';
    title: string;
    message: string;
    time: string;
    read: boolean;
    priority: 'high' | 'medium' | 'low';
  }

  type MarkAsReadFn = (id: number) => void;

  const markAsRead: MarkAsReadFn = (id) => {
    setNotifications((prev: Notification[]) =>
      prev.map((notif: Notification) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  interface DeleteNotificationFn {
    (id: number): void;
  }

  const deleteNotification: DeleteNotificationFn = (id) => {
    setNotifications((prev: Notification[]) => prev.filter((notif: Notification) => notif.id !== id));
  };

  interface NotificationIconProps {
    type: 'ticket' | 'system' | 'update';
    priority: 'high' | 'medium' | 'low';
  }

  const getNotificationIcon = (
    type: NotificationIconProps['type'],
    priority: NotificationIconProps['priority']
  ): React.ReactElement => {
    if (priority === 'high') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (type === 'system') return <Settings className="w-4 h-4 text-blue-500" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  interface PriorityColorFn {
    (priority: 'high' | 'medium' | 'low'): string;
  }

  const getPriorityColor: PriorityColorFn = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <header className="w-full h-16 bg-white px-6 flex items-center justify-between border-b border-gray-200 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">NSS</h1>
            <p className="text-xs text-gray-500">Support System</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-blue-50/30' : ''
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type, notification.priority)}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-green-600 transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <SignOutButton>
            <button
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-600" />
            </button>
          </SignOutButton>
        </div>


        {/* User Button Placeholder */}
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;