"use client";

import { useState, Suspense, useEffect } from "react";
import type { Cafe } from "@/types/cafe";
import CafeShell from "@/components/shell/CafeShell";
import CafeHero from "@/components/shell/CafeHero";
import BottomNav, { type TabId } from "@/components/shell/BottomNav";
import TopNav from "@/components/shell/TopNav";
import MenuSection from "@/components/menu/MenuSection";
import GamesSection from "@/components/games/GamesSection";
import StampCard from "@/components/loyalty/StampCard";
import AIBuddy from "@/components/ai/AIBuddy";
import QRModal from "@/components/qr/QRModal";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import { useStamps } from "@/lib/useStamps";

interface Props {
  cafe: Cafe;
}

export default function CafePageClient({ cafe }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("menu");
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    const key = `viewed_${cafe.slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: cafe.slug }),
    });
  }, [cafe.slug]);

  const { stamps, addStamp, claimReward } = useStamps(
    cafe.slug,
    cafe.loyalty?.stampsRequired ?? 5
  );

  return (
    <CafeShell cafe={cafe}>
      <TopNav cafe={cafe} active={activeTab} onChange={setActiveTab} />

      <div className="md:pt-16 pb-20 md:pb-0">
        <CafeHero cafe={cafe} onQRClick={() => setQrOpen(true)} />

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
          {activeTab === "menu" && (
            <Suspense fallback={null}>
              <MenuSection cafe={cafe} onOrder={cafe.loyalty ? addStamp : undefined} />
            </Suspense>
          )}
          {activeTab === "games" && cafe.features.games && (
            <GamesSection cafe={cafe} />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 mt-8 py-5 text-center">
          <p className="text-zinc-700 text-xs">
            Powered by{" "}
            <a href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors font-semibold">
              ScanPlayEat
            </a>
            {" "}· Digital menu & experience suite for local cafes
          </p>
        </div>
      </div>

      <BottomNav cafe={cafe} active={activeTab} onChange={setActiveTab} />

      {cafe.loyalty && (
        <StampCard loyalty={cafe.loyalty} stamps={stamps} onClaim={claimReward} />
      )}

      {cafe.features.aiAssistant && <AIBuddy cafe={cafe} />}

      <FeedbackButton cafeSlug={cafe.slug} cafeName={cafe.name} />

      <QRModal cafe={cafe} open={qrOpen} onClose={() => setQrOpen(false)} />
    </CafeShell>
  );
}
