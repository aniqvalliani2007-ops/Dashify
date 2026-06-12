-- ============================================
-- FUNCTIONS AND TRIGGERS FOR UPDATE TIMESTAMP
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_csv_files_updated_at ON public.csv_files;
CREATE TRIGGER update_csv_files_updated_at
    BEFORE UPDATE ON public.csv_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dashboards_updated_at ON public.dashboards;
CREATE TRIGGER update_dashboards_updated_at
    BEFORE UPDATE ON public.dashboards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_charts_updated_at ON public.charts;
CREATE TRIGGER update_charts_updated_at
    BEFORE UPDATE ON public.charts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_saved_views_updated_at ON public.saved_views;
CREATE TRIGGER update_saved_views_updated_at
    BEFORE UPDATE ON public.saved_views
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS FOR SESSION MANAGEMENT
-- ============================================

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.sessions 
    WHERE expires_at < NOW() OR revoked_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to record login attempts
CREATE OR REPLACE FUNCTION record_login_attempt(
    p_email VARCHAR,
    p_ip_address INET,
    p_success BOOLEAN
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.login_attempts (email, ip_address, success)
    VALUES (p_email, p_ip_address, p_success);
    
    -- Update last_login_at on successful login
    IF p_success THEN
        UPDATE public.users 
        SET last_login_at = NOW() 
        WHERE email = p_email;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get user by session token
CREATE OR REPLACE FUNCTION get_user_by_session_token(p_token UUID)
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    full_name VARCHAR,
    avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.full_name, u.avatar_url
    FROM public.users u
    INNER JOIN public.sessions s ON u.id = s.user_id
    WHERE s.session_token = p_token 
        AND s.expires_at > NOW() 
        AND s.revoked_at IS NULL
        AND u.is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Session policies
CREATE POLICY "Users can view own sessions"
    ON public.sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
    ON public.sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- CSV files policies
CREATE POLICY "Users can view own csv files"
    ON public.csv_files
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own csv files"
    ON public.csv_files
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own csv files"
    ON public.csv_files
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own csv files"
    ON public.csv_files
    FOR DELETE
    USING (auth.uid() = user_id);

-- Dashboards policies
CREATE POLICY "Users can view own dashboards"
    ON public.dashboards
    FOR SELECT
    USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can create dashboards"
    ON public.dashboards
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dashboards"
    ON public.dashboards
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dashboards"
    ON public.dashboards
    FOR DELETE
    USING (auth.uid() = user_id);

-- Charts policies
CREATE POLICY "Users can view own charts"
    ON public.charts
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create charts"
    ON public.charts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charts"
    ON public.charts
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own charts"
    ON public.charts
    FOR DELETE
    USING (auth.uid() = user_id);

-- Saved views policies
CREATE POLICY "Users can view own saved views"
    ON public.saved_views
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved views"
    ON public.saved_views
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved views"
    ON public.saved_views
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved views"
    ON public.saved_views
    FOR DELETE
    USING (auth.uid() = user_id);

-- API keys policies
CREATE POLICY "Users can view own api keys"
    ON public.api_keys
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create api keys"
    ON public.api_keys
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own api keys"
    ON public.api_keys
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own api keys"
    ON public.api_keys
    FOR DELETE
    USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view own activity logs"
    ON public.activity_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View for dashboard statistics
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT cf.id) as total_csv_files,
    COUNT(DISTINCT d.id) as total_dashboards,
    COUNT(DISTINCT c.id) as total_charts,
    COALESCE(SUM(cf.file_size), 0) as total_storage_bytes,
    MAX(cf.created_at) as last_upload_at
FROM public.users u
LEFT JOIN public.csv_files cf ON u.id = cf.user_id
LEFT JOIN public.dashboards d ON u.id = d.user_id
LEFT JOIN public.charts c ON u.id = c.user_id
GROUP BY u.id, u.email;

-- View for active sessions
CREATE OR REPLACE VIEW active_sessions AS
SELECT 
    s.user_id,
    u.email,
    COUNT(s.id) as session_count,
    MAX(s.created_at) as latest_session
FROM public.sessions s
JOIN public.users u ON s.user_id = u.id
WHERE s.expires_at > NOW() AND s.revoked_at IS NULL
GROUP BY s.user_id, u.email;

-- ============================================
-- STORAGE BUCKETS SETUP
-- ============================================

-- Create storage bucket for csv_files if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('csv_files', 'csv_files', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the csv_files bucket
CREATE POLICY "Allow authenticated users to upload CSVs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'csv_files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Allow authenticated users to read their own CSVs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'csv_files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Allow authenticated users to delete their own CSVs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'csv_files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
