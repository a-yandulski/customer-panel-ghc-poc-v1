import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormField, Icon } from '../components';
import { useAppContext } from '../contexts/AppContext';
import type { User } from '../types';

/**
 * Login Page Component
 * 
 * Implements the login flow from UX requirements:
 * - User enters email and password
 * - System validates credentials and displays errors
 * - User clicks "Login" to authenticate
 * - System redirects to dashboard on success
 * - User can click "Forgot Password" to reset
 */
export const Login: React.FC = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (formData.email === 'john.doe@example.com' && formData.password === 'password123') {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          company: 'Example Corp',
          twoFactorEnabled: true,
          billingAddress: {
            id: '1',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'US',
          },
        };
        setUser(mockUser);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Redirect to forgot password flow');
    // In a real app, this would redirect to password reset
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <Icon name="globe" size="xl" className="text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Customer Panel</h1>
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your domains, hosting, and support tickets
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <FormField
              name="email"
              label="Email address"
              type="email"
              value={formData.email}
              onChange={handleFieldChange}
              placeholder="your@email.com"
              validationRules={{
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              }}
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleFieldChange}
              placeholder="Enter your password"
              validationRules={{
                required: true,
                minLength: 8,
              }}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <Icon name="x-circle" size="sm" className="text-red-400 mr-2" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
              loading={loading}
              disabled={!formData.email || !formData.password}
              className="w-full"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                icon={<Icon name="user" size="sm" />}
                onClick={() => console.log('SSO login')}
              >
                Sign in with SSO
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              onClick={() => console.log('Redirect to registration')}
            >
              Contact us to get started
            </button>
          </div>

          {/* Demo credentials info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="text-sm text-blue-700">
              <strong>Demo Credentials:</strong><br />
              Email: john.doe@example.com<br />
              Password: password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
