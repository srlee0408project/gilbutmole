"use client";

/**
 * GameStart - 이름 입력 및 게임 시작
 */

import { useState, FormEvent } from "react";
import { MoleCharacter } from "./MoleCharacter";

interface GameStartProps {
  onStart: (playerName: string) => void;
}

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 20;

export function GameStart({ onStart }: GameStartProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < MIN_NAME_LENGTH) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setError(`이름은 ${MAX_NAME_LENGTH}자 이하로 입력해 주세요.`);
      return;
    }
    setError("");
    onStart(trimmed);
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4">
      <div className="flex flex-col items-center gap-4">
        <MoleCharacter visible size={120} className="drop-shadow-lg" />
        <h1 className="font-display text-center font-bold text-[var(--mole-text)] text-3xl sm:text-4xl">
          두더지 잡기
        </h1>
        <p className="text-center text-[var(--mole-text-muted)] text-lg">
          이름을 입력하고 게임을 시작하세요. 두더지가 나오면 빨리 클릭하세요!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <label htmlFor="player-name" className="sr-only">
          플레이어 이름
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="이름을 입력하세요"
          maxLength={MAX_NAME_LENGTH}
          autoComplete="off"
          className="w-full rounded-xl border-2 border-[var(--mole-hole-border)] bg-[var(--mole-surface)] px-4 py-3 text-black placeholder:text-[var(--mole-text-muted)] focus:border-[var(--mole-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--mole-accent)]/30"
        />
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="rounded-xl bg-[var(--mole-accent)] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[var(--mole-accent-hover)] active:scale-[0.98]"
        >
          게임 시작
        </button>
      </form>
    </div>
  );
}
