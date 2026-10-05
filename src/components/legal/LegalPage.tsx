import { useEffect, useState } from 'react';
import CTASection from '../homepage/CTASection';
import FAQSection from '../homepage/FAQSection';
import FeatureTicker from '../homepage/FeatureTicker';

export interface LegalSection {
  id: string;
  title: string;
  /** Paragraphs shown before the list */
  intro?: string[];
  items?: string[];
  /** Highlighted note shown after the list */
  note?: string;
  email?: string;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const LegalPage = ({ title, lastUpdated, sections }: LegalPageProps) => {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  // Highlight the table-of-contents entry for the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#FFFDF2]">
      <header className="bg-[#0F3934] pt-32 md:pt-36 pb-10 text-center text-white overflow-hidden">
        <h1 className="text-[2.5rem] md:text-[3.75rem] font-normal leading-tight">{title}</h1>
        <p className="mt-2 text-base md:text-xl text-white/90">Last Updated: {lastUpdated}</p>
        <FeatureTicker className="mt-12 md:mt-16" />
      </header>

      <div className="max-w-[60rem] mx-auto px-6 py-16 md:py-24 flex gap-16">
        <nav className="hidden md:block w-[13rem] shrink-0">
          <div className="sticky top-32">
            <h2 className="text-xl text-[#0A2623] mb-4">Table of contents</h2>
            <ul className="flex flex-col gap-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeId === s.id ? 'bg-[#0F3934] text-white' : 'text-[#0A2623B2] hover:text-[#0A2623]'
                    }`}
                  >
                    <span className={`size-2 rounded-full shrink-0 ${activeId === s.id ? 'bg-white' : 'bg-[#0A262333]'}`} />
                    <span className="truncate">{s.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <article className="flex-1 flex flex-col gap-8 text-[#0A2623B2] text-[0.9375rem] leading-relaxed text-justify">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-32">
              <h2 className="text-2xl text-[#0A2623] mb-3 text-left">{s.title}</h2>
              {s.intro?.map((p) => <p key={p} className="mb-4">{p}</p>)}
              {s.items && (
                <ul className="list-disc pl-6 mb-4">
                  {s.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              {s.note && <p className="border-l-2 border-[#0A262333] pl-4">{s.note}</p>}
              {s.email && (
                <p>
                  Email:{' '}
                  <a href={`mailto:${s.email}`} className="text-[#7AD371] hover:underline">{s.email}</a>
                </p>
              )}
            </section>
          ))}
        </article>
      </div>

      <FAQSection />
      <CTASection />
    </div>
  );
};

export default LegalPage;
