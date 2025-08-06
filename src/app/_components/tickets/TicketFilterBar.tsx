'use client';

import { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const TicketFilterBar = ({ onFiltersChange }: { onFiltersChange?: (filters: any) => void }) => {
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    date: '',
    search: '',
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (field: string, value: string) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFiltersChange?.(updated);
  };

  const resetFilters = () => {
    const cleared = { priority: '', status: '', date: '', search: '' };
    setFilters(cleared);
    onFiltersChange?.(cleared);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  const activeFilterCount = Object.values(filters).filter(value => value !== '').length;

  const priorityColors = {
    low: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
    urgent: 'bg-red-100 text-red-800 border-red-300'
  };

  const statusColors = {
    waiting_assignment: 'bg-gray-50 text-gray-700 border-gray-200',
    assigned: 'bg-blue-50 text-blue-700 border-blue-200',
    in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
    resolved: 'bg-green-50 text-green-700 border-green-200',
    closed: 'bg-gray-50 text-gray-700 border-gray-200',
    escalated_level_1: 'bg-orange-50 text-orange-700 border-orange-200',
    escalated_level_2: 'bg-red-50 text-red-700 border-red-200',
    reopened: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    in_queue: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
      {/* Main Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="p-3 sm:p-6">
          {/* Search Bar with Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search tickets by ID, title..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg sm:rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 whitespace-nowrap min-h-[44px] touch-manipulation"
            >
              <Filter className="w-4 h-4" />
              <span className="inline sm:hidden md:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Filter Section */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'max-h-[500px] opacity-100 mt-4 sm:mt-6' : 'max-h-0 opacity-0'
          }`}>
            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-3 sm:pb-4">
            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Priority</label>
              <div className="relative">
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className={`w-full appearance-none px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[44px] touch-manipulation ${
                    filters.priority && priorityColors[filters.priority as keyof typeof priorityColors]
                      ? priorityColors[filters.priority as keyof typeof priorityColors]
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-2.5 sm:top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className={`w-full appearance-none px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[44px] touch-manipulation ${
                    filters.status && statusColors[filters.status as keyof typeof statusColors]
                      ? statusColors[filters.status as keyof typeof statusColors]
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">All Statuses</option>
                  <option value="waiting_assignment">Waiting Assignment</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="escalated_level_1">Escalated L1</option>
                  <option value="escalated_level_2">Escalated L2</option>
                  <option value="reopened">Reopened</option>
                  <option value="in_queue">In Queue</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-2.5 sm:top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Date Created</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[44px] touch-manipulation"
              />
            </div>

            {/* Reset Button - Positioned at the end */}
            <div className="space-y-2 flex flex-col justify-end">
              <label className="text-sm font-medium text-transparent block">Actions</label>
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] touch-manipulation ${
                  hasActiveFilters
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed'
                }`}
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
                <span className="inline sm:hidden">Clear</span>
              </button>
            </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-gray-100">
                <span className="text-xs sm:text-sm text-gray-600 mr-1 sm:mr-2 mb-1">Active filters:</span>
                {filters.priority && (
                  <span className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                    priorityColors[filters.priority as keyof typeof priorityColors]
                  }`}>
                    <span className="hidden sm:inline">Priority: {filters.priority}</span>
                    <span className="inline sm:hidden">{filters.priority}</span>
                    <button
                      onClick={() => handleFilterChange('priority', '')}
                      className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 touch-manipulation"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                    statusColors[filters.status as keyof typeof statusColors]
                  }`}>
                    <span className="hidden sm:inline">Status: {filters.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className="inline sm:hidden">{filters.status.replace(/_/g, ' ').split(' ')[0]}</span>
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 touch-manipulation"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.date && (
                  <span className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    <span className="hidden sm:inline">Date: {filters.date}</span>
                    <span className="inline sm:hidden">{filters.date}</span>
                    <button
                      onClick={() => handleFilterChange('date', '')}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5 touch-manipulation"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <span className="hidden sm:inline">Search: "{filters.search}"</span>
                    <span className="inline sm:hidden">"{filters.search.length > 10 ? filters.search.substring(0, 10) + '...' : filters.search}"</span>
                    <button
                      onClick={() => handleFilterChange('search', '')}
                      className="ml-1 hover:bg-blue-100 rounded-full p-0.5 touch-manipulation"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketFilterBar;