-- Table 1: Profiles (auto-created on signup via trigger)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT CHECK (char_length(bio) <= 200),
  avatar_url TEXT,
  favorite_league TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: Matches
CREATE TABLE matches (
  id BIGINT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_team_logo TEXT,
  away_team_logo TEXT,
  league TEXT NOT NULL,
  competition_logo TEXT,
  match_date TIMESTAMP NOT NULL,
  home_score INT,
  away_score INT,
  status TEXT DEFAULT 'scheduled',
  home_form TEXT,
  away_form TEXT,
  injuries JSONB,
  venue TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 3: Predictions
CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  home_prob DECIMAL(5,2),
  draw_prob DECIMAL(5,2),
  away_prob DECIMAL(5,2),
  confidence DECIMAL(5,2),
  confidence_tier TEXT,
  top_pick_market TEXT,
  top_pick_odds DECIMAL(6,2),
  odds_movement TEXT,
  ai_preview_short TEXT,
  ai_preview_long TEXT,
  source TEXT DEFAULT 'odds-api',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 4: Prediction Results (WinForm track record)
CREATE TABLE prediction_results (
  id SERIAL PRIMARY KEY,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  prediction_id INT REFERENCES predictions(id),
  top_pick_market TEXT,
  top_pick_correct BOOLEAN,
  final_score TEXT,
  settled_at TIMESTAMP
);

-- Table 5: Watchlists
CREATE TABLE watchlists (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, match_id)
);

-- Table 6: User Predictions
CREATE TABLE user_predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  predicted_market TEXT,
  correct BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, match_id)
);

-- Indexes
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_league ON matches(league);
CREATE INDEX idx_matches_slug ON matches(slug);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_pred_results_settled ON prediction_results(settled_at);
CREATE INDEX idx_user_preds_user ON user_predictions(user_id);

-- Function and trigger for auto-profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS }
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
} LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are publicly readable" ON profiles;
CREATE POLICY "Profiles are publicly readable" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can read own watchlist" ON watchlists;
CREATE POLICY "Users can read own watchlist" ON watchlists FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into own watchlist" ON watchlists;
CREATE POLICY "Users can insert into own watchlist" ON watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from own watchlist" ON watchlists;
CREATE POLICY "Users can delete from own watchlist" ON watchlists FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own predictions" ON user_predictions;
CREATE POLICY "Users can read own predictions" ON user_predictions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own predictions" ON user_predictions;
CREATE POLICY "Users can insert own predictions" ON user_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Matches are publicly readable" ON matches;
CREATE POLICY "Matches are publicly readable" ON matches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Predictions are publicly readable" ON predictions;
CREATE POLICY "Predictions are publicly readable" ON predictions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Prediction results are publicly readable" ON prediction_results;
CREATE POLICY "Prediction results are publicly readable" ON prediction_results FOR SELECT USING (true);
