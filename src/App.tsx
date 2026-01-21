import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/components/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl">Dashboard (Coming Soon)</h1>
        </div>
      } />
    </Routes>
  );
}

export default App;