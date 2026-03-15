/**
 * 두더지 게임 설정 상수
 * 그리드 크기, 라운드 수, 점수·시간 관련 값
 */

/** 구멍 그리드 열/행 수 (3x3) */
export const GRID_COLS = 3;
export const GRID_ROWS = 3;
export const HOLE_COUNT = GRID_COLS * GRID_ROWS;

/** 한 게임당 두더지 등장 횟수 */
export const TOTAL_ROUNDS = 10;

/** 두더지가 구멍에 머무는 시간 범위 (ms) */
export const MOLE_VISIBLE_MIN_MS = 800;
export const MOLE_VISIBLE_MAX_MS = 1500;

/** 반응 속도 기반 점수: BASE_POINT - floor(reactionMs / PENALTY_PER_MS) */
export const BASE_POINT = 120;
export const PENALTY_PER_MS = 50;

/** 랭킹 표시 개수 */
export const RANKING_LIMIT = 10;
