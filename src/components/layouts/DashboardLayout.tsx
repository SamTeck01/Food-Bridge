import { Outlet } from 'react-router-dom';
// Add your Dashboard Sidebar/Header here if needed

const DashboardLayout = () => (
  <div className="min-h-screen">
    {/* No Navbar or Footer for Apps */}
    <Outlet />
  </div>
);
export default DashboardLayout;