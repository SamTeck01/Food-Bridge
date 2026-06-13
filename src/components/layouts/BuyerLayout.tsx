import { Outlet } from 'react-router-dom';
import BuyerNavbar from '../BuyerNavbar';
import MobileNav from '../MobileNav';

export default function BuyerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-bg pb-20 md:pb-0">
      {/* Top Navbar */}
      <BuyerNavbar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Navigation (Only visible on mobile) */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
