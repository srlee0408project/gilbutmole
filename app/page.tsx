"use client";

/**
 * 두더지 게임 메인 페이지
 * 상태: idle(이름 입력) | playing(게임 중) | ended(결과/랭킹)
 * 제한 시간 30초, 3000점 이상 시 난이도 상승 (가짜 두더지 등장)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { GameStart } from "@/components/GameStart";
import { GameResult } from "@/components/GameResult";
import { MoleGrid } from "@/components/MoleGrid";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GAME_DURATION_MS, RANKING_LIMIT, DIFFICULTY_THRESHOLD, FAKE_MOLE_PENALTY } from "@/lib/game/constants";
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
  const [isHardMode, setIsHardMode] = useState(false);
  const [showDifficultyWarning, setShowDifficultyWarning] = useState(false);

  const scoreRef = useRef(0);
  const playerNameRef = useRef("");
  const gameEndedRef = useRef(false);
  const hardModeTriggeredRef = useRef(false);
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
    hardModeTriggeredRef.current = false;
    setIsHardMode(false);
    setShowDifficultyWarning(false);
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

  // 난이도 상승 체크
  const checkDifficulty = useCallback((score: number) => {
    if (!hardModeTriggeredRef.current && score >= DIFFICULTY_THRESHOLD) {
      hardModeTriggeredRef.current = true;
      setShowDifficultyWarning(true);
      // 2초간 경고 표시 후 하드모드 시작
      setTimeout(() => {
        setShowDifficultyWarning(false);
        setIsHardMode(true);
      }, 2000);
    }
  }, []);

  const handleHit = useCallback(
    (reactionTimeMs: number) => {
      if (gameEndedRef.current) return;
      const point = calculatePoint(reactionTimeMs);
      const newTotal = scoreRef.current + point;
      scoreRef.current = newTotal;
      setTotalScore(newTotal);
      checkDifficulty(newTotal);
      nextMole();
    },
    [nextMole, checkDifficulty]
  );

  const handleFakeHit = useCallback(() => {
    if (gameEndedRef.current) return;
    const newTotal = Math.max(0, scoreRef.current - FAKE_MOLE_PENALTY);
    scoreRef.current = newTotal;
    setTotalScore(newTotal);
    nextMole();
  }, [nextMole]);

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
    setIsHardMode(false);
    setShowDifficultyWarning(false);
    hardModeTriggeredRef.current = false;
    gameEndedRef.current = false;
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-8 px-4">
      {phase === "idle" && <GameStart onStart={handleStart} />}

      {phase === "playing" && (
        <div className="relative flex flex-col items-center gap-6">
          {/* 난이도 상승 경고 오버레이 */}
          {showDifficultyWarning && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/70">
              <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                <span className="text-4xl">⚠️</span>
                <p className="text-xl font-bold text-yellow-400">난이도 상승!</p>
                <p className="text-sm text-yellow-200">
                  보라색 두더지가 등장합니다!
                </p>
                <p className="text-sm text-red-400 font-semibold">
                  보라색 두더지를 잡으면 {FAKE_MOLE_PENALTY}점 감점!
                </p>
                <p className="text-sm text-green-400">
                  갈색 두더지만 잡으세요!
                </p>
              </div>
            </div>
          )}

          <div className="flex w-full max-w-md items-center justify-between rounded-xl bg-[var(--mole-surface)]/10 px-5 py-3 text-[var(--mole-text)]">
            <span className="text-lg font-medium">{playerName}</span>
            <CountdownTimer remainingMs={remainingMs} size={90} />
            <span className="tabular-nums text-2xl font-bold">{totalScore}점</span>
          </div>
          {isHardMode && (
            <div className="flex items-center gap-2 rounded-lg bg-purple-900/40 px-3 py-1 text-sm text-purple-300">
              <span>⚡</span>
              <span>하드 모드 — 보라색 두더지 주의!</span>
            </div>
          )}
          <MoleGrid
            roundIndex={moleKey}
            onHit={handleHit}
            onMiss={handleMiss}
            onFakeHit={handleFakeHit}
            isActive={phase === "playing" && !gameEndedRef.current && !showDifficultyWarning}
            isHardMode={isHardMode}
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
