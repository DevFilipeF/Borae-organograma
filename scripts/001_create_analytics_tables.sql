-- Tabela de visualizações de página
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  session_id TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos (cliques, interações)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  page_path TEXT,
  element_id TEXT,
  element_text TEXT,
  metadata JSONB,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões únicas
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  first_page TEXT,
  last_page TEXT,
  page_count INTEGER DEFAULT 1,
  duration_seconds INTEGER DEFAULT 0,
  is_bounce BOOLEAN DEFAULT true,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de curtidas (avisos)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aviso_id INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aviso_id, session_id)
);

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aviso_id INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de interações com BORUS
CREATE TABLE IF NOT EXISTS borus_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  question TEXT NOT NULL,
  response_type TEXT,
  was_helpful BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_aviso_id ON likes(aviso_id);
CREATE INDEX IF NOT EXISTS idx_comments_aviso_id ON comments(aviso_id);
CREATE INDEX IF NOT EXISTS idx_borus_interactions_created_at ON borus_interactions(created_at DESC);

-- Habilitar RLS mas permitir inserções anônimas para analytics
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE borus_interactions ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir inserções anônimas (necessário para analytics públicos)
CREATE POLICY "Allow anonymous inserts on page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on page_views" ON page_views FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts on analytics_events" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on analytics_events" ON analytics_events FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts on sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous updates on sessions" ON sessions FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous inserts on likes" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Allow anonymous deletes on likes" ON likes FOR DELETE USING (true);

CREATE POLICY "Allow anonymous inserts on comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on comments" ON comments FOR SELECT USING (true);

CREATE POLICY "Allow anonymous inserts on borus_interactions" ON borus_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on borus_interactions" ON borus_interactions FOR SELECT USING (true);
