"use client";

/**
 * 두더지 게임 메인 페이지
 * 상태: idle(이름 입력) | playing(게임 중) | ended(결과/랭킹)
 */

import { useCallback, useRef, useState } from "react";
import { GameStart } from "@/components/GameStart";
import { GameResult } from "@/components/GameResult";
import { MoleGrid } from "@/components/MoleGrid";
import { TOTAL_ROUNDS, RANKING_LIMIT } from "@/lib/game/constants";
import { calculatePoint } from "@/lib/game/scoring";
import { saveScore, fetchRanking } from "@/lib/supabase/client";
import type { ScoreRow } from "@/lib/supabase/types";

type GamePhase = "idle" | "playing" | "ended";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [playerName, setPlayerName] = useState("");
  const [roundIndex, setRoundIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [ranking, setRanking] = useState<ScoreRow[]>([]);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [playerRank, setPlayerRank] = useState(0);

  // ref로 최신 값 추적 → stale closure 방지
  const scoreRef = useRef(0);
  const roundRef = useRef(0);
  const playerNameRef = useRef("");

  const handleStart = useCallback((name: string) => {
    setPlayerName(name);
    playerNameRef.current = name;
    setTotalScore(0);
    scoreRef.current = 0;
    setRoundIndex(0);
    roundRef.current = 0;
    setPhase("playing");
  }, []);

  const endGame = useCallback(async (finalScore: number) => {
    setPhase("ended");
    setIsLoadingRanking(true);
    setRankingError(null);

    await saveScore({ player_name: playerNameRef.current, total_score: finalScore });

    const { data: rankingData, error } = await fetchRanking(RANKING_LIMIT);
    setIsLoadingRanking(false);
    if (error) {
      setRankingError(error.message);
      setRanking([]);
      setPlayerRank(0);
      return;
    }
    setRanking(rankingData);
    const idx = rankingData.findIndex(
      (r) => r.player_name === playerNameRef.current && r.total_score === finalScore
    );
    setPlayerRank(idx >= 0 ? idx + 1 : 0);
  }, []);

  const advanceRound = useCallback(
    (currentScore: number) => {
      const nextRound = roundRef.current + 1;
      roundRef.current = nextRound;
      setRoundIndex(nextRound);
      if (nextRound >= TOTAL_ROUNDS) {
        endGame(currentScore);
      }
    },
    [endGame]
  );

  const handleHit = useCallback(
    (reactionTimeMs: number) => {
      const point = calculatePoint(reactionTimeMs);
      const newTotal = scoreRef.current + point;
      scoreRef.current = newTotal;
      setTotalScore(newTotal);
      advanceRound(newTotal);
    },
    [advanceRound]
  );

  const handleMiss = useCallback(() => {
    advanceRound(scoreRef.current);
  }, [advanceRound]);

  const handlePlayAgain = useCallback(() => {
    setPhase("idle");
    setRoundIndex(0);
    roundRef.current = 0;
    setTotalScore(0);
    scoreRef.current = 0;
    setRanking([]);
    setPlayerRank(0);
  }, []);

  const displayRound = Math.min(roundIndex + 1, TOTAL_ROUNDS);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-8 px-4">
      {phase === "idle" && <GameStart onStart={handleStart} />}

      {phase === "playing" && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full max-w-sm items-center justify-between rounded-xl bg-[var(--mole-surface)]/10 px-4 py-2 text-[var(--mole-text)]">
            <span className="font-medium">{playerName}</span>
            <span className="tabular-nums font-bold">
              {displayRound} / {TOTAL_ROUNDS} · {totalScore}점
            </span>
          </div>
          <MoleGrid
            roundIndex={roundIndex}
            onHit={handleHit}
            onMiss={handleMiss}
            isActive={phase === "playing" && roundIndex < TOTAL_ROUNDS}
          />
        </div>
      )}

      {phase === "ended" && (
        <GameResult
          playerName={playerName}
          totalScore={totalScore}
          ranking={ranking}
          playerRank={playerRank}
          onPlayAgain={handlePlayAgain}
          isLoading={isLoadingRanking}
          error={rankingError}
        />
      )}
    </main>
  );
}
