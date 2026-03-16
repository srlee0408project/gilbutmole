/**
 * 두더지 게임 설정 상수
 * 그리드 크기, 제한 시간, 점수·시간 관련 값
 */

/** 구멍 그리드 열/행 수 (3x3) */
export const GRID_COLS = 3;
export const GRID_ROWS = 3;
export const HOLE_COUNT = GRID_COLS * GRID_ROWS;

/** 게임 제한 시간 (ms) — 30초 */
export const GAME_DURATION_MS = 30_000;

/** 두더지가 구멍에 머무는 시간 범위 (ms) */
export const MOLE_VISIBLE_MIN_MS = 300;
export const MOLE_VISIBLE_MAX_MS = 2000;

/** 반응 속도 기반 점수: BASE_POINT - floor(reactionMs / PENALTY_PER_MS) */
export const BASE_POINT = 120;
export const PENALTY_PER_MS = 50;

/** 난이도 상승 점수 기준 */
export const DIFFICULTY_THRESHOLD = 3000;

/** 가짜 두더지 클릭 시 감점 */
export const FAKE_MOLE_PENALTY = 200;

/** 난이도 상승 후 가짜 두더지 등장 확률 (0~1) */
export const FAKE_MOLE_CHANCE = 0.3;

/** 랭킹 표시 개수 */
export const RANKING_LIMIT = 10;
