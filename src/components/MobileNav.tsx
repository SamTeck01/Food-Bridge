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

const OrdersIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.667 3.667h14.666l-1.466 8.8H5.133L3.667 3.667Z"
      stroke={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="7.333" cy="18.333" r="1.1" fill={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} />
    <circle cx="15.583" cy="18.333" r="1.1" fill={active ? '#0A2623' : 'rgba(10,38,35,0.40)'} />
  </svg>
);

const SavedIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 18.333S2.75 13.75 2.75 8.25a4.583 4.583 0 0 1 8.25-2.75A4.583 4.583 0 0 1 19.25 8.25c0 5.5-8.25 10.083-8.25 10.083Z"
      stroke={active ? '#0A2623' : 'rgba(10,38,35,0.40)'}
      fill={active ? 'rgba(10,38,35,0.12)' : 'none'}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


/* ── Component ─────────────────────────────────────────────────────── */
const MobileNav = () => {
  const { pathname } = useLocation();
  const { isLoggedIn, user } = useApp();

  const isVendor = user?.role === 'vendor';
  const middlePath = isLoggedIn ? (isVendor ? '/vendor/post-listing' : '/cart') : '/get-started';
  const middleLabel = isVendor ? 'Post' : 'Cart';

  const tabs = isVendor
    ? [
        { path: '/vendor/dashboard', label: 'Home',     Icon: HomeIcon },
        { path: '/vendor/listings',  label: 'Listings', Icon: ListingsIcon },
        { path: '/vendor/impact',    label: 'Impact',   Icon: ImpactIcon },
        { path: '/vendor/profile',   label: 'Profile',  Icon: ProfileIcon },
      ]
    : [
        { path: '/listings', label: 'Explore', Icon: ListingsIcon },
        { path: '/orders',   label: 'Orders',  Icon: OrdersIcon },
        { path: '/saved',    label: 'Saved',   Icon: SavedIcon },
        { path: '/profile',  label: 'Profile', Icon: ProfileIcon },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F9F9F9] border-t border-[rgba(0,0,0,0.10)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around px-2 h-[70px]">
        {/* Render first 2 tabs */}
        {tabs.slice(0, 2).map(({ path, label, Icon }) => {
          const active = pathname === path || (path !== '/' && pathname.startsWith(path));
          return (
            <Link
              key={label}
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

        {/* Middle action button — circular pill (Post or Cart) */}
        <Link
          to={middlePath}
          className="flex flex-col items-center gap-1 flex-1 py-2"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A2623] border border-[rgba(0,0,0,0.10)] relative">
            {isVendor ? (
              <AddIcon />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-[11px] font-questrial text-[rgba(10,38,35,0.40)]">{middleLabel}</span>
        </Link>

        {/* Render last 2 tabs */}
        {tabs.slice(2, 4).map(({ path, label, Icon }) => {
          const active = pathname === path || (path !== '/' && pathname.startsWith(path));
          return (
            <Link
              key={label}
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
      </div>
    </nav>
  );
};

export default MobileNav;
