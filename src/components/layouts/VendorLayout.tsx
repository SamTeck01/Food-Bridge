import { Outlet } from 'react-router-dom';
import MobileNav from '../MobileNav'; // Your existing mobile navigation
import Sidebar from './Sidebar';

export default function VendorLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto">
        <div className="md:p-8 p-4">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation (Only visible on mobile) */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}