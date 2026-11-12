import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Check, BookOpen, Swords, FastForward } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { TUTORIAL_STEPS } from "@/game/tutorial";

export const S00Tutorial: React.FC = () => {
  const navigate = useNavigate();
  const { save, setPlayerName, updateSettings, addCards, addEchoes } = useGameStore();

  const [stepIndex, setStepIndex] = useState(0);
  const [nameInput, setNameInput] = useState(save.playerName || "Warden");

  const currentStep = TUTORIAL_STEPS[stepIndex];

  const handleNext = () => {
    if (stepIndex === 1 && nameInput.trim()) {
      setPlayerName(nameInput.trim());
    }

    if (stepIndex < TUTORIAL_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      finishTutorial();
    }
  };

  const finishTutorial = () => {
    // Grant starter gifts
    addCards(["c-001", "c-002", "c-003", "c-004", "c-010"]);
    addEchoes(150);
    updateSettings({ tutorialCompleted: true });
    navigate("/");
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-slate-950 text-white relative select-none overflow-hidden p-6">
      {/* Top Progress & Skip */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xs text-amber-300">
            RITE OF INITIATION
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-300">
            {stepIndex + 1} / {TUTORIAL_STEPS.length}
          </span>
        </div>

        <button
          onClick={finishTutorial}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-ui"
        >
          <span>Skip</span>
          <FastForward size={13} />
        </button>
      </div>

      {/* Center Narrative Stage */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative max-w-xs mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Visual Icon per Step */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet to-purple-800 border border-amber-300/40 shadow-2xl flex items-center justify-center mb-6 text-amber-300">
              {stepIndex === 0 && <Sparkles size={36} />}
              {stepIndex === 1 && <span className="font-display font-bold text-2xl">W</span>}
              {stepIndex === 2 && <Sparkles size={36} />}
              {stepIndex === 3 && <BookOpen size={36} />}
              {stepIndex === 4 && <BookOpen size={36} />}
              {stepIndex === 5 && <Swords size={36} />}
              {stepIndex === 6 && <Check size={36} />}
            </div>

            <h2 className="font-display font-bold text-xl text-white mb-2">
              {currentStep.title}
            </h2>
            <p className="font-ui text-xs text-slate-300 leading-relaxed mb-4">
              {currentStep.description}
            </p>

            {/* Step 2: Name Input Field */}
            {stepIndex === 1 && (
              <div className="w-full mt-2">
                <input
                  type="text"
                  maxLength={18}
                  placeholder="Enter your title..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-400/40 text-center font-display font-bold text-white outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Button */}
      <div className="z-20">
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-ui font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95"
        >
          <span>{stepIndex < TUTORIAL_STEPS.length - 1 ? "Continue Initiation" : "Enter the Sanctuary"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
