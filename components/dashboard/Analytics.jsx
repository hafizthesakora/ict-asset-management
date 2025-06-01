'use client';
import { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function InventoryAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    categoryDistribution: [],
    warehouseOccupancy: [],
    inventoryValue: [],
    stockMovement: [],
    topSuppliers: [],
    stockTransfers: [],
    peopleAssignments: [],
  });

  // Use refs to prevent infinite loops and track component state
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);
  const lastTimeframeRef = useRef(timeframe);

  // Process raw data into analytics format
  const processRawData = ({ categories, warehouses, suppliers, items }) => {
    try {
      // Process category distribution
      const categoryDistribution = (categories || []).map((category) => {
        const categoryItems = (items || []).filter(
          (item) => item?.categoryId === category?.id
        );
        return {
          title: category?.title || 'Unknown Category',
          count: categoryItems.length,
          value: categoryItems.reduce(
            (sum, item) => sum + (item?.price || 0) * (item?.stockQty || 0),
            0
          ),
        };
      });

      // Process warehouse occupancy
      const warehouseOccupancy = (warehouses || []).map((warehouse) => {
        const warehouseItems = (items || []).filter(
          (item) => item?.warehouseId === warehouse?.id
        );
        const totalStock = warehouseItems.reduce(
          (sum, item) => sum + (item?.stockQty || 0),
          0
        );
        return {
          title: warehouse?.title || 'Unknown Warehouse',
          stockQty: totalStock,
          capacity: warehouse?.capacity || 1000,
        };
      });

      // Process top suppliers
      const supplierStats = (suppliers || [])
        .map((supplier) => {
          const supplierItems = (items || []).filter(
            (item) => item?.supplierId === supplier?.id
          );
          return {
            title: supplier?.title || 'Unknown Supplier',
            itemCount: supplierItems.length,
            totalValue: supplierItems.reduce(
              (sum, item) => sum + (item?.price || 0) * (item?.stockQty || 0),
              0
            ),
          };
        })
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 10);

      // Generate mock time-series data
      const currentDate = new Date();
      const inventoryValue = [];
      const stockMovement = [];

      for (let i = 11; i >= 0; i--) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1
        );
        const monthName = date.toLocaleDateString('default', {
          month: 'short',
          year: '2-digit',
        });

        inventoryValue.push({
          month: monthName,
          value: Math.floor(Math.random() * 100000) + 50000,
        });

        stockMovement.push({
          date: monthName,
          additions: Math.floor(Math.random() * 100) + 20,
          transfers: Math.floor(Math.random() * 50) + 10,
        });
      }

      // Mock people assignments
      const totalItems = (items || []).length;
      const peopleAssignments = [
        { department: 'IT', count: Math.floor(totalItems * 0.3) },
        { department: 'HR', count: Math.floor(totalItems * 0.2) },
        { department: 'Finance', count: Math.floor(totalItems * 0.25) },
        { department: 'Operations', count: Math.floor(totalItems * 0.25) },
      ];

      return {
        categoryDistribution,
        warehouseOccupancy,
        inventoryValue,
        stockMovement,
        topSuppliers: supplierStats,
        stockTransfers: stockMovement,
        peopleAssignments,
      };
    } catch (err) {
      console.error('Error processing raw data:', err);
      throw new Error('Failed to process analytics data');
    }
  };

  // Fetch individual endpoints with better error handling
  const fetchIndividualEndpoints = async () => {
    try {
      const endpoints = [
        '/api/categories',
        '/api/warehouse',
        '/api/suppliers',
        '/api/items',
      ];

      const responses = await Promise.allSettled(
        endpoints.map((endpoint) =>
          fetch(endpoint).then((res) => {
            if (!res.ok) {
              throw new Error(`${endpoint} failed with status ${res.status}`);
            }
            return res.json();
          })
        )
      );

      // Check if any requests failed
      const failedRequests = responses.filter(
        (result) => result.status === 'rejected'
      );
      if (failedRequests.length > 0) {
        console.error('Some API requests failed:', failedRequests);
      }

      // Extract successful results with fallbacks
      const [categories, warehouses, suppliers, items] = responses.map(
        (result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.error(
              `Failed to fetch ${endpoints[index]}:`,
              result.reason
            );
            return []; // Return empty array as fallback
          }
        }
      );

      return { categories, warehouses, suppliers, items };
    } catch (err) {
      console.error('Error in fetchIndividualEndpoints:', err);
      throw new Error(`Failed to fetch data: ${err.message}`);
    }
  };

  // Main fetch function with comprehensive error handling
  const fetchAnalyticsData = async (currentTimeframe) => {
    // Prevent duplicate requests and check if component is still mounted
    if (isFetchingRef.current || !isMountedRef.current) {
      return;
    }

    // Don't refetch if timeframe hasn't actually changed
    if (
      lastTimeframeRef.current === currentTimeframe &&
      analytics.categoryDistribution.length > 0
    ) {
      return;
    }

    isFetchingRef.current = true;
    lastTimeframeRef.current = currentTimeframe;

    try {
      setLoading(true);
      setError(null);

      // Option 1: Try the analytics endpoint first
      try {
        const response = await fetch(
          `/api/analytics?timeframe=${currentTimeframe}`
        );

        if (response.ok) {
          const data = await response.json();
          if (isMountedRef.current) {
            setAnalytics(data);
            return;
          }
        } else if (response.status !== 404) {
          throw new Error(
            `Analytics API error: ${response.status} ${response.statusText}`
          );
        }
      } catch (analyticsError) {
        console.log(
          'Analytics endpoint not available, trying individual endpoints...',
          analyticsError.message
        );
      }

      // Option 2: Fetch individual endpoints
      const rawData = await fetchIndividualEndpoints();
      const processedAnalytics = processRawData(rawData);

      if (isMountedRef.current) {
        setAnalytics(processedAnalytics);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      if (isMountedRef.current) {
        setError(err.message || 'Failed to load analytics data');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  };

  // Effect to fetch data when timeframe changes or on mount
  useEffect(() => {
    fetchAnalyticsData(timeframe);
  }, [timeframe]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Calculate totals with error handling
  const calculateTotalItems = () => {
    try {
      return (analytics.categoryDistribution || []).reduce(
        (total, cat) => total + (cat?.count || 0),
        0
      );
    } catch {
      return 0;
    }
  };

  const calculateTotalValue = () => {
    try {
      return (analytics.categoryDistribution || []).reduce(
        (total, cat) => total + (cat?.value || 0),
        0
      );
    } catch {
      return 0;
    }
  };

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 p-6">
        <div className="text-xl font-medium text-gray-600">
          Loading analytics data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gray-50 p-6">
        <div className="text-xl font-medium text-red-600 mb-4">
          Error loading analytics: {error}
        </div>
        <button
          onClick={() => fetchAnalyticsData(timeframe)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Inventory Analytics Dashboard
        </h1>

        <div className="mt-4 md:mt-0">
          <label className="mr-2 font-medium">Time Period:</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border rounded p-2 bg-white"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Items</h3>
          <p className="text-2xl font-bold">
            {calculateTotalItems().toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Inventory Value</h3>
          <p className="text-2xl font-bold">
            ${calculateTotalValue().toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Warehouses</h3>
          <p className="text-2xl font-bold">
            {(analytics.warehouseOccupancy || []).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">
            Stock Transfers (Current Month)
          </h3>
          <p className="text-2xl font-bold">
            {(analytics.stockTransfers || []).length > 0
              ? analytics.stockTransfers[analytics.stockTransfers.length - 1]
                  ?.count ||
                analytics.stockTransfers[analytics.stockTransfers.length - 1]
                  ?.transfers ||
                0
              : 0}
          </p>
        </div>
      </div>

      {/* Main Charts - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Inventory by Category */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Inventory by Category</h2>
          {(analytics.categoryDistribution || []).length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="title"
                    label={({ title, percent }) =>
                      `${title}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {analytics.categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} items`,
                      props.payload.title,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No category data available
            </div>
          )}
        </div>

        {/* Warehouse Stock Levels */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Warehouse Occupancy</h2>
          {(analytics.warehouseOccupancy || []).length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.warehouseOccupancy}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stockQty" name="Current Stock" fill="#8884d8" />
                  <Bar dataKey="capacity" name="Capacity" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No warehouse data available
            </div>
          )}
        </div>
      </div>

      {/* Main Charts - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Inventory Value Trend */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Inventory Value Trend</h2>
          {(analytics.inventoryValue || []).length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.inventoryValue}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      'Inventory Value',
                    ]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="Total Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No inventory value trend data available
            </div>
          )}
        </div>

        {/* Stock Movement */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Stock Movement</h2>
          {(analytics.stockMovement || []).length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analytics.stockMovement}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="additions"
                    stroke="#82ca9d"
                    name="Stock Additions"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="transfers"
                    stroke="#ff7300"
                    name="Stock Transfers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No stock movement data available
            </div>
          )}
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Suppliers</h2>
          {(analytics.topSuppliers || []).length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={analytics.topSuppliers}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="title" width={100} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'totalValue'
                        ? `$${value.toLocaleString()}`
                        : value,
                      name === 'totalValue' ? 'Value' : 'Items',
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="itemCount" name="Item Count" fill="#8884d8" />
                  <Bar dataKey="totalValue" name="Total Value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No supplier data available
            </div>
          )}
        </div>

        {/* Item Assignments by Department */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Item Assignments by Department
          </h2>
          {(analytics.peopleAssignments || []).length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.peopleAssignments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="department"
                    label={({ department, percent }) =>
                      `${department}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {analytics.peopleAssignments.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} items`,
                      props.payload.department,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No assignment data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
