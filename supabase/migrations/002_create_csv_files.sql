-- CSV Files table
create table if not exists public.csv_files (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    file_name varchar(255) not null,
    original_name varchar(255) not null,
    file_size bigint not null,
    file_path text not null,
    mime_type varchar(100) default 'text/csv',
    row_count integer default 0,
    column_count integer default 0,
    columns jsonb,
    data_sample jsonb,
    status varchar(50) default 'pending',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Dashboards table
create table if not exists public.dashboards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    csv_file_id uuid references public.csv_files(id) on delete cascade,
    name varchar(255) not null,
    description text,
    layout_config jsonb default '{}'::jsonb,
    is_default boolean default false,
    is_public boolean default false,
    share_token uuid default gen_random_uuid(),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Charts table
create table if not exists public.charts (
    id uuid primary key default gen_random_uuid(),
    dashboard_id uuid not null references public.dashboards(id) on delete cascade,
    user_id uuid not null references public.users(id) on delete cascade,
    csv_file_id uuid references public.csv_files(id) on delete cascade,
    title varchar(255) not null,
    chart_type varchar(50) not null,
    config jsonb not null default '{}'::jsonb,
    position jsonb not null default '{"x": 0, "y": 0, "w": 6, "h": 4}'::jsonb,
    data_query jsonb not null default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Saved views table
create table if not exists public.saved_views (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    csv_file_id uuid references public.csv_files(id) on delete cascade,
    name varchar(255) not null,
    filters jsonb default '{}'::jsonb,
    sort_by jsonb default '[]'::jsonb,
    visible_columns jsonb default '[]'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- API Keys table
create table if not exists public.api_keys (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    key_name varchar(255) not null,
    api_key_hash text not null unique,
    last_used_at timestamptz,
    expires_at timestamptz,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- Activity logs table
create table if not exists public.activity_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id) on delete set null,
    action varchar(100) not null,
    resource_type varchar(50),
    resource_id uuid,
    details jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz default now()
);

-- Create Application Indexes
create index if not exists idx_csv_files_user_id on public.csv_files(user_id);
create index if not exists idx_csv_files_created_at on public.csv_files(created_at);
create index if not exists idx_csv_files_status on public.csv_files(status);
create index if not exists idx_dashboards_user_id on public.dashboards(user_id);
create index if not exists idx_dashboards_csv_file_id on public.dashboards(csv_file_id);
create index if not exists idx_dashboards_share_token on public.dashboards(share_token);
create index if not exists idx_charts_dashboard_id on public.charts(dashboard_id);
create index if not exists idx_charts_user_id on public.charts(user_id);
create index if not exists idx_saved_views_user_id on public.saved_views(user_id);
create index if not exists idx_api_keys_user_id on public.api_keys(user_id);
create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at);

-- GIN JSONB Indexes
create index if not exists idx_csv_files_columns_gin on public.csv_files using gin (columns);
create index if not exists idx_dashboards_layout_gin on public.dashboards using gin (layout_config);
create index if not exists idx_charts_config_gin on public.charts using gin (config);
