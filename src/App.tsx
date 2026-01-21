import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">SOC Incident Dashboard</h1>
              <p className="text-gray-400">Setting up...</p>
            </div>
          </div>
        } />
      </Routes>
    </div>

  );
}

export default App;