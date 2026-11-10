import React from "react";

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full bg-amber-950/40 border-b border-amber-500/30 text-amber-200 text-xs px-4 py-2 text-center backdrop-blur-sm">
      <span className="font-semibold tracking-wide">NOTICE:</span> This project is not audited, endorsed or operated by Zama. Use at your own risk.
    </div>
  );
};
