import { Outlet } from 'react-router-dom';
import VendorSidebar from '../VendorSidebar';
import VendorTopBar from '../VendorTopBar';

export default function VendorLayout() {
  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      <VendorSidebar />
      <div className="flex-1 ml-[250px] flex flex-col min-h-screen">
        <VendorTopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}