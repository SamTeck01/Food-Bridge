import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/* ── SVG icon atoms matching Figma exactly ─────────────────────────── */
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.75 8.79175L11 2.29175L19.25 8.79175V19.7084H13.75V14.2084H8.25V19.7084H2.75V8.79175Z"
      stroke={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ListingsIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19.25C15.5563 19.25 19.25 15.5563 19.25 11C19.25 6.44365 15.5563 2.75 11 2.75C6.44365 2.75 2.75 6.44365 2.75 11C2.75 15.5563 6.44365 19.25 11 19.25Z"
      stroke={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} strokeWidth="1.5" />
    <path d="M7.5625 11H14.4375M11 7.5625L14.4375 11L11 14.4375"
      stroke={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ImpactIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5822 20.1667C23.9065 17.4167 18.366 7.08337 11.0288 2.75004C10.1511 5.81671 8.8288 6.68337 6.265 9.81671C2.90155 13.8421 4.5763 18.5334 9.33208 20.1667C8.6107 19.2917 6.79578 17.4315 8.07793 14.9167C8.51424 14.0417 9.38517 13.1667 8.95261 11.4167C9.8034 11.8542 11.5637 12.3334 12.0003 14.5001C12.7126 13.6251 13.4474 11.8334 12.7683 9.72504C17.9874 13.5834 15.8219 17.5001 15.5822 20.1667Z"
      stroke={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 11C13.2091 11 15 9.20914 15 7C15 4.79086 13.2091 3 11 3C8.79086 3 7 4.79086 7 7C7 9.20914 8.79086 11 11 11Z"
      stroke={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} strokeWidth="1.5" />
    <path d="M4 19C4 15.6863 7.13401 13 11 13C14.866 13 18 15.6863 18 19"
      stroke={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AddIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3.75V14.25M3.75 9H14.25" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ── Component ─────────────────────────────────────────────────────── */
const MobileNav = () => {
  const { pathname } = useLocation();
  const { isLoggedIn, user } = useApp();

  const isVendor = user?.role === 'vendor';
  const postPath = isVendor ? '/post-listing' : '/get-started';

  const tabs = [
    { path: '/',         label: 'Home',     Icon: HomeIcon },
    { path: '/listings', label: 'Listings', Icon: ListingsIcon },
    { path: '/impact',   label: 'Impact',   Icon: ImpactIcon },
    { path: '/profile',  label: 'Profile',  Icon: ProfileIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F9F9F9] border-t border-[rgba(0,0,0,0.10)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2 h-[70px]">
        {tabs.map(({ path, label, Icon }) => {
          const active = pathname === path || (path !== '/' && pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center gap-1 flex-1 py-2 group"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-[10px] transition-colors ${
                active ? 'bg-white shadow-sm border border-[rgba(0,0,0,0.06)]' : ''
              }`}>
                <Icon active={active} />
              </div>
              <span className={`text-[11px] font-questrial transition-colors ${
                active ? 'text-[#0A2623]' : 'text-[rgba(10,38,35,0.40)]'
              }`}>{label}</span>
            </Link>
          );
        })}

        {/* Post button — circular pill */}
        <Link
          to={isLoggedIn ? postPath : '/get-started'}
          className="flex flex-col items-center gap-1 flex-1 py-2"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A2623] border border-[rgba(0,0,0,0.10)]">
            <AddIcon />
          </div>
          <span className="text-[11px] font-questrial text-[rgba(10,38,35,0.40)]">Post</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
