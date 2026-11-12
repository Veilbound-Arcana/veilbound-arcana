import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onHelp?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  onHelp,
  rightAction,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const hasBack = showBack || !!onBack;

  return (
    <header className="shrink-0 w-full z-20">
      <div className="h-14 px-4 flex items-center justify-between relative">
        <div className="w-10 flex items-center">
          {hasBack && (
            <button
              onClick={handleBack}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-ink-2 hover:text-ink active:scale-95 transition-transform"
              aria-label="Back"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>

        <div className="text-center absolute left-12 right-12 pointer-events-none">
          <h1 className="font-display font-bold text-base md:text-lg text-ink tracking-wide truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[10px] text-ink-2 font-mono truncate -mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-10 flex items-center justify-end">
          {rightAction ? (
            rightAction
          ) : onHelp ? (
            <button
              onClick={onHelp}
              className="w-8 h-8 rounded-full bg-white/70 border border-white flex items-center justify-center text-ink-2 hover:text-ink shadow-sm active:scale-95 transition-transform"
              aria-label="Help"
            >
              <HelpCircle size={18} />
            </button>
          ) : null}
        </div>
      </div>
      <div className="rainbow-hairline w-full" />
    </header>
  );
};
