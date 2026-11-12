import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import { S00Tutorial } from "@/screens/S00Tutorial";
import { S01Splash } from "@/screens/S01Splash";
import { S02Home } from "@/screens/S02Home";
import { S03PackOpen } from "@/screens/S03PackOpen";
import { S04Reveal } from "@/screens/S04Reveal";
import { S05Summary } from "@/screens/S05Summary";
import { S06Archive } from "@/screens/S06Archive";
import { S07CardDetail } from "@/screens/S07CardDetail";
import { S08SetProgress } from "@/screens/S08SetProgress";
import { S09Spreads } from "@/screens/S09Spreads";
import { S10FolioShrine } from "@/screens/S10FolioShrine";
import { S11Friends } from "@/screens/S11Friends";
import { S12Trade } from "@/screens/S12Trade";
import { S13BattleLobby } from "@/screens/S13BattleLobby";
import { S14Matchmaking } from "@/screens/S14Matchmaking";
import { S15BattleBoard } from "@/screens/S15BattleBoard";
import { S16MenuSettings } from "@/screens/S16MenuSettings";
import { S17Shop } from "@/screens/S17Shop";

export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<S02Home />} />
        <Route path="/splash" element={<S01Splash />} />
        <Route path="/tutorial" element={<S00Tutorial />} />
        <Route path="/open" element={<S03PackOpen />} />
        <Route path="/reveal" element={<S04Reveal />} />
        <Route path="/summary" element={<S05Summary />} />
        <Route path="/archive" element={<S06Archive />} />
        <Route path="/card/:id" element={<S07CardDetail />} />
        <Route path="/sets" element={<S08SetProgress />} />
        <Route path="/spreads" element={<S09Spreads />} />
        <Route path="/folio" element={<S10FolioShrine />} />
        <Route path="/friends" element={<S11Friends />} />
        <Route path="/trade" element={<S12Trade />} />
        <Route path="/battle" element={<S13BattleLobby />} />
        <Route path="/matchmaking" element={<S14Matchmaking />} />
        <Route path="/duel" element={<S15BattleBoard />} />
        <Route path="/settings" element={<S16MenuSettings />} />
        <Route path="/shop" element={<S17Shop />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};
