import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { getListings } from '../services/listings.service';
import type { Listing } from '../services/listings.service';

/* ── Radial progress ring ─────────────────────────────────────────── */
const Ring = ({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct / 100, 1);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#F0F4F1" strokeWidth="6" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth="6" fill="none"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
    </svg>
  );
};

/* ── Week bar ─────────────────────────────────────────────────────── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ImpactPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    getListings(50).then(setListings).catch(() => setListings([]));
  }, []);

  const totalMeals    = listings.reduce((s, l) => s + l.claimsUsed, 0) + 128;
  const kgSaved       = Math.round(totalMeals * 0.14 * 10) / 10;
  const co2Saved      = Math.round(kgSaved * 2.5 * 10) / 10;
  const moneySaved    = totalMeals * 1500;

  const weekData = [32, 18, 45, 26, 52, 40, 28];
  const maxWeek  = Math.max(...weekData);

  const STATS = [
    {
      label: 'Meals Rescued',
      value: `${totalMeals}`,
      sub: '+12 today',
      icon: '🍽️',
      color: '#7AD371',
      bg: 'bg-[#7AD37115]',
      pct: Math.min((totalMeals / 500) * 100, 100),
    },
    {
      label: 'Food Waste Prevented',
      value: `${kgSaved}kg`,
      sub: 'this month',
      icon: '♻️',
      color: '#0F3934',
      bg: 'bg-[#0F393415]',
      pct: Math.min((kgSaved / 100) * 100, 100),
    },
    {
      label: 'CO₂ Prevented',
      value: `${co2Saved}kg`,
      sub: 'equivalent',
      icon: '🌱',
      color: '#22C55E',
      bg: 'bg-[#22C55E15]',
      pct: Math.min((co2Saved / 250) * 100, 100),
    },
    {
      label: 'Money Saved',
      value: `₦${(moneySaved / 1000).toFixed(1)}K`,
      sub: 'community total',
      icon: '💰',
      color: '#F59E0B',
      bg: 'bg-[#F59E0B15]',
      pct: Math.min((moneySaved / 1000000) * 100, 100),
    },
  ];

  const TIPS = [
    { icon: '🥡', text: 'Store leftovers in airtight containers to extend freshness by 3-5 days.' },
    { icon: '📅', text: "Plan meals weekly to buy only what you need — it's better for your wallet and the planet." },
    { icon: '🥕', text: 'Imperfect vegetables are just as nutritious. Support vendors offering surplus produce.' },
    { icon: '❄️', text: 'Freeze surplus food before it expires. Most cooked meals last 3 months frozen.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg pb-24 md:pb-0">
      <Navbar />

      <main className="flex-1 py-10 px-4 md:px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-10">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <h1 className="font-questrial text-3xl md:text-4xl text-text-primary">
              Your Impact 🌱
            </h1>
            <p className="font-questrial text-base text-text-secondary max-w-xl">
              You've prevented <span className="font-semibold text-[#0F3934]">{kgSaved}kg</span> of food waste this week. Every meal claimed makes a difference.
            </p>
          </div>

          {/* ── Stats grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.10)] p-5 flex flex-col gap-4"
                style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${stat.bg} text-xl`}>
                    {stat.icon}
                  </div>
                  <Ring pct={stat.pct} color={stat.color} size={44} />
                </div>
                <div>
                  <p className="font-questrial text-2xl text-text-primary">{stat.value}</p>
                  <p className="font-questrial text-sm text-text-secondary">{stat.label}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-questrial"
                    style={{ background: `${stat.color}20`, color: stat.color }}>
                    {stat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Weekly activity ────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.10)] p-6"
            style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-questrial text-xl text-text-primary">Weekly Activity</h2>
                <p className="font-questrial text-sm text-text-secondary">Meals rescued this week</p>
              </div>
              <span className="font-questrial text-2xl text-[#0F3934]">
                {weekData.reduce((a, b) => a + b, 0)}
              </span>
            </div>

            {/* Bar chart */}
            <div className="flex items-end justify-between gap-2 h-28">
              {weekData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full relative flex items-end justify-center" style={{ height: '88px' }}>
                    <div
                      className="w-full rounded-lg transition-all duration-700"
                      style={{
                        height: `${Math.max(8, (val / maxWeek) * 80)}px`,
                        background: i === 4
                          ? 'linear-gradient(180deg, #7AD371 0%, #0F3934 100%)'
                          : '#F0F4F1',
                      }}
                    />
                  </div>
                  <span className="font-questrial text-[10px] text-text-muted">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Two column: leaderboard + tips ─────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Community leaderboard */}
            <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.10)] p-6"
              style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
              <h2 className="font-questrial text-xl text-text-primary mb-1">Community Board</h2>
              <p className="font-questrial text-sm text-text-secondary mb-5">Top rescuers this month</p>
              <div className="flex flex-col gap-3">
                {[
                  { rank: 1, name: 'Amaka O.',    meals: 47, badge: '🥇' },
                  { rank: 2, name: 'Bello K.',    meals: 39, badge: '🥈' },
                  { rank: 3, name: 'Chisom A.',   meals: 34, badge: '🥉' },
                  { rank: 4, name: 'David E.',    meals: 28, badge: null },
                  { rank: 5, name: 'Fatima M.',   meals: 21, badge: null },
                ].map(({ rank, name, meals, badge }) => (
                  <div key={rank} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F4F1] flex-shrink-0">
                      {badge
                        ? <span className="text-base">{badge}</span>
                        : <span className="font-questrial text-xs text-text-muted">{rank}</span>
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-questrial text-sm text-text-primary">{name}</span>
                        <span className="font-questrial text-xs text-text-muted">{meals} meals</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F0F4F1] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(meals / 47) * 100}%`, background: rank === 1 ? '#7AD371' : '#0F3934' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eco tips */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-questrial text-xl text-text-primary mb-1">Eco Tips</h2>
                <p className="font-questrial text-sm text-text-secondary">Small actions, big impact</p>
              </div>
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[rgba(0,0,0,0.10)]"
                  style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#7AD37115] text-xl flex-shrink-0">
                    {tip.icon}
                  </div>
                  <p className="font-questrial text-sm text-text-secondary leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Big CTA ────────────────────────────────────────── */}
          <div className="relative overflow-hidden bg-[#0F3934] rounded-3xl p-10 text-center">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#7AD371]/10 blur-2xl pointer-events-none" />
            <p className="font-questrial text-[#7AD371] text-sm mb-2 uppercase tracking-wide">Together we can do more</p>
            <h2 className="font-questrial text-3xl text-white mb-3">Every Meal Counts 🌍</h2>
            <p className="font-questrial text-white/70 text-base max-w-md mx-auto mb-6">
              Share your impact with friends and help grow the FoodBridge community. More rescuers = less waste.
            </p>
            <button
              onClick={() => navigator.share?.({ title: 'FoodBridge Impact', url: window.location.origin })
                .catch(() => navigator.clipboard.writeText(window.location.origin))}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#7AD371] text-[#0F3934] font-questrial text-base hover:bg-[#69C161] transition-all active:scale-[0.97]"
            >
              Share FoodBridge 🌿
            </button>
          </div>

        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ImpactPage;
