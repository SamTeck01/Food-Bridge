import { Outlet } from 'react-router-dom';
import MobileNav from '../MobileNav';
import VendorSidebar from '../VendorSidebar';
import VendorTopBar from '../VendorTopBar';

export default function VendorLayout() {
  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      {/* Sidebar on desktop, bottom tab bar on phones/tablets */}
      <div className="hidden lg:block"><VendorSidebar /></div>
      <div className="flex-1 min-w-0 lg:ml-[250px] flex flex-col min-h-screen pb-20 lg:pb-0">
        <VendorTopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
