import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import apiService from '../../utils/api';


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeBookings: 0,
    carsInStock: 0,
    pendingTestDrives: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [chartHeight, setChartHeight] = useState(window.innerWidth >= 640 ? 220 : 160);

  useEffect(() => {
    const handleResize = () => setChartHeight(window.innerWidth >= 640 ? 220 : 160);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAdminStats();
      setStats(data);
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

  const formatLakh = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  const kpiCards = [
    {
      title: 'Total Sales',
      value: formatLakh(stats.totalSales || 0),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      accent: 'border-blue-500',
      bg: 'bg-blue-50',
      color: 'text-blue-600',
      border: 'border-blue-200',
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      accent: 'border-green-500',
      bg: 'bg-green-50',
      color: 'text-green-600',
      border: 'border-green-200',
    },
    {
      title: 'Cars In Stock',
      value: stats.carsInStock || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      accent: 'border-yellow-500',
      bg: 'bg-yellow-50',
      color: 'text-yellow-600',
      border: 'border-yellow-200',
    },
    {
      title: 'Pending Actions',
      value: stats.pendingTestDrives || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'border-red-500',
      bg: 'bg-red-50',
      color: 'text-red-600',
      border: 'border-red-200',
    },
  ];

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed' || s === 'ready for pickup') return 'bg-black text-white';
    if (s === 'pending') return 'bg-gray-200 text-gray-800';
    if (s === 'cancelled') return 'bg-gray-100 text-gray-500 line-through';
    return 'bg-gray-100 text-gray-600';
  };

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
        <div className="p-4 text-red-600 bg-red-50 rounded-md">{error}</div>
      </AdminLayout>
    );
  }

  // Chart math — adaptive step size, always ~5-6 Y-axis ticks
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
  const rawStep = maxRevenue / 5;
  // Round step up to a "nice" number
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceStep = Math.ceil(rawStep / magnitude) * magnitude;
  const chartMax = niceStep * 6;
  const ticks = [];
  for (let val = 0; val <= chartMax; val += niceStep) ticks.push(val);
  const reversedTicks = [...ticks].reverse();

  const chartPoints = revenueData.map((d, i) => {
    const x = revenueData.length > 1 ? (i / (revenueData.length - 1)) * 100 : 50;
    const y = 100 - ((Math.max(d.revenue, 0) / chartMax) * 100);
    return { x, y, ...d };
  });

  const polylinePoints = chartPoints.map(p => `${p.x},${p.y}`).join(' ');
  // Polygon for fill: add bottom-right and bottom-left corners
  const fillPoints = chartPoints.length > 0
    ? `${chartPoints.map(p => `${p.x},${p.y}`).join(' ')} ${chartPoints[chartPoints.length - 1].x},100 ${chartPoints[0].x},100`
    : '';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-widest">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">Monitor your dealership performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {kpiCards.map((card, i) => (
            <div key={i} className={`bg-white border ${card.border} border-l-4 ${card.accent} p-3 sm:p-5 rounded-sm shadow-sm`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">{card.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 leading-none mt-1 break-all">{card.value}</p>
                </div>
                <div className={`p-1.5 sm:p-2 rounded-lg ${card.bg} ${card.color} flex-shrink-0`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest">Sales Trend</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Revenue over last 30 days</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 border border-gray-100">Last 30 days</span>
          </div>

          {revenueData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-300">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-medium">No trend data available yet</p>
              <p className="text-xs mt-1">Sales data will appear here once bookings are processed</p>
            </div>
          ) : (
            <div className="flex gap-2">
              {/* Y-Axis */}
              <div className="flex flex-col justify-between text-[9px] sm:text-[10px] text-gray-400 w-10 sm:w-14 items-end pr-2 sm:pr-3 py-1 flex-shrink-0" style={{ height: chartHeight }}>
                {reversedTicks.map((tick, i) => (
                  <span key={i} className="leading-none">{formatLakh(tick)}</span>
                ))}
              </div>

              {/* Chart Column */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* SVG Chart area — shorter on mobile */}
                <div className="relative" style={{ height: chartHeight }}>
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {ticks.map((tick, i) => {
                      const y = 100 - ((tick / chartMax) * 100);
                      return (
                        <line
                          key={i}
                          x1="0" y1={y} x2="100" y2={y}
                          stroke={tick === 0 ? '#e5e7eb' : '#f3f4f6'}
                          strokeWidth={tick === 0 ? '0.8' : '0.4'}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}

                    {/* Fill Area */}
                    {fillPoints && (
                      <polygon points={fillPoints} fill="url(#salesGradient)" />
                    )}

                    {/* Line */}
                    {polylinePoints && (
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        points={polylinePoints}
                      />
                    )}
                  </svg>

                  {/* Interactive Dot Overlay — no date labels here */}
                  <div className="absolute inset-0">
                    {chartPoints.map((point, index) => (
                      <div
                        key={index}
                        className="absolute flex flex-col items-center group"
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 10,
                        }}
                      >
                        {/* Dot */}
                        <div className="w-2.5 h-2.5 bg-white border-2 border-blue-400 rounded-full cursor-pointer group-hover:scale-150 transition-transform duration-150 shadow-sm" />

                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 bg-gray-900 text-white text-[10px] py-1.5 px-2.5 rounded-md whitespace-nowrap z-20 pointer-events-none shadow-lg transition-opacity duration-150">
                          <div className="font-bold">₹{(point.revenue || 0).toLocaleString('en-IN')}</div>
                          <div className="text-gray-400">{point.date}</div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* X-Axis label row — contained below the chart */}
                <div className="relative h-5 mt-1">
                  {chartPoints.map((point, index) => {
                    const isMobile = window.innerWidth < 640;
                    const step = isMobile ? 9 : 5;
                    const showLabel = index % step === 0 || index === chartPoints.length - 1;
                    if (!showLabel) return null;
                    return (
                      <span
                        key={index}
                        className="absolute text-[9px] text-gray-400 whitespace-nowrap"
                        style={{
                          left: `${point.x}%`,
                          transform: 'translateX(-50%)',
                          top: 0,
                        }}
                      >
                        {point.date?.split(',')[0]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>


      </div>
    </AdminLayout>
  );
};

export default Dashboard;