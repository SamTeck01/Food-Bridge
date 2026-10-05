import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ActionModalProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}

/** Centered confirmation dialog matching the Figma modal frames (600px, icon on top) */
const ActionModal = ({ icon, title, subtitle, onClose, children }: ActionModalProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div className="absolute inset-0 bg-[#0A2623]/40 backdrop-blur-[2px]" onClick={onClose} />
    <div className="relative w-full max-w-[600px] bg-white rounded-[20px] px-6 md:px-[150px] py-14 flex flex-col items-center text-center font-questrial">
      <button onClick={onClose} aria-label="Close" className="absolute top-6 right-6 text-[#0A2623]/60 hover:text-[#0A2623]"><X size={20} /></button>
      <div className="mb-6">{icon}</div>
      <h2 className="text-[24px] text-[#0A2623]">{title}</h2>
      <p className="text-[16px] text-[#0A2623]/70 mt-1 mb-10">{subtitle}</p>
      <div className="w-full flex flex-col gap-3">{children}</div>
    </div>
  </div>
);

export const BagIcon = ({ tone, children }: { tone: 'green' | 'red'; children: ReactNode }) => (
  <div className={`relative w-[68px] h-[80px] rounded-b-[18px] rounded-t-[6px] flex items-end justify-center pb-4 ${tone === 'green' ? 'bg-[#7AD371] text-[#0F3934]' : 'bg-[#FDECEC] text-[#EF4444]'}`}>
    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-5 rounded-b-full bg-white" />
    {children}
  </div>
);

export default ActionModal;
