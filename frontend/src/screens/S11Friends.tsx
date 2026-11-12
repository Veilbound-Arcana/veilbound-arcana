import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, UserPlus, ArrowRight, Shield } from "lucide-react";
import { MOCK_FRIENDS } from "@/data/friends";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";
import { CARD_MAP } from "@/data/generateCards";
import { AspectGlyph } from "@/components/AspectGlyph";

export const S11Friends: React.FC = () => {
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState(false);
  const [friendsList, setFriendsList] = useState(MOCK_FRIENDS);
  const [addCodeInput, setAddCodeInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const myFriendCode = "WARDEN-7829-MIST";

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(myFriendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAddFriend = () => {
    if (!addCodeInput.trim()) return;
    const newFriend = {
      id: `f-${Date.now()}`,
      name: `Warden ${addCodeInput.toUpperCase().slice(0, 6)}`,
      code: addCodeInput.toUpperCase(),
      level: 4,
      featuredCardIds: ["c-002"],
      tradableCardIds: ["c-002", "c-004", "c-006"],
    };
    setFriendsList([newFriend, ...friendsList]);
    setAddCodeInput("");
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between bg-cool-mist text-ink relative select-none">
      <Header
        title="Wardens"
        subtitle={`${friendsList.length} Allies Connected`}
        onBack={() => navigate("/")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* My Friend Code Banner */}
        <div className="bg-gradient-to-r from-violet to-purple-800 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-wider opacity-80 block">
              YOUR WARDEN CODE
            </span>
            <span className="font-mono font-extrabold text-sm tracking-wider text-amber-300">
              {myFriendCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-ui font-bold active:scale-95 transition-all"
          >
            {copiedCode ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedCode ? "Copied" : "Share"}</span>
          </button>
        </div>

        {/* Add Friend Action */}
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-xs text-ink">Companions in the Mist</span>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-xs font-bold text-violet hover:underline"
          >
            <UserPlus size={14} />
            <span>Add Warden</span>
          </button>
        </div>

        {/* Friends Roster */}
        <div className="space-y-2 pb-16">
          {friendsList.map((friend) => {
            const avatarId = friend.featuredCardIds[0] || "c-001";
            const avatar = CARD_MAP[avatarId];

            return (
              <div
                key={friend.id}
                className="bg-white/90 rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  {/* Spirit Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                    {avatar ? (
                      <AspectGlyph aspect={avatar.aspect} size={22} />
                    ) : (
                      <Shield size={20} className="text-violet" />
                    )}
                    {/* Online status dot */}
                    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white bg-emerald-500" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-sm text-ink">{friend.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-violet/10 text-violet font-mono text-[9px] font-bold">
                        Lv.{friend.level}
                      </span>
                    </div>
                    <span className="text-[10px] text-ink-2 font-mono block">
                      {friend.code}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-ui">
                      {friend.tradableCardIds.length} tradable Arcana
                    </span>
                  </div>
                </div>

                {/* Initiate Trade Shortcut */}
                <button
                  onClick={() => navigate(`/trade?friendId=${friend.id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet/10 hover:bg-violet/20 text-violet text-xs font-ui font-bold active:scale-95 transition-all"
                >
                  <span>Trade</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Warden Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-base text-ink">Connect Warden</h3>
            <p className="text-xs text-ink-2">Enter their 16-character friend code below:</p>

            <input
              type="text"
              placeholder="e.g. WARDEN-XXXX-XXXX"
              value={addCodeInput}
              onChange={(e) => setAddCodeInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono uppercase outline-none focus:border-violet"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-ink-2 text-xs font-bold font-ui"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFriend}
                className="flex-1 py-2 rounded-xl bg-violet text-white text-xs font-bold font-ui shadow-sm"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
};
