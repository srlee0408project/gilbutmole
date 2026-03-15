"use client";

/**
 * GameResult - 최종 점수 및 랭킹 표시
 */

import type { ScoreRow } from "@/lib/supabase/types";
import { RANKING_LIMIT } from "@/lib/game/constants";
import { MoleCharacter } from "./MoleCharacter";

interface GameResultProps {
  playerName: string;
  totalScore: number;
  ranking: ScoreRow[];
  /** 현재 플레이어의 순위 (1-based, 없으면 0) */
  playerRank: number;
  onPlayAgain: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function GameResult({
  playerName,
  totalScore,
  ranking,
  playerRank,
  onPlayAgain,
  isLoading = false,
  error = null,
}: GameResultProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 px-4">
      <div className="flex flex-col items-center gap-4">
        <MoleCharacter visible size={100} className="drop-shadow-lg" />
        <h2 className="font-display text-center font-bold text-[var(--mole-text)] text-2xl sm:text-3xl">
          게임 종료!
        </h2>
        <p className="text-center text-[var(--mole-text)] text-xl">
          <span className="font-semibold text-[var(--mole-accent)]">{playerName}</span>님의 점수
        </p>
        <p className="text-4xl font-bold tabular-nums text-[var(--mole-text)]">{totalScore}</p>
        {playerRank > 0 && (
          <p className="text-[var(--mole-text-muted)]">
            당신의 순위: <span className="font-semibold text-[var(--mole-text)]">{playerRank}위</span>
          </p>
        )}
      </div>

      <section className="w-full" aria-label="랭킹">
        <h3 className="mb-3 text-lg font-semibold text-[var(--mole-text)]">🏆 순위표</h3>
        {error && (
          <p className="py-2 text-center text-sm text-amber-400">
            랭킹을 불러오지 못했습니다. ({error})
          </p>
        )}
        {isLoading && (
          <p className="py-4 text-center text-[var(--mole-text-muted)]">불러오는 중...</p>
        )}
        {!isLoading && !error && ranking.length === 0 && (
          <p className="py-4 text-center text-[var(--mole-text-muted)]">
            아직 기록이 없습니다. 첫 번째 도전자가 되어 보세요!
          </p>
        )}
        {!isLoading && ranking.length > 0 && (
          <ul className="space-y-2">
            {ranking.slice(0, RANKING_LIMIT).map((row, i) => (
              <li
                key={row.id}
                className={`flex items-center justify-between rounded-lg px-4 py-2 ${
                  row.player_name === playerName && row.total_score === totalScore
                    ? "bg-[var(--mole-accent)]/20 ring-1 ring-[var(--mole-accent)]"
                    : "bg-[var(--mole-surface)]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 font-bold text-[var(--mole-text-muted)]">{i + 1}</span>
                  <span className="font-medium text-black">{row.player_name}</span>
                </span>
                <span className="tabular-nums text-black">{row.total_score}점</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        type="button"
        onClick={onPlayAgain}
        className="rounded-xl bg-[var(--mole-accent)] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[var(--mole-accent-hover)] active:scale-[0.98]"
      >
        다시 하기
      </button>
    </div>
  );
}
