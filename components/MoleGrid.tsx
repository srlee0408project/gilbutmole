"use client";

/**
 * MoleGrid - 3x3 구멍 그리드, 랜덤 구멍에 두더지 등장/숨김 및 클릭 처리
 * 같은 구멍에 연속 등장하지 않도록 처리
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { MoleCharacter } from "./MoleCharacter";
import {
  HOLE_COUNT,
  MOLE_VISIBLE_MIN_MS,
  MOLE_VISIBLE_MAX_MS,
} from "@/lib/game/constants";

interface MoleGridProps {
  roundIndex: number;
  onHit: (reactionTimeMs: number) => void;
  onMiss: () => void;
  isActive: boolean;
}

function getRandomHoleIndex(excludeIndex: number | null): number {
  let index: number;
  do {
    index = Math.floor(Math.random() * HOLE_COUNT);
  } while (index === excludeIndex && HOLE_COUNT > 1);
  return index;
}

function getRandomVisibleDurationMs(): number {
  return MOLE_VISIBLE_MIN_MS + Math.floor(Math.random() * (MOLE_VISIBLE_MAX_MS - MOLE_VISIBLE_MIN_MS + 1));
}

export function MoleGrid({
  roundIndex,
  onHit,
  onMiss,
  isActive,
}: MoleGridProps) {
  const [activeHoleIndex, setActiveHoleIndex] = useState<number | null>(null);
  const moleAppearedAtRef = useRef<number>(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevHoleRef = useRef<number | null>(null);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      setActiveHoleIndex(null);
      clearHideTimeout();
      return;
    }

    const holeIndex = getRandomHoleIndex(prevHoleRef.current);
    prevHoleRef.current = holeIndex;
    setActiveHoleIndex(holeIndex);
    moleAppearedAtRef.current = Date.now();

    const durationMs = getRandomVisibleDurationMs();
    hideTimeoutRef.current = setTimeout(() => {
      hideTimeoutRef.current = null;
      setActiveHoleIndex(null);
      onMiss();
    }, durationMs);

    return () => clearHideTimeout();
  }, [roundIndex, isActive, onMiss, clearHideTimeout]);

  const handleHoleClick = useCallback(
    (index: number) => {
      if (!isActive || activeHoleIndex !== index) return;
      clearHideTimeout();
      const reactionTimeMs = Date.now() - moleAppearedAtRef.current;
      setActiveHoleIndex(null);
      onHit(reactionTimeMs);
    },
    [isActive, activeHoleIndex, onHit, clearHideTimeout]
  );

  return (
    <div
      className="grid gap-3 sm:gap-4"
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
      }}
    >
      {Array.from({ length: HOLE_COUNT }, (_, i) => {
        const isMoleVisible = activeHoleIndex === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleHoleClick(i)}
            disabled={!isActive}
            className="mole-hole flex min-h-[88px] min-w-[88px] items-center justify-center rounded-full border-4 border-[var(--mole-hole-border)] bg-[var(--mole-hole)] shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] transition-transform active:scale-95 disabled:cursor-default disabled:active:scale-100 sm:min-h-[100px] sm:min-w-[100px]"
            aria-label={isMoleVisible ? "두더지 잡기" : "빈 구멍"}
          >
            <MoleCharacter visible={isMoleVisible} size={64} className="pointer-events-none" />
          </button>
        );
      })}
    </div>
  );
}
