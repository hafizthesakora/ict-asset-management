'use client';
import { useState, useEffect, useCallback } from 'react';
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

  // Memoized fetch function to prevent infinite loops
  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Option 1: Try the analytics endpoint first
      let response = await fetch(`/api/analytics?timeframe=${timeframe}`);

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else if (response.status === 404) {
        // Option 2: If analytics endpoint doesn't exist, fetch individual endpoints
        console.log(
          'Analytics endpoint not found, fetching individual endpoints...'
        );
        await fetchIndividualEndpoints();
      } else {
        throw new Error(`Error fetching analytics: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      // Fallback to individual endpoints if analytics endpoint fails
      try {
        await fetchIndividualEndpoints();
      } catch (fallbackErr) {
        console.error('Fallback fetch also failed:', fallbackErr);
        setError(fallbackErr.message);
      }
    } finally {
      setLoading(false);
    }
  }, [timeframe]); // Only depend on timeframe

  // Fetch individual endpoints and process data
  const fetchIndividualEndpoints = async () => {
    try {
      const [categoriesRes, warehousesRes, suppliersRes, itemsRes] =
        await Promise.all([
          fetch('/api/categories'),
          fetch('/api/warehouse'),
          fetch('/api/suppliers'),
          fetch('/api/items'),
        ]);

      if (
        !categoriesRes.ok ||
        !warehousesRes.ok ||
        !suppliersRes.ok ||
        !itemsRes.ok
      ) {
        throw new Error('One or more API endpoints failed');
      }

      const [categories, warehouses, suppliers, items] = await Promise.all([
        categoriesRes.json(),
        warehousesRes.json(),
        suppliersRes.json(),
        itemsRes.json(),
      ]);

      // Process the data to match expected analytics format
      const processedAnalytics = processRawData({
        categories,
        warehouses,
        suppliers,
        items,
      });

      setAnalytics(processedAnalytics);
    } catch (err) {
      throw new Error(`Failed to fetch individual endpoints: ${err.message}`);
    }
  };

  // Process raw data into analytics format
  const processRawData = ({ categories, warehouses, suppliers, items }) => {
    // Process category distribution
    const categoryDistribution = categories.map((category) => {
      const categoryItems = items.filter(
        (item) => item.categoryId === category.id
      );
      return {
        title: category.title,
        count: categoryItems.length,
        value: categoryItems.reduce(
          (sum, item) => sum + (item.price * item.stockQty || 0),
          0
        ),
      };
    });

    // Process warehouse occupancy
    const warehouseOccupancy = warehouses.map((warehouse) => {
      const warehouseItems = items.filter(
        (item) => item.warehouseId === warehouse.id
      );
      const totalStock = warehouseItems.reduce(
        (sum, item) => sum + (item.stockQty || 0),
        0
      );
      return {
        title: warehouse.title,
        stockQty: totalStock,
        capacity: warehouse.capacity || 1000, // Default capacity if not provided
      };
    });

    // Process top suppliers
    const supplierStats = suppliers
      .map((supplier) => {
        const supplierItems = items.filter(
          (item) => item.supplierId === supplier.id
        );
        return {
          title: supplier.title,
          itemCount: supplierItems.length,
          totalValue: supplierItems.reduce(
            (sum, item) => sum + (item.price * item.stockQty || 0),
            0
          ),
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);

    // Generate mock time-series data (replace with real data if available)
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

    // Mock people assignments (replace with real data if available)
    const peopleAssignments = [
      { department: 'IT', count: Math.floor(items.length * 0.3) },
      { department: 'HR', count: Math.floor(items.length * 0.2) },
      { department: 'Finance', count: Math.floor(items.length * 0.25) },
      { department: 'Operations', count: Math.floor(items.length * 0.25) },
    ];

    return {
      categoryDistribution,
      warehouseOccupancy,
      inventoryValue,
      stockMovement,
      topSuppliers: supplierStats,
      stockTransfers: stockMovement, // Reuse stock movement data
      peopleAssignments,
    };
  };

  // Use useEffect with the memoized function
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Calculate totals
  const calculateTotalItems = () => {
    return analytics.categoryDistribution.reduce(
      (total, cat) => total + cat.count,
      0
    );
  };

  const calculateTotalValue = () => {
    return analytics.categoryDistribution.reduce(
      (total, cat) => total + cat.value,
      0
    );
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
      <div className="flex justify-center items-center h-64 bg-gray-50 p-6">
        <div className="text-xl font-medium text-red-600">
          Error loading analytics: {error}
        </div>
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
            {analytics.warehouseOccupancy.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">
            Stock Transfers (Current Month)
          </h3>
          <p className="text-2xl font-bold">
            {analytics.stockTransfers.length > 0
              ? analytics.stockTransfers[analytics.stockTransfers.length - 1]
                  .count ||
                analytics.stockTransfers[analytics.stockTransfers.length - 1]
                  .transfers
              : 0}
          </p>
        </div>
      </div>

      {/* Main Charts - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Inventory by Category */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Inventory by Category</h2>
          {analytics.categoryDistribution.length > 0 ? (
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
          {analytics.warehouseOccupancy.length > 0 ? (
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
          {analytics.inventoryValue.length > 0 ? (
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
          {analytics.stockMovement.length > 0 ? (
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
          {analytics.topSuppliers.length > 0 ? (
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
          {analytics.peopleAssignments.length > 0 ? (
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
