import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import apiService from '../../utils/api';

// Icon Components
const TrendingUpIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeBookings: 0,
    carsInStock: 0,
    pendingTestDrives: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep mock revenue data for visual chart until we implement real analytics aggregation
  const [revenueData, setRevenueData] = useState([]);
  const [timeRange] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAdminStats();
      setStats(data);

      // Use real trend data if available, otherwise fallback to empty or handle it
      if (data.revenueTrend) {
        setRevenueData(data.revenueTrend);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'TOTAL SALES',
      value: `$${(stats.totalSales || 0).toLocaleString()}`,
      icon: 'TrendingUp',
      // change: '+12.5%' // Removed static change indictator
    },
    {
      title: 'ACTIVE BOOKINGS',
      value: stats.activeBookings || 0,
      icon: 'Calendar',
      // change: '+3.2%'
    },
    {
      title: 'CARS IN STOCK',
      value: stats.carsInStock || 0,
      icon: 'Car',
      // change: '-2.1%'
    },
    {
      title: 'PENDING ACTIONS',
      value: stats.pendingTestDrives || 0,
      icon: 'Users',
      // change: '+5.7%'
    }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 100); // Default to 100 to avoid div by zero if empty

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4 text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitor your dealership performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {kpiCards.map((card, index) => {
            return (
              <div key={index} className="bg-white border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest truncate">
                      {card.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                      {card.value}
                    </p>
                    {card.change && (
                      <p className={`text-xs mt-1 ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {card.change}
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:block mt-2 sm:mt-0 shrink-0 opacity-40">
                    {card.icon === 'TrendingUp' && <TrendingUpIcon />}
                    {card.icon === 'Car' && <CarIcon />}
                    {card.icon === 'Calendar' && <CalendarIcon />}
                    {card.icon === 'Users' && <UsersIcon />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-xl font-bold text-gray-900 uppercase tracking-widest">
              Sales Trend
            </h2>
            <span className="text-sm text-gray-500">Last 30 days</span>
          </div>

          <div className="h-64 flex">
            {/* Fixed 100k Step Y-Axis Calculation */}
            {(() => {
              // Calculate max based on 100k steps
              const stepSize = 100000;
              // Ensure chart max is at least stepSize and covers maxRevenue
              const chartMax = Math.max(Math.ceil(maxRevenue / stepSize) * stepSize, stepSize);

              const ticks = [];
              for (let val = 0; val <= chartMax; val += stepSize) {
                ticks.push(val);
              }
              const reversedTicks = [...ticks].reverse();

              return (
                <>
                  {/* Y-Axis Labels */}
                  <div className="flex flex-col justify-between text-xs text-gray-500 w-16 items-end pr-4 py-0 h-full">
                    {reversedTicks.map((tick, i) => (
                      <span key={i} className="leading-none -translate-y-1/2" style={{ height: i === 0 || i === reversedTicks.length - 1 ? 'auto' : '0' }}>
                        ${(tick >= 1000 ? (tick / 1000).toFixed(0) + 'k' : tick)}
                      </span>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 relative">
                    {/* SVG Line Chart */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 100 100`}>
                      {/* Grid Lines */}
                      {ticks.map((tick, i) => {
                        // Calculate Y position based on chartMax, not maxRevenue
                        const y = 100 - ((tick / chartMax) * 100);
                        return (
                          <line
                            key={i}
                            x1="0"
                            y1={y}
                            x2="100"
                            y2={y}
                            stroke={tick === 0 ? "#dae1e7" : "#f3f4f6"}
                            strokeWidth={tick === 0 ? "1" : "0.5"}
                            vectorEffect="non-scaling-stroke"
                          />
                        );
                      })}

                      {/* Polyline */}
                      <polyline
                        fill="none"
                        stroke="#22d3ee" // Cyan
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                        points={revenueData.map((d, i) => {
                          const x = (i / (revenueData.length - 1 || 1)) * 100;
                          // Scale points relative to chartMax
                          const y = 100 - ((Math.max(d.revenue, 0) / chartMax) * 100);
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    </svg>

                    {/* Points and Tooltips Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {revenueData.map((data, index) => {
                        const x = (index / (revenueData.length - 1 || 1)) * 100;
                        // Scale points relative to chartMax
                        const y = 100 - ((Math.max(data.revenue, 0) / chartMax) * 100);

                        // Show label logic
                        const showLabel =
                          (timeRange === '30d' && index % 5 === 0) ||
                          (timeRange === '7d') ||
                          (timeRange === '24h' && index % 4 === 0);

                        return (
                          <div
                            key={index}
                            className="absolute flex flex-col items-center group pointer-events-auto"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)' // Center the point
                            }}
                          >
                            {/* Dot */}
                            <div className="w-2 h-2 bg-white border-2 border-[#22d3ee] rounded-full z-10" />

                            {/* Tooltip on Hover */}
                            <div className="opacity-0 group- absolute bottom-4 mb-1 bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                              ${(data.revenue || 0).toLocaleString()}
                              <div className="text-gray-400">{data.date}</div>
                            </div>

                            {/* Static X-Axis Label */}
                            {showLabel && (
                              <div className="absolute top-4 mt-2 text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                                {data.date.split(',')[0]}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;