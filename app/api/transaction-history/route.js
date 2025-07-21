import { NextResponse } from 'next/server';

export async function GET() {
  // Mock transaction data
  const transactions = [
    { id: 1, date: '2024-06-01', reference_id: '1234567890', to: 'Coffee Shop', transaction_type: 'Do it Now Payment', amount: 1200.00, currency: 'MYR' },
    { id: 2, date: '2024-06-02', reference_id: '1234567890', to: 'Salary', transaction_type: 'Do it Now Payment', amount: 1000, currency: 'MYR' },
    { id: 3, date: '2024-06-03', reference_id: '1234567890', to: 'Groceries', transaction_type: 'Do it Now Payment', amount: 54810.16, currency: 'MYR' },
    { id: 4, date: '2024-06-04', reference_id: '1234567890', to: 'Gym Membership', transaction_type: 'Do it Now Payment', amount:  100, currency: 'MYR' },
    { id: 5, date: '2024-06-05', reference_id: '1234567890', to: 'Bookstore', transaction_type: 'Do it Now Payment', amount: 5000, currency: 'MYR' },
  ];
  return NextResponse.json(transactions);
} 