import { Bell, LogOut, MapPin, Scan, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function VendorTopBar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const initial = user?.name?.charAt(0).toUpperCase() ?? 'V';
  const firstName = user?.name?.split(' ')[0] ?? 'Vendor';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F9F9F9] border-b border-black/[0.06] px-8 h-[80px] flex items-center justify-between">
      {/* Left side - Location select */}
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-[#0F3934]" />
        <span className="font-questrial text-[16px] font-medium text-[#0F3934]">Ilorin, Kwara</span>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Scan QR */}
        <button className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:border-[#7AD371] transition-all">
          <Scan size={18} className="text-[#0A2623]" />
        </button>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center hover:border-[#7AD371] transition-all">
          <Bell size={18} className="text-[#0A2623]" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-questrial">2</span>
        </button>

        {/* Profile pill with dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 h-10 pl-1.5 pr-3 rounded-full border border-black/10 bg-white hover:border-[#7AD371] transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#7AD371] flex items-center justify-center text-[#0F3934] text-sm font-semibold font-questrial">
              {initial}
            </div>
            <span className="font-questrial text-[14px] font-semibold text-[#0A2623]">Hi {firstName} 👋</span>
            <ChevronDown size={14} className="text-[rgba(10,38,35,0.7)]" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-black/10 shadow-lg py-1 z-50">
              <button 
                onClick={() => { setShowDropdown(false); navigate('/vendor/profile'); }}
                className="w-full text-left px-4 py-2 font-questrial text-sm text-[#0A2623] hover:bg-[#F9F9F9] transition-all"
              >
                My Profile
              </button>
              <button 
                onClick={() => { setShowDropdown(false); navigate('/vendor/verify-business'); }}
                className="w-full text-left px-4 py-2 font-questrial text-sm text-[#0A2623] hover:bg-[#F9F9F9] transition-all"
              >
                Verify Business
              </button>
              <hr className="my-1 border-black/[0.06]" />
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 font-questrial text-sm text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

