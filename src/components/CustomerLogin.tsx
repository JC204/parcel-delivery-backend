import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoCustomers } from '../demoCustomer';
import { Eye, EyeOff } from 'lucide-react';

interface CustomerLoginProps {
  onLogin: (customerId: string) => void;
}

const CustomerLogin = ({ onLogin }: CustomerLoginProps) => {
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const found = demoCustomers.find(
      (customer) =>
        customer.customerId?.toLowerCase() === customerId.toLowerCase() &&
        customer.password === password
    );

    if (found) {
      setError('');
      onLogin(found.customerId);
      navigate('/customer-dashboard');
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

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded bg-gray-700 text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

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