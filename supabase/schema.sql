-- Run this in your Supabase SQL editor

create table links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  original_url text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid references links(id) on delete cascade not null,
  source_tag text not null default 'direct',
  country text default '',
  referrer text default '',
  timestamp timestamptz default now()
);

-- RLS
alter table links enable row level security;
alter table clicks enable row level security;

create policy "Users manage own links" on links
  for all using (auth.uid() = user_id);

create policy "Anyone can insert clicks" on clicks
  for insert with check (true);

create policy "Users can read clicks on own links" on clicks
  for select using (
    exists (select 1 from links where links.id = clicks.link_id and links.user_id = auth.uid())
  );
