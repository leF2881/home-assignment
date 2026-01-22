
import {  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip ,CardBody,Card,User} from '@heroui/react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout, selectUsername } from '@/features/auth/authSlice';
import { selectIsConnected, selectIsConnecting } from '@/features/connection/connectionSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const username = useAppSelector(selectUsername);

const isConnected = useAppSelector(selectIsConnected);
const isConnecting = useAppSelector(selectIsConnecting);
  const handleLogout = () => {
    dispatch(logout());
    //protected route will navigate to login
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">SOC Dashboard</h1>
              <p className="text-xs text-zinc-500">Security Operations Center</p>
            </div>
          </div>
        </div>

        {/* Right - Token Timer */}
        <div className="flex items-center gap-3">


          {/* Connection Status */}
          <Chip 
            size="sm" 
            variant="flat"
            classNames={{
              base: isConnected 
                ? "bg-emerald-950 border border-emerald-900"
                : isConnecting
                ? "bg-yellow-950 border border-yellow-900"
                : "bg-red-950 border border-red-900",
              content: isConnected 
                ? "text-emerald-400 text-xs"
                : isConnecting
                ? "text-yellow-400 text-xs"
                : "text-red-400 text-xs"
            }}
          >
            <div className="flex items-center gap-1.5">
              <span 
                className={`w-1.5 h-1.5 rounded-full ${
                  isConnected 
                    ? 'bg-emerald-500 animate-pulse' 
                    : isConnecting
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-red-500'
                }`}
              ></span>
              {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
            </div>
          </Chip>

          <Card>
            <CardBody>
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <User
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                    }}
                    className="transition-transform"
                    name={
                      username && username[0].toUpperCase() + username.slice(1)
                    }
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    <p className="font-bold">Log Out</p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </Card>
        </div>
      </div>
    </header>
  );
}
