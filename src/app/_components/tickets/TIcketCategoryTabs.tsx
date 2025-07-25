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
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    low: 'bg-green-50 text-green-700 border-green-200'
  };

  const statusColors = {
    assigned: 'bg-blue-50 text-blue-700 border-blue-200',
    in_progress: 'bg-purple-50 text-purple-700 border-purple-200',
    resolved: 'bg-green-50 text-green-700 border-green-200',
    closed: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Main Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="p-6">
          {/* Search Bar with Filter Toggle */}
          <div className="flex gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search tickets by ID, title, or keyword..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 whitespace-nowrap"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expandable Filter Section */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}>
            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {/* Priority Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Priority</label>
              <div className="relative">
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className={`w-full appearance-none px-4 py-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    filters.priority && priorityColors[filters.priority as keyof typeof priorityColors]
                      ? priorityColors[filters.priority as keyof typeof priorityColors]
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className={`w-full appearance-none px-4 py-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    filters.status && statusColors[filters.status as keyof typeof statusColors]
                      ? statusColors[filters.status as keyof typeof statusColors]
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">All Statuses</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Date Created</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Reset Button - Positioned at the end */}
            <div className="space-y-2 flex flex-col justify-end">
              <label className="text-sm font-medium text-transparent block">Actions</label>
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  hasActiveFilters
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed'
                }`}
              >
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                {filters.priority && (
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${
                    priorityColors[filters.priority as keyof typeof priorityColors]
                  }`}>
                    <span>Priority: {filters.priority}</span>
                    <button
                      onClick={() => handleFilterChange('priority', '')}
                      className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.status && (
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${
                    statusColors[filters.status as keyof typeof statusColors]
                  }`}>
                    <span>Status: {filters.status.replace('_', ' ')}</span>
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.date && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    <span>Date: {filters.date}</span>
                    <button
                      onClick={() => handleFilterChange('date', '')}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <span>Search: "{filters.search}"</span>
                    <button
                      onClick={() => handleFilterChange('search', '')}
                      className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
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