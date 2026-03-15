/**
 * 반응 시간(ms)을 점수로 변환
 * 빠를수록 높은 점수, BASE_POINT에서 감점
 */

import { BASE_POINT, PENALTY_PER_MS } from "./constants";

/**
 * 두더지 등장 시각과 클릭 시각 차이(ms)로 점수 계산
 * @param reactionTimeMs 등장 후 클릭까지 걸린 시간 (ms)
 * @returns 0 이상의 정수 점수
 */
export function calculatePoint(reactionTimeMs: number): number {
  const penalty = Math.floor(reactionTimeMs / PENALTY_PER_MS);
  return Math.max(0, BASE_POINT - penalty);
}
