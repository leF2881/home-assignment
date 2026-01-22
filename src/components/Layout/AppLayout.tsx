import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useWebSocket } from '@/hooks/useWebSocket';

export default function AppLayout() {
    useWebSocket();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
