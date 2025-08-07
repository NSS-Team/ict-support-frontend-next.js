'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { FileText, Clock, Star, TrendingUp, Award, CheckCircle, AlertCircle, UserCheck, Timer, MapPin, Target } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('last30days');
  const [selectedView, setSelectedView] = useState('overview');

  // Overall Complaints Stats
  const overallStats = {
    total: 1847,
    reopened: 67,
    resolved: 1234,
    closed: 1167,
    assigned: 289,
    waiting_assignment: 324
  };

  // Complaints by Location
  const locationStats = [
    { 
      location: 'Lahore', 
      total: 567, 
      reopened: 23, 
      resolved: 398, 
      closed: 375, 
      assigned: 87, 
      waiting_assignment: 82 
    },
    { 
      location: 'Karachi', 
      total: 432, 
      reopened: 18, 
      resolved: 301, 
      closed: 283, 
      assigned: 67, 
      waiting_assignment: 64 
    },
    { 
      location: 'Islamabad', 
      total: 298, 
      reopened: 12, 
      resolved: 209, 
      closed: 197, 
      assigned: 45, 
      waiting_assignment: 44 
    },
    { 
      location: 'Faisalabad', 
      total: 234, 
      reopened: 8, 
      resolved: 164, 
      closed: 156, 
      assigned: 35, 
      waiting_assignment: 35 
    },
    { 
      location: 'Rawalpindi', 
      total: 187, 
      reopened: 4, 
      resolved: 131, 
      closed: 127, 
      assigned: 28, 
      waiting_assignment: 28 
    },
    { 
      location: 'Multan', 
      total: 129, 
      reopened: 2, 
      resolved: 91, 
      closed: 89, 
      assigned: 19, 
      waiting_assignment: 19 
    }
  ];

  // Complaints by Category/Subcategory
  const categoryStats = [
    { 
      category: 'Technical Support', 
      total: 623, 
      reopened: 28, 
      resolved: 445, 
      closed: 417, 
      assigned: 89, 
      waiting_assignment: 89,
      subcategories: [
        { name: 'Network Issues', total: 234, resolved: 167 },
        { name: 'Software Problems', total: 198, resolved: 142 },
        { name: 'Hardware Faults', total: 191, resolved: 136 }
      ]
    },
    { 
      category: 'Billing & Payments', 
      total: 387, 
      reopened: 15, 
      resolved: 289, 
      closed: 274, 
      assigned: 54, 
      waiting_assignment: 44,
      subcategories: [
        { name: 'Payment Issues', total: 156, resolved: 123 },
        { name: 'Invoice Queries', total: 123, resolved: 98 },
        { name: 'Refund Requests', total: 108, resolved: 68 }
      ]
    },
    { 
      category: 'Account Management', 
      total: 298, 
      reopened: 12, 
      resolved: 223, 
      closed: 211, 
      assigned: 43, 
      waiting_assignment: 32,
      subcategories: [
        { name: 'Login Issues', total: 134, resolved: 109 },
        { name: 'Profile Updates', total: 89, resolved: 67 },
        { name: 'Access Rights', total: 75, resolved: 47 }
      ]
    },
    { 
      category: 'Service Requests', 
      total: 267, 
      reopened: 8, 
      resolved: 156, 
      closed: 148, 
      assigned: 67, 
      waiting_assignment: 44,
      subcategories: [
        { name: 'New Connections', total: 123, resolved: 78 },
        { name: 'Upgrades', total: 87, resolved: 45 },
        { name: 'Maintenance', total: 57, resolved: 33 }
      ]
    },
    { 
      category: 'General Inquiry', 
      total: 272, 
      reopened: 4, 
      resolved: 121, 
      closed: 117, 
      assigned: 36, 
      waiting_assignment: 115,
      subcategories: [
        { name: 'Information Requests', total: 156, resolved: 67 },
        { name: 'Feedback', total: 78, resolved: 34 },
        { name: 'Other', total: 38, resolved: 20 }
      ]
    }
  ];

  // Resolution Time Data
  const resolutionTimeData = {
    overall: '2.4 hrs',
    perTeam: [
      { team: 'Technical Support', avgTime: '3.2 hrs', totalResolved: 445 },
      { team: 'Billing Team', avgTime: '1.8 hrs', totalResolved: 289 },
      { team: 'Account Management', avgTime: '2.1 hrs', totalResolved: 223 },
      { team: 'Service Team', avgTime: '4.1 hrs', totalResolved: 156 },
      { team: 'General Support', avgTime: '1.5 hrs', totalResolved: 121 }
    ],
    perLocation: [
      { location: 'Lahore', avgTime: '2.3 hrs', totalResolved: 398 },
      { location: 'Karachi', avgTime: '2.5 hrs', totalResolved: 301 },
      { location: 'Islamabad', avgTime: '2.1 hrs', totalResolved: 209 },
      { location: 'Faisalabad', avgTime: '2.8 hrs', totalResolved: 164 },
      { location: 'Rawalpindi', avgTime: '2.4 hrs', totalResolved: 131 },
      { location: 'Multan', avgTime: '2.6 hrs', totalResolved: 91 }
    ],
    perWorker: [
      { worker: 'Ahmed Hassan', team: 'Billing Team', avgTime: '1.2 hrs', resolved: 89 },
      { worker: 'Fatima Khan', team: 'General Support', avgTime: '1.3 hrs', resolved: 76 },
      { worker: 'Ali Raza', team: 'Account Management', avgTime: '1.8 hrs', resolved: 67 },
      { worker: 'Sara Ahmed', team: 'Technical Support', avgTime: '2.1 hrs', resolved: 54 },
      { worker: 'Hassan Ali', team: 'Service Team', avgTime: '3.2 hrs', resolved: 43 }
    ]
  };

  // Ratings Data
  const ratingsData = {
    perTeam: [
      { team: 'Billing Team', rating: 4.6, totalRatings: 245, highestScore: true },
      { team: 'Account Management', rating: 4.4, totalRatings: 189 },
      { team: 'General Support', rating: 4.2, totalRatings: 98 },
      { team: 'Technical Support', rating: 4.1, totalRatings: 367 },
      { team: 'Service Team', rating: 3.9, totalRatings: 134 }
    ],
    perLocation: [
      { location: 'Islamabad', rating: 4.5, totalRatings: 167 },
      { location: 'Lahore', rating: 4.3, totalRatings: 298 },
      { location: 'Karachi', rating: 4.2, totalRatings: 234 },
      { location: 'Rawalpindi', rating: 4.1, totalRatings: 109 },
      { location: 'Faisalabad', rating: 4.0, totalRatings: 134 },
      { location: 'Multan', rating: 3.9, totalRatings: 87 }
    ]
  };

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    percentage?: number;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle, percentage }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {percentage !== undefined && <p className="text-xs text-gray-500 mt-1">{percentage}%</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complaints Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive overview of all complaints across locations, categories, and teams</p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
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
          
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setSelectedView('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setSelectedView('detailed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === 'detailed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
            >
              Detailed View
            </button>
          </div>
        </div>
      </div>

      {/* Overall Complaints Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Overall Complaints Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title="Total Complaints"
            value={overallStats.total.toLocaleString()}
            icon={FileText}
            color="text-blue-600"
          />
          <StatCard
            title="Resolved"
            value={overallStats.resolved.toLocaleString()}
            icon={CheckCircle}
            color="text-green-600"
            percentage={Math.round((overallStats.resolved / overallStats.total) * 100)}
          />
          <StatCard
            title="Closed"
            value={overallStats.closed.toLocaleString()}
            icon={CheckCircle}
            color="text-green-600"
            percentage={Math.round((overallStats.closed / overallStats.total) * 100)}
          />
          <StatCard
            title="Reopened"
            value={overallStats.reopened}
            icon={AlertCircle}
            color="text-yellow-600"
            percentage={Math.round((overallStats.reopened / overallStats.total) * 100)}
          />
          <StatCard
            title="Assigned"
            value={overallStats.assigned}
            icon={UserCheck}
            color="text-blue-600"
            percentage={Math.round((overallStats.assigned / overallStats.total) * 100)}
          />
          <StatCard
            title="Waiting Assignment"
            value={overallStats.waiting_assignment}
            icon={Clock}
            color="text-orange-600"
            percentage={Math.round((overallStats.waiting_assignment / overallStats.total) * 100)}
          />
        </div>
      </div>

      {/* Complaints by Location */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Complaints by Location
        </h2>
        
        {/* Location Stats Table */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Total</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Resolved</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Closed</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Reopened</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Assigned</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Waiting</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Resolution %</th>
                </tr>
              </thead>
              <tbody>
                {locationStats.map((location, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{location.location}</td>
                    <td className="text-center py-4 px-4 font-semibold">{location.total}</td>
                    <td className="text-center py-4 px-4 font-semibold text-green-600">{location.resolved}</td>
                    <td className="text-center py-4 px-4 font-semibold text-green-600">{location.closed}</td>
                    <td className="text-center py-4 px-4 font-semibold text-yellow-600">{location.reopened}</td>
                    <td className="text-center py-4 px-4 font-semibold text-blue-600">{location.assigned}</td>
                    <td className="text-center py-4 px-4 font-semibold text-orange-600">{location.waiting_assignment}</td>
                    <td className="text-center py-4 px-4 font-semibold text-green-600">
                      {Math.round((location.resolved / location.total) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Location Graph */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location-wise Complaint Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3B82F6" name="Total" />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
              <Bar dataKey="assigned" fill="#F59E0B" name="Assigned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complaints by Category */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Complaints by Category & Subcategory
        </h2>
        
        {/* Category Stats Table */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Total</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Resolved</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Closed</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Reopened</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Assigned</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Waiting</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Resolution %</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((category, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{category.category}</td>
                    <td className="text-center py-4 px-4 font-semibold">{category.total}</td>
                    <td className="text-center py-4 px-4 font-semibold text-green-600">{category.resolved}</td>
                    <td className="text-center py-4 px-4 font-semibold text-green-600">{category.closed}</td>
                    <td className="text-center py-4 px-4 font-semibold text-yellow-600">{category.reopened}</td>
                    <td className="text-center py-4 px-4 font-semibold text-blue-600">{category.assigned}</td>
                    <td className="text-center py-4 px-4 font-semibold text-orange-600">{category.waiting_assignment}</td>
                    <td className="text-center py-4 px-4 font-semibold text-green-600">
                      {Math.round((category.resolved / category.total) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={100}
                  dataKey="total"
                  nameKey="category"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Rate by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStats} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip formatter={(value, name) => [value, name === 'resolved' ? 'Resolved' : 'Total']} />
                <Bar dataKey="total" fill="#E5E7EB" name="Total" />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resolution Time Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Resolution Time Analysis
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {/* Overall Resolution Time */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <Timer className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Average</h3>
              <p className="text-3xl font-bold text-blue-600">{resolutionTimeData.overall}</p>
              <p className="text-sm text-gray-600 mt-2">Average resolution time</p>
            </div>
          </div>

          {/* Per Team */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Team</h3>
            <div className="space-y-3">
              {resolutionTimeData.perTeam.slice(0, 3).map((team, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 truncate">{team.team}</span>
                  <span className="font-semibold text-gray-900">{team.avgTime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per Location */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Location</h3>
            <div className="space-y-3">
              {resolutionTimeData.perLocation.slice(0, 3).map((location, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{location.location}</span>
                  <span className="font-semibold text-gray-900">{location.avgTime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Resolution Time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionTimeData.perTeam}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value.toString()} hrs`, 'Avg Resolution Time']} />
                <Bar dataKey="avgTime" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Workers</h3>
            <div className="space-y-4">
              {resolutionTimeData.perWorker.map((worker, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{worker.worker}</p>
                    <p className="text-sm text-gray-600">{worker.team}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{worker.avgTime}</p>
                    <p className="text-xs text-gray-500">{worker.resolved} resolved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2" />
          Ratings Analysis
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rating per Team */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Ratings</h3>
            <div className="space-y-4 mb-6">
              {ratingsData.perTeam.map((team, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${team.highestScore ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    {team.highestScore && <Award className="w-5 h-5 text-green-600 mr-2" />}
                    <div>
                      <p className={`font-semibold ${team.highestScore ? 'text-green-800' : 'text-gray-900'}`}>
                        {team.team}
                        {team.highestScore && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Highest Score</span>}
                      </p>
                      <p className="text-sm text-gray-600">{team.totalRatings} ratings</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className={`text-xl font-bold ${team.highestScore ? 'text-green-600' : 'text-gray-900'}`}>{team.rating}</span>
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingsData.perTeam}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[3, 5]} />
                <Tooltip />
                <Bar dataKey="rating" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rating per Location */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Ratings</h3>
            <div className="space-y-4 mb-6">
              {ratingsData.perLocation.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="font-semibold text-gray-900">{location.location}</p>
                      <p className="text-sm text-gray-600">{location.totalRatings} ratings</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-xl font-bold text-gray-900">{location.rating}</span>
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ratingsData.perLocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[3, 5]} />
                <Tooltip />
                <Area type="monotone" dataKey="rating" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-green-800">Best Resolution Rate</p>
                <p className="text-sm text-green-600">Lahore Office</p>
              </div>
              <p className="text-xl font-bold text-green-600">70%</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-blue-800">Fastest Team</p>
                <p className="text-sm text-blue-600">General Support</p>
              </div>
              <p className="text-xl font-bold text-blue-600">1.5h</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-semibold text-purple-800">Highest Rating</p>
                <p className="text-sm text-purple-600">Billing Team</p>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <p className="text-xl font-bold text-purple-600">4.6</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { day: 'Mon', complaints: 45, resolved: 32 },
              { day: 'Tue', complaints: 52, resolved: 38 },
              { day: 'Wed', complaints: 48, resolved: 35 },
              { day: 'Thu', complaints: 61, resolved: 43 },
              { day: 'Fri', complaints: 55, resolved: 39 },
              { day: 'Sat', complaints: 38, resolved: 28 },
              { day: 'Sun', complaints: 42, resolved: 31 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="complaints" stroke="#3B82F6" name="New Complaints" />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <p className="font-semibold text-red-800">High Waiting Queue</p>
                <p className="text-sm text-red-600">324 complaints awaiting assignment</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <p className="font-semibold text-yellow-800">Slow Resolution</p>
                <p className="text-sm text-yellow-600">Service Team needs attention</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="font-semibold text-blue-800">Scaling Opportunity</p>
                <p className="text-sm text-blue-600">Replicate Billing Team success</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;