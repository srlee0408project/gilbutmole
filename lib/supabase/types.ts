/**
 * Supabase scores 테이블 타입 정의
 * DB 스키마와 동기화하여 사용
 */

export interface ScoreRow {
  id: string;
  player_name: string;
  total_score: number;
  played_at: string;
}

export interface ScoreInsert {
  player_name: string;
  total_score: number;
  played_at?: string;
}

export interface RankingEntry extends ScoreRow {
  rank?: number;
}
