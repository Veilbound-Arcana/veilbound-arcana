import React from "react";
import { HashRouter } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { AppRoutes } from "./routes";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <PhoneFrame>
        <AppRoutes />
      </PhoneFrame>
    </HashRouter>
  );
};
