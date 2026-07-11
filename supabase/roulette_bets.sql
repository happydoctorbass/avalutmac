-- Actual live schema for roulette_bets (discovered from Supabase project).
-- App maps UI `color` <-> DB column `player_color`.

-- Expected columns:
--   number        integer (bet cell)
--   player_id     text
--   player_color  text (chip hex)
--   is_promo      boolean
--   updated_at    timestamptz

-- If creating from scratch:
create table if not exists public.roulette_bets (
  number integer primary key,
  player_id text not null,
  player_color text,
  is_promo boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.roulette_bets enable row level security;

drop policy if exists "roulette_bets_select_all" on public.roulette_bets;
create policy "roulette_bets_select_all"
  on public.roulette_bets for select using (true);

drop policy if exists "roulette_bets_insert_all" on public.roulette_bets;
create policy "roulette_bets_insert_all"
  on public.roulette_bets for insert with check (true);

drop policy if exists "roulette_bets_update_all" on public.roulette_bets;
create policy "roulette_bets_update_all"
  on public.roulette_bets for update using (true);

drop policy if exists "roulette_bets_delete_all" on public.roulette_bets;
create policy "roulette_bets_delete_all"
  on public.roulette_bets for delete using (true);

do $$
begin
  alter publication supabase_realtime add table public.roulette_bets;
exception
  when duplicate_object then null;
  when others then null;
end $$;
