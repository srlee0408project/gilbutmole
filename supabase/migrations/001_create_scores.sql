-- 두더지 게임 점수 테이블
-- Supabase 대시보드 SQL Editor 또는 apply_migration으로 실행

CREATE TABLE scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  total_score integer NOT NULL CHECK (total_score >= 0),
  played_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_scores_total_score_desc ON scores (total_score DESC);
CREATE INDEX idx_scores_played_at_desc ON scores (played_at DESC);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for everyone" ON scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for everyone" ON scores FOR SELECT USING (true);
