-- Tabela de comentários para avisos
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aviso_id INTEGER NOT NULL,
  session_id TEXT,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para busca por aviso
CREATE INDEX IF NOT EXISTS idx_comments_aviso_id ON comments(aviso_id);

-- Habilitar RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública
CREATE POLICY "Allow public read comments" ON comments
  FOR SELECT USING (true);

-- Política para inserção pública
CREATE POLICY "Allow public insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
