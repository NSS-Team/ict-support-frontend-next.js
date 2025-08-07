'use client';


import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Ticket, Clock, Star, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('last30days');

  // Mock data - replace with actual API calls
  const ticketStats = {
    total: 1247,
    resolved: 892,
    reopened: 45,
    closed: 847,
    assigned: 213,
    waiting_assignment: 142
  };

  const categoryData = [
    { name: 'Technical Support', total: 453, resolved: 321, subcategories: ['Hardware', 'Software', 'Network'] },
    { name: 'Account Issues', total: 287, resolved: 245, subcategories: ['Login', 'Password', 'Permissions'] },
    { name: 'Billing', total: 193, resolved: 156, subcategories: ['Payment', 'Refund', 'Invoice'] },
    { name: 'General Inquiry', total: 314, resolved: 170, subcategories: ['Information', 'Feedback', 'Other'] }
  ];

  const ratingData = {
    average: 4.2,
    totalRatings: 756,
    distribution: [
      { rating: 5, count: 342 },
      { rating: 4, count: 234 },
      { rating: 3, count: 123 },
      { rating: 2, count: 45 },
      { rating: 1, count: 12 }
    ]
  };

  const teamPerformance = [
    { team: 'Technical Support', avgRating: 4.5, avgFeedback: 4.3, resolvedCount: 456, avgResolutionTime: '2.3 hrs' },
    { team: 'Customer Service', avgRating: 4.2, avgFeedback: 4.1, resolvedCount: 234, avgResolutionTime: '1.8 hrs' },
    { team: 'Billing Support', avgRating: 4.0, avgFeedback: 3.9, resolvedCount: 123, avgResolutionTime: '1.2 hrs' },
    { team: 'Network Services', avgRating: 4.3, avgFeedback: 4.2, resolvedCount: 189, avgResolutionTime: '3.1 hrs' }
  ];

  const topWorkers = [
    { name: 'Ali Ahmad', role: 'Senior Tech Support', rating: 4.8, resolvedTickets: 89, avgResolutionTime: '1.5 hrs', team: 'Technical Support' },
    { name: 'Sarah Khan', role: 'Customer Service Rep', rating: 4.7, resolvedTickets: 76, avgResolutionTime: '1.2 hrs', team: 'Customer Service' },
    { name: 'Ahmed Hassan', role: 'Billing Specialist', rating: 4.6, resolvedTickets: 64, avgResolutionTime: '0.8 hrs', team: 'Billing Support' },
    { name: 'Fatima Ali', role: 'Network Engineer', rating: 4.5, resolvedTickets: 52, avgResolutionTime: '2.1 hrs', team: 'Network Services' }
  ];

  const resolutionTimeData = [
    { day: 'Mon', avgTime: 2.4 },
    { day: 'Tue', avgTime: 2.1 },
    { day: 'Wed', avgTime: 2.8 },
    { day: 'Thu', avgTime: 2.3 },
    { day: 'Fri', avgTime: 2.6 },
    { day: 'Sat', avgTime: 3.2 },
    { day: 'Sun', avgTime: 2.9 }
  ];

  type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track the Progress</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all support activities across the organization</p>
        
        {/* Timeframe Selector */}
        <div className="mt-4">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last3months">Last 3 Months</option>
            <option value="last6months">Last 6 Months</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
        <StatCard
          title="Total Tickets"
          value={ticketStats.total.toLocaleString()}
          icon={Ticket}
          color="text-blue-600"
        />
        <StatCard
          title="Resolved"
          value={ticketStats.resolved.toLocaleString()}
          icon={CheckCircle}
          color="text-green-600"
          subtitle={`${Math.round((ticketStats.resolved / ticketStats.total) * 100)}% resolution rate`}
        />
        <StatCard
          title="Reopened"
          value={ticketStats.reopened}
          icon={AlertCircle}
          color="text-yellow-600"
        />
        <StatCard
          title="Closed"
          value={ticketStats.closed.toLocaleString()}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Assigned"
          value={ticketStats.assigned}
          icon={UserCheck}
          color="text-blue-600"
        />
        <StatCard
          title="Waiting Assignment"
          value={ticketStats.waiting_assignment}
          icon={Clock}
          color="text-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3B82F6" name="Total" />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
                <span className="text-3xl font-bold text-gray-900 ml-2">{ratingData.average}</span>
              </div>
              <p className="text-sm text-gray-600">{ratingData.totalRatings} total ratings</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={ratingData.distribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="count"
                nameKey="rating"
              >
                {ratingData.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} ratings`, `${name} stars`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Time Trend */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Resolution Time (Hours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={resolutionTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} hours`, 'Avg Resolution Time']} />
            <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Performance Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Team</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Avg Rating</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Avg Feedback</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Resolved</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Avg Resolution Time</th>
              </tr>
            </thead>
            <tbody>
              {teamPerformance.map((team, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{team.team}</td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{team.avgRating}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 font-semibold">{team.avgFeedback}</td>
                  <td className="text-center py-4 px-4 font-semibold text-green-600">{team.resolvedCount}</td>
                  <td className="text-center py-4 px-4 font-semibold">{team.avgResolutionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Workers */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Workers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {topWorkers.map((worker, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">{worker.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">{worker.name}</h4>
                  <p className="text-sm text-gray-600">{worker.role}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{worker.rating}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resolved</span>
                  <span className="font-semibold text-green-600">{worker.resolvedTickets}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Time</span>
                  <span className="font-semibold">{worker.avgResolutionTime}</span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">{worker.team}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;