import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-0 sm:p-4 select-none">
      <div className="relative w-full sm:max-w-[430px] h-screen sm:h-[844px] bg-cool-mist text-ink flex flex-col overflow-hidden sm:rounded-[36px] shadow-2xl border-0 sm:border sm:border-white/20">
        {/* Dynamic Notch / Island indicator on desktop */}
        <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900/90 rounded-full z-50 pointer-events-none" />

        {/* Safe Area Top Padding */}
        <div className="h-[env(safe-area-inset-top,44px)] sm:h-10 shrink-0 w-full" />

        {/* App Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Safe Area Bottom Padding */}
        <div className="h-[env(safe-area-inset-bottom,20px)] sm:h-4 shrink-0 w-full" />
      </div>
    </div>
  );
};
