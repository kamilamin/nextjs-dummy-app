'use client'
import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/transaction-history');
        if (!res.ok) throw new Error('Failed to fetch transactions');
        const data = await res.json();
        console.log(data);
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.to.toLowerCase().includes(search.toLowerCase()) ||
      tx.date.includes(search)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Transaction History</h1>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          placeholder="Search by description or date..."
          className="w-full sm:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-center text-xs font-semibold text-blue-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-blue-700 uppercase tracking-wider">Reference ID</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-blue-700 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-blue-700 uppercase tracking-wider">Transaction Type</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">No transactions found.</td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="transition-colors">
                    <td className="px-6 py-4 text-center whitespace-nowrap">{tx.date}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{tx.reference_id}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{tx.to}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">{tx.transaction_type}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-right">{tx.amount} {tx.currency}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
