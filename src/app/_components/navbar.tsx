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
  ChevronDown,
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
  
  // Swipe and scroll lock states
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragThreshold] = useState(100); // Minimum swipe distance to close
  const panelRef = useRef<HTMLDivElement>(null);

  // API calls and state management (keep existing logic)
  const { data: getNotificationsResponse } = api.notifications.getNotifications.useQuery({
    offset: notificationOffset,
  }, {enabled: shouldFetchNotifications});
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { mutate: markNotificationAsRead } = api.notifications.markNotificationAsRead.useMutation();
  const { mutate: markAllNotificationsAsRead } = api.notifications.markAllNotificationsAsRead.useMutation();

  // Scroll lock effect - Only apply on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 640; // sm breakpoint
    
    if (isNotificationOpen && isMobile) {
      // Disable scroll on body for mobile only
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      return () => {
        // Re-enable scroll on body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isNotificationOpen]);

  // Touch event handlers for swipe down (mobile only)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 640) return; // Don't handle on desktop
    setStartY(e.touches[0]!.clientY);
    setCurrentY(e.touches[0]!.clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || window.innerWidth >= 640) return;
    
    const touch = e.touches[0]!;
    setCurrentY(touch.clientY);
    
    const deltaY = touch.clientY - startY;
    
    // Only allow downward swipe and only if at the top of the scrollable content
    const scrollContainer = panelRef.current?.querySelector('.overflow-y-auto');
    const isAtTop = scrollContainer?.scrollTop === 0;
    
    if (deltaY > 0 && isAtTop) {
      // Prevent default to stop page scrolling
      e.preventDefault();
      
      // Apply transform for visual feedback
      if (panelRef.current) {
        const translateY = Math.min(deltaY * 0.5, 200); // Damping effect
        panelRef.current.style.transform = `translateY(${translateY}px)`;
        panelRef.current.style.transition = 'none';
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || window.innerWidth >= 640) return;
    
    const deltaY = currentY - startY;
    
    // Reset panel position
    if (panelRef.current) {
      panelRef.current.style.transform = '';
      panelRef.current.style.transition = '';
    }
    
    // Close if swiped down enough
    if (deltaY > dragThreshold) {
      setIsNotificationOpen(false);
    }
    
    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  // Keep all existing useEffects and functions...
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
    const transformed: Notification[] = (rawNotifications as Notification[]).map((notif: Notification): Notification => ({
      ...notif,
      read: notif.read ?? false,
    }));

    if (transformed.length > 0) {
      setNotifications((prev) => [...prev, ...transformed]);
    }

    if (rawData.pagination?.offset !== undefined) {
      setNotificationOffset(rawData.pagination.offset);
    }

    setHasMore(rawData.pagination?.hasMore ?? false);

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
    setTotalUnread(0);
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== id)
    );
  };

  return (
    <header className="w-full fixed top-0 h-16 bg-white px-4 sm:px-6 flex items-center justify-between z-50 md:left-16 md:w-[calc(100%-4rem)] border-b border-gray-200">

      {/* Left Section - Mobile Optimized */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            <img src="/nust-seeklogo.png" alt="NUST Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">NSS</h1>
            <p className="text-xs text-gray-500">Support System</p>
          </div>
          {/* Mobile: Show abbreviated title */}
          <div className="block sm:hidden">
            <h1 className="text-lg font-bold text-gray-900">NSS</h1>
          </div>
        </div>
      </div>

      {/* Right Section - Mobile Optimized */}
      {user && (
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications - Mobile Optimized */}
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
                <>
                  {/* Mobile: Full screen overlay - Only show on mobile */}
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden" 
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  
                  {/* Notification Panel - Fixed positioning issues */}
                  <div 
                    ref={panelRef}
                    className={`
                      z-50
                      /* Mobile: Full width bottom sheet */
                      fixed sm:absolute
                      bottom-0 sm:top-full sm:mt-2
                      left-0 sm:left-auto sm:right-0
                      w-full sm:w-96
                      max-h-[85vh] sm:max-h-96
                      bg-white 
                      rounded-t-2xl sm:rounded-lg 
                      shadow-2xl sm:shadow-lg 
                      border-t sm:border border-gray-200
                      transform transition-transform duration-300 ease-out
                      ${isDragging ? '' : 'transition-transform'}
                    `}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ 
                      touchAction: window.innerWidth < 640 ? 'pan-y' : 'auto' // Only allow panning on mobile
                    }}
                  >
                    
                    {/* Mobile Handle - Only show on mobile */}
                    <div 
                      className="block sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2 cursor-grab active:cursor-grabbing"
                      style={{
                        backgroundColor: isDragging ? '#6b7280' : '#d1d5db',
                        transition: isDragging ? 'none' : 'background-color 0.2s'
                      }}
                    />
                    
                    {/* Header - Mobile Optimized */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-2xl sm:rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg sm:text-base font-semibold text-gray-900">Notifications</h3>
                        {totalUnread > 0 && (
                          <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                            {totalUnread} new
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <span className="hidden sm:inline">Mark all as read</span>
                            <span className="sm:hidden">Mark all</span>
                          </button>
                        )}
                        
                        {/* Mobile Close Button */}
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="block sm:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* List - Fixed height issues */}
                    <div 
                      className="overflow-y-auto" 
                      style={{ 
                        maxHeight: window.innerWidth < 640 ? 'calc(85vh - 120px)' : '300px',
                      }}
                    >
                      {notifications.length === 0 ? (
                        <div className="px-4 py-12 sm:py-8 text-center text-gray-500">
                          <Bell className="w-12 h-12 sm:w-8 sm:h-8 text-gray-300 mx-auto mb-3 sm:mb-2" />
                          <p className="text-base sm:text-sm font-medium mb-1">No notifications</p>
                          <p className="text-sm sm:text-xs text-gray-400">You're all caught up!</p>
                          <p className="text-xs text-gray-400 mt-2 sm:hidden">Swipe down to close</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-4 sm:py-3 hover:bg-gray-50 transition-colors duration-150 border-l-4 ${
                                !notification.read 
                                  ? 'bg-blue-50/30 border-l-blue-500' 
                                  : 'border-l-transparent'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Notification dot */}
                                {!notification.read && (
                                  <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-2 sm:mt-1.5 flex-shrink-0" />
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-base sm:text-sm font-medium leading-5 ${
                                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                                      }`}>
                                        New Notification
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1 leading-5">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-2 sm:mt-1">
                                        {formatDistanceToNow(new Date(notification.createdAt), {
                                          addSuffix: true,
                                        })}
                                      </p>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {notification.status !== 'read' && (
                                        <button
                                          onClick={() => markAsRead(notification.id)}
                                          className="p-2 sm:p-1 hover:bg-gray-200 rounded-lg sm:rounded text-gray-400 hover:text-green-600 transition-colors"
                                          title="Mark as read"
                                        >
                                          <Check className="w-4 h-4 sm:w-3 sm:h-3" />
                                        </button>
                                      )}

                                      <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="p-2 sm:p-1 hover:bg-gray-200 rounded-lg sm:rounded text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                      >
                                        <X className="w-4 h-4 sm:w-3 sm:h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                        {hasMore ? (
                          <button
                            onClick={() => setNotificationOffset((prev) => prev + 10)}
                            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-2 sm:py-1 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            Load More
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="text-center py-2 sm:py-1">
                            <p className="text-sm text-gray-400">No more notifications</p>
                            <p className="text-xs text-gray-400 mt-1 sm:hidden">Swipe down to close</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Logout - Mobile Optimized */}
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
        </div>
      )}
    </header>
  );
};

export default Navbar;