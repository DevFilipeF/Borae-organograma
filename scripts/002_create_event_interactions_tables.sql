-- Tabela de curtidas de eventos
CREATE TABLE IF NOT EXISTS event_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, session_id)
);

-- Tabela de comentários de eventos
CREATE TABLE IF NOT EXISTS event_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_event_likes_event_id ON event_likes(event_id);
CREATE INDEX IF NOT EXISTS idx_event_likes_created_at ON event_likes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_comments_event_id ON event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_comments_created_at ON event_comments(created_at DESC);

-- Habilitar RLS
ALTER TABLE event_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir operações anônimas
CREATE POLICY "Allow anonymous inserts on event_likes" ON event_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on event_likes" ON event_likes FOR SELECT USING (true);
CREATE POLICY "Allow anonymous deletes on event_likes" ON event_likes FOR DELETE USING (true);

CREATE POLICY "Allow anonymous inserts on event_comments" ON event_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select on event_comments" ON event_comments FOR SELECT USING (true);

-- Habilitar Realtime para as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE event_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE event_comments;
