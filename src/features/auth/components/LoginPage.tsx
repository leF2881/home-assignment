import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  login,
  clearError,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../authSlice';

export default function LoginPage() {
  const [username, setUsername] = useState('analyst');
  const [password, setPassword] = useState('s3cur3');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

return (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-large overflow-hidden border border-divider bg-content1">

      <div className="p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-large bg-content2 border border-divider">
              <svg
                className="w-7 h-7 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold text-foreground mb-2">
              SOC Dashboard
            </h1>
            <p className="text-sm text-foreground-500">
              Secure access to incident monitoring
            </p>
          </div>

          <Card className="bg-content1 border-divider">
            <CardBody className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isRequired
                />
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                />

                {error && (
                  <div className="p-3 rounded-medium bg-danger-50 border border-danger-200">
                    <p className="text-sm text-danger">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  color="primary"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Sign In
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="hidden md:block relative">
        <img
          src="/login-visual.png"
          alt="Security illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  </div>
);

}
