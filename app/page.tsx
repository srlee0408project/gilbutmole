"use client";

/**
 * 두더지 게임 메인 페이지
 * 상태: idle(이름 입력) | playing(게임 중) | ended(결과/랭킹)
 * 제한 시간 60초 기반
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { GameStart } from "@/components/GameStart";
import { GameResult } from "@/components/GameResult";
import { MoleGrid } from "@/components/MoleGrid";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GAME_DURATION_MS, RANKING_LIMIT } from "@/lib/game/constants";
import { calculatePoint } from "@/lib/game/scoring";
import { saveScore, fetchRanking } from "@/lib/supabase/client";
import type { ScoreRow } from "@/lib/supabase/types";

type GamePhase = "idle" | "playing" | "ended";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [playerName, setPlayerName] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [remainingMs, setRemainingMs] = useState(GAME_DURATION_MS);
  const [moleKey, setMoleKey] = useState(0);
  const [ranking, setRanking] = useState<ScoreRow[]>([]);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [playerRank, setPlayerRank] = useState(0);

  const scoreRef = useRef(0);
  const playerNameRef = useRef("");
  const gameEndedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef(0);

  const endGame = useCallback(async (finalScore: number) => {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRemainingMs(0);
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

  const handleStart = useCallback((name: string) => {
    setPlayerName(name);
    playerNameRef.current = name;
    setTotalScore(0);
    scoreRef.current = 0;
    setMoleKey(0);
    gameEndedRef.current = false;
    setRemainingMs(GAME_DURATION_MS);
    endTimeRef.current = Date.now() + GAME_DURATION_MS;
    setPhase("playing");
  }, []);

  // 카운트다운 타이머
  useEffect(() => {
    if (phase !== "playing") return;

    timerRef.current = setInterval(() => {
      const left = Math.max(0, endTimeRef.current - Date.now());
      setRemainingMs(left);
      if (left <= 0) {
        endGame(scoreRef.current);
      }
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, endGame]);

  const nextMole = useCallback(() => {
    setMoleKey((prev) => prev + 1);
  }, []);

  const handleHit = useCallback(
    (reactionTimeMs: number) => {
      if (gameEndedRef.current) return;
      const point = calculatePoint(reactionTimeMs);
      const newTotal = scoreRef.current + point;
      scoreRef.current = newTotal;
      setTotalScore(newTotal);
      nextMole();
    },
    [nextMole]
  );

  const handleMiss = useCallback(() => {
    if (gameEndedRef.current) return;
    nextMole();
  }, [nextMole]);

  const handlePlayAgain = useCallback(() => {
    setPhase("idle");
    setTotalScore(0);
    scoreRef.current = 0;
    setMoleKey(0);
    setRanking([]);
    setPlayerRank(0);
    setRemainingMs(GAME_DURATION_MS);
    gameEndedRef.current = false;
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-8 px-4">
      {phase === "idle" && <GameStart onStart={handleStart} />}

      {phase === "playing" && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full max-w-md items-center justify-between rounded-xl bg-[var(--mole-surface)]/10 px-5 py-3 text-[var(--mole-text)]">
            <span className="text-lg font-medium">{playerName}</span>
            <CountdownTimer remainingMs={remainingMs} size={90} />
            <span className="tabular-nums text-2xl font-bold">{totalScore}점</span>
          </div>
          <MoleGrid
            roundIndex={moleKey}
            onHit={handleHit}
            onMiss={handleMiss}
            isActive={phase === "playing" && !gameEndedRef.current}
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
