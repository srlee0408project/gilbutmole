"use client";

/**
 * CountdownTimer - 원형 시계 스타일 카운트다운
 * SVG 원형 프로그레스 + 초침 애니메이션
 */

import { GAME_DURATION_MS } from "@/lib/game/constants";

interface CountdownTimerProps {
  remainingMs: number;
  size?: number;
}

export function CountdownTimer({ remainingMs, size = 80 }: CountdownTimerProps) {
  const totalSec = GAME_DURATION_MS / 1000;
  const remainingSec = Math.ceil(remainingMs / 1000);
  const progress = remainingMs / GAME_DURATION_MS; // 1 → 0

  const center = size / 2;
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - progress);

  // 초침 각도: 12시 방향(0)에서 시계방향으로 회전
  const handAngle = ((1 - progress) * 360);
  const handLength = radius * 0.7;
  const handRad = ((handAngle - 90) * Math.PI) / 180;
  const handX = center + handLength * Math.cos(handRad);
  const handY = center + handLength * Math.sin(handRad);

  const isUrgent = remainingSec <= 10;

  // 눈금 (12개, 시계처럼)
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const outerR = radius - 1;
    const innerR = i % 3 === 0 ? radius - 8 : radius - 5;
    return {
      x1: center + innerR * Math.cos(angle),
      y1: center + innerR * Math.sin(angle),
      x2: center + outerR * Math.cos(angle),
      y2: center + outerR * Math.sin(angle),
      major: i % 3 === 0,
    };
  });

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 배경 원 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="rgba(0,0,0,0.3)"
          stroke="var(--mole-hole-border)"
          strokeWidth="2"
        />

        {/* 프로그레스 링 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={isUrgent ? "#ef4444" : "var(--mole-accent)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />

        {/* 눈금 */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="var(--mole-text)"
            strokeWidth={t.major ? 2 : 1}
            opacity={t.major ? 0.6 : 0.3}
          />
        ))}

        {/* 초침 */}
        <line
          x1={center}
          y1={center}
          x2={handX}
          y2={handY}
          stroke={isUrgent ? "#ef4444" : "var(--mole-text)"}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: "x2 0.1s linear, y2 0.1s linear" }}
        />

        {/* 중심점 */}
        <circle cx={center} cy={center} r="3" fill="var(--mole-text)" />

        {/* 남은 초 텍스트 */}
        <text
          x={center}
          y={center + radius * 0.38}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isUrgent ? "#ef4444" : "var(--mole-text)"}
          fontSize={size * 0.16}
          fontWeight="bold"
          fontFamily="var(--font-geist-mono), monospace"
        >
          {remainingSec}
        </text>
      </svg>
    </div>
  );
}
