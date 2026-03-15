/**
 * 브라우저용 Supabase 클라이언트
 * 환경 변수로 URL과 anon key 초기화 (없으면 null 반환하여 앱은 동작)
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ScoreRow, ScoreInsert } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabase();

/** 점수 저장 (Supabase 미설정 시 data/error 없이 실패) */
export async function saveScore(
  payload: ScoreInsert
): Promise<{ data: ScoreRow | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error("Supabase is not configured") };
  }
  const { data, error } = await supabase
    .from("scores")
    .insert({ player_name: payload.player_name, total_score: payload.total_score })
    .select("id, player_name, total_score, played_at")
    .single();

  return {
    data: data as ScoreRow | null,
    error: error as Error | null,
  };
}

/** 랭킹 조회 (상위 N명) */
export async function fetchRanking(
  limit = 10
): Promise<{ data: ScoreRow[]; error: Error | null }> {
  if (!supabase) {
    return { data: [], error: new Error("Supabase is not configured") };
  }
  const { data, error } = await supabase
    .from("scores")
    .select("id, player_name, total_score, played_at")
    .order("total_score", { ascending: false })
    .limit(limit);

  return {
    data: (data ?? []) as ScoreRow[],
    error: error as Error | null,
  };
}
