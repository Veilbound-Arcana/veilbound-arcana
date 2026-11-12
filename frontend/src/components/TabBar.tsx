import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Layers, Users, Swords, Menu } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

export const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  const tabs = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/archive", label: t("nav.archive"), icon: Layers },
    { path: "/friends", label: t("nav.friends"), icon: Users },
    { path: "/battle", label: t("nav.battle"), icon: Swords },
    { path: "/menu", label: t("nav.menu"), icon: Menu },
  ];

  return (
    <nav
      className="shrink-0 h-16 w-full bg-white/80 backdrop-blur-md border-t border-white/60 flex items-center justify-around px-2 z-30"
      aria-label="Bottom Navigation"
    >
      {tabs.map((tab) => {
        const isActive =
          tab.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(tab.path);
        const Icon = tab.icon;

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all min-w-[44px] min-h-[44px] ${
              isActive ? "text-tab-active font-bold" : "text-ink-2 hover:text-ink"
            }`}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                isActive ? "bg-tab-active text-white shadow-sm" : ""
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] tracking-tight leading-none">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
