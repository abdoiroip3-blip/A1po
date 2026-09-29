import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  isPhoneFrame: boolean;
  onToggleFrame: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isPhoneFrame,
  onToggleFrame,
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneFrame) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-slate-100 dark:bg-slate-950 transition-colors">
        <main className="w-full max-w-xl min-h-screen bg-slate-50 dark:bg-slate-950 relative shadow-2xl flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 md:p-6 lg:p-8 bg-slate-200/80 dark:bg-slate-950 select-none">
      {/* Mobile Device Frame Container (Only framed on md+ screens, 100% full native on phones) */}
      <div className="w-full h-screen md:h-[844px] md:max-w-[400px] bg-slate-900 rounded-none md:rounded-[48px] p-0 md:p-3 shadow-2xl ring-0 md:ring-1 md:ring-slate-800/80 relative flex flex-col overflow-hidden">
        {/* Phone Speaker & Dynamic Island for Desktop Mockup */}
        <div className="hidden md:flex absolute top-0 left-0 right-0 z-40 justify-center items-center h-7 pointer-events-none">
          <div className="w-28 h-4 bg-slate-950 rounded-b-2xl flex items-center justify-center gap-2">
            <div className="w-10 h-1 bg-slate-800 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
          </div>
        </div>

        {/* Mobile Screen Area */}
        <div className="w-full h-full bg-slate-50 dark:bg-slate-950 md:rounded-[38px] overflow-hidden flex flex-col relative select-text">
          {/* Status Bar */}
          <div className="px-6 pt-2 pb-1 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 font-semibold select-none z-30 shrink-0">
            <span>{time || '09:41'}</span>
            <div className="flex items-center gap-1.5 opacity-80">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Child Content */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {children}
          </div>

          {/* iOS Bottom Indicator Bar */}
          <div className="hidden md:flex justify-center pb-2 pt-1 pointer-events-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
            <div className="w-32 h-1 bg-slate-400/60 dark:bg-slate-600/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
