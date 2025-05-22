import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../store/adminOrdersSlice';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import dayjs from 'dayjs';
import DeleteReviewsSection from '@/components/admin-view/DeleteReviewsSection';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.adminOrders);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // ✅ Memoize chartData to prevent unnecessary recalculation
  const chartData = useMemo(() => {
    const salesData = orders.map((order) => {
      const date = dayjs(order.createdAt).format('YYYY-MM-DD');
      return {
        date,
        totalAmount: order.totalAmount,
      };
    });

    const groupedSales = salesData.reduce((acc, { date, totalAmount }) => {
      if (!acc[date]) {
        acc[date] = { date, totalAmount: 0 };
      }
      acc[date].totalAmount += totalAmount;
      return acc;
    }, {});

    return Object.values(groupedSales).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [orders]);

  // ✅ This effect now safely depends on memoized chartData
  useEffect(() => {
    const now = dayjs();

    const filtered = chartData.filter((entry) => {
      const entryDate = dayjs(entry.date);
      if (filter === 'last7') return entryDate.isAfter(now.subtract(7, 'day'));
      if (filter === 'last15') return entryDate.isAfter(now.subtract(15, 'day'));
      if (filter === 'last30') return entryDate.isAfter(now.subtract(30, 'day'));
      return true;
    });

    setFilteredData(filtered);
  }, [filter, chartData]);

  return (
    <div className="p-6 space-y-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold">Sales Overview</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="all">All Time</option>
          <option value="last7">Last 7 Days</option>
          <option value="last15">Last 15 Days</option>
          <option value="last30">Last 30 Days</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading sales data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : filteredData.length === 0 ? (
        <p>No sales data available for this period.</p>
      ) : (
        <>
          {/* Line Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Line Chart - Total Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalAmount" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Bar Chart - Daily Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalAmount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

       <DeleteReviewsSection />
    </div>
  );
};

export default Dashboard;
