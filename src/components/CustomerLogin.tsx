import { useState } from 'react';
import {demoCustomers} from '../demoCustomer';
import { Customer } from '../types';

interface CustomerLoginProps {
  onLogin: (customerId: string) => void;
}

const CustomerLogin = ({ onLogin }: CustomerLoginProps) => {
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = demoCustomers.find(
      (customer: Customer) =>
        customer.customerId === customerId && customer.password === password
    );

    if (found) {
      setError('');
      onLogin(found.customerId);
    } else {
      setError('Invalid customer ID or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Customer Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700 text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
