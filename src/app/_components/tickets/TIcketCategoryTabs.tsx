'use client';

import { useState, useRef, useEffect } from 'react';
import { Inbox, Loader, History, ChevronDown, ChevronUp } from 'lucide-react';
import '~/styles/globals.css';

const tabs = [
  { label: 'Incoming', icon: Inbox },
  { label: 'Ongoing', icon: Loader },
  { label: 'Past', icon: History },
];

const TicketCategoryTabs = () => {
  const [activeTab, setActiveTab] = useState('Incoming');
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
  });

  // Handle screen resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animate underline only on desktop
  useEffect(() => {
    if (!isMobile) {
      const activeBtn = tabRefs.current[activeTab];
      if (activeBtn) {
        setUnderlineStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        });
      }
    }
  }, [activeTab, isMobile]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Mobile View */}
      {isMobile ? (
        <div className="relative w-full border border-gray-300 rounded-md bg-white overflow-hidden">
          {/* Dropdown Header */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700"
          >
            <div className="flex items-center gap-2">
              {
                (() => {
                  const ActiveIcon = tabs.find(t => t.label === activeTab)?.icon;
                  return ActiveIcon && <ActiveIcon className="w-4 h-4" />;
                })()
              }
              {activeTab}
            </div>
            {dropdownOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Animated Dropdown */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              dropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {tabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveTab(label);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                  activeTab === label
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Desktop View
        <div className="relative border-b border-gray-300 bg-white flex flex-wrap justify-center sm:justify-start">
          <div className="flex relative">
            {/* Underline */}
            <div
              className="absolute bottom-0 h-1 bg-blue-600 rounded transition-all duration-300"
              style={{
                left: underlineStyle.left,
                width: underlineStyle.width,
              }}
            />

            {/* Desktop Tabs */}
            {tabs.map(({ label, icon: Icon }) => (
              <button
                key={label}
                ref={(el) => {
                  tabRefs.current[label] = el;
                }}
                onClick={() => setActiveTab(label)}
                className={`relative px-5 py-2.5 mx-1 my-1 flex items-center gap-2 text-sm font-medium transition-all duration-200 rounded-t-lg 
                  ${
                    activeTab === label
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 ${
                    activeTab === label ? 'scale-110' : 'scale-100'
                  }`}
                />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCategoryTabs;
