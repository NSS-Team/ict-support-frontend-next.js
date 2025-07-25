'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  User,
  Settings,
  LogOut,
  Check,
  X,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';
import { api } from '~/trpc/react';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '~/types/notifications/Notification';
import { useUser } from '@clerk/nextjs';

const Navbar = () => {
  const {user} = useUser();
  const [shouldFetchNotifications, setShouldFetchNotifications] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [notificationOffset, setNotificationOffset] = useState(0);
  const notificationRef = useRef(null);

  // api to fetch notifications
  const { data: getNotificationsResponse } = api.notifications.getNotifications.useQuery({
    offset: notificationOffset,
  }, {enabled: shouldFetchNotifications});
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // mark a single notification as read api
  const { mutate: markNotificationAsRead } = api.notifications.markNotificationAsRead.useMutation();
  // mark all notifications as read api
  const { mutate: markAllNotificationsAsRead } = api.notifications.markAllNotificationsAsRead.useMutation();

// useeffect to check if the user is logged in and fetch notifications
  useEffect(() => {
    if (user) {
      setShouldFetchNotifications(true);
    }
  }, [user]);

  useEffect(() => {
    const rawData = getNotificationsResponse;
    console.log('Raw Notifications Data:', rawData);
    if (!rawData) return;

    const rawNotifications = rawData.notifications || [];

    // interface RawNotification {
    //   id: number;
    //   message: string;
    //   status: string | null;
    //   createdAt: string;
    // }

    // interface GetNotificationsResponse {
    //   data?: {
    //     notifications?: RawNotification[];
    //     pagination?: {
    //       offset?: number;
    //       hasMore?: boolean;
    //     };
    //     totalUnread?: number;
    //   };
    // }

    const transformed: Notification[] = (rawNotifications as Notification[]).map((notif: Notification): Notification => ({
      ...notif,
      read: notif.read ?? false, // Use value from backend or fallback to false
    }));


    if (transformed.length > 0) {
      setNotifications((prev) => [...prev, ...transformed]);
    }

    if (rawData.pagination?.offset !== undefined) {
      setNotificationOffset(rawData.pagination.offset);
    }

    setHasMore(rawData.pagination?.hasMore ?? false);

    // Set unread count from backend
    if (rawData.totalUnread !== undefined) {
      setTotalUnread(Number(rawData.totalUnread));
    }
  }, [getNotificationsResponse]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
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

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    markNotificationAsRead({ id });
    setTotalUnread((prev) => Math.max(prev - 1, 0));

  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    markAllNotificationsAsRead();
    setTotalUnread(0); // Reset counter
  };


  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== id)
    );
  };

  // const getNotificationIcon = (
  //   priority: 'high' | 'medium' | 'low'
  // ): React.ReactElement => {
  //   if (priority === 'high') return <AlertCircle className="w-4 h-4 text-red-500" />;
  //   return <Clock className="w-4 h-4 text-gray-400" />;
  // };

  // const getPriorityColor = (
  //   priority: 'high' | 'medium' | 'low'
  // ): string => {
  //   switch (priority) {
  //     case 'high':
  //       return 'border-l-red-500';
  //     case 'medium':
  //       return 'border-l-yellow-500';
  //     case 'low':
  //       return 'border-l-green-500';
  //     default:
  //       return 'border-l-gray-300';
  //   }
  // };

  return (
    <header className="w-full h-16 bg-white px-6 flex items-center justify-between border-b border-gray-200 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">NSS</h1>
            <p className="text-xs text-gray-500">Support System</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
       {/*only show these buttons when the user is logged in  */}
      {user && (
      <div className="flex items-center gap-3">
        {/* Notifications */}
        {(user.publicMetadata.role === 'manager' || user.publicMetadata.role === 'employee' || user.publicMetadata.role === 'worker') && (
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Bell className="w-5 h-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            )}

          </button>

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

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150 border-l-4 ${!notification.read ? 'bg-blue-50/30' : ''
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              New Notification
                            </p>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {notification.status !== 'read' && (
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
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 rounded-b-lg space-y-2">
                  {hasMore ? (
                    <button
                      onClick={() => setNotificationOffset((prev) => prev + 10)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center"
                    >
                      Load More
                    </button>
                  ) : (
                    <p className="text-sm text-gray-400 text-center">No more notifications</p>
                  )}
                </div>
              )}


            </div>
          )}
        </div>)}
        {/* Logout */}
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

        {/* User Icon */}
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      )}
    </header>
  );
};

export default Navbar;
