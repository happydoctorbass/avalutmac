-- ==============================================================================
-- Exchange Rates Module Schema (Primary Currency: KGS - Kyrgyzstani Som)
-- ==============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('developer', 'cashier')) default 'cashier',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_exchange_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'cashier', coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
exception when others then return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_exchange on auth.users;
create trigger on_auth_user_created_exchange
  after insert on auth.users
  for each row execute function public.handle_new_exchange_user();

create or replace function public.is_cashier()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'cashier'
  );
$$ language sql security definer stable;

create or replace function public.is_developer()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'developer'
  );
$$ language sql security definer stable;

create table if not exists public.currencies (
  id uuid primary key default gen_random_uuid(),
  code varchar(10) unique not null,
  name_ru varchar(100) not null,
  name_en varchar(100) not null,
  is_active boolean not null default true,
  position integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  currency_id uuid not null unique references public.currencies(id) on delete cascade,
  buy_price numeric(14, 4) not null check (buy_price >= 0),
  sell_price numeric(14, 4) not null check (sell_price >= 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.exchange_history (
  id uuid primary key default gen_random_uuid(),
  currency_id uuid not null references public.currencies(id) on delete cascade,
  old_buy_price numeric(14, 4),
  old_sell_price numeric(14, 4),
  new_buy_price numeric(14, 4) not null,
  new_sell_price numeric(14, 4) not null,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.log_exchange_rate_change()
returns trigger as $$
begin
  if (TG_OP = 'UPDATE') then
    if (OLD.buy_price is distinct from NEW.buy_price or OLD.sell_price is distinct from NEW.sell_price) then
      insert into public.exchange_history (
        currency_id, old_buy_price, old_sell_price, new_buy_price, new_sell_price, changed_by, created_at
      ) values (
        NEW.currency_id, OLD.buy_price, OLD.sell_price, NEW.buy_price, NEW.sell_price, NEW.updated_by, now()
      );
    end if;
  elsif (TG_OP = 'INSERT') then
    insert into public.exchange_history (
      currency_id, old_buy_price, old_sell_price, new_buy_price, new_sell_price, changed_by, created_at
    ) values (
      NEW.currency_id, null, null, NEW.buy_price, NEW.sell_price, NEW.updated_by, now()
    );
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists on_exchange_rate_changed on public.exchange_rates;
create trigger on_exchange_rate_changed
  after insert or update on public.exchange_rates
  for each row execute function public.log_exchange_rate_change();

-- Application display settings (e.g., display_font_size for TV board)
create table if not exists public.settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.currencies enable row level security;
alter table public.exchange_rates enable row level security;
alter table public.exchange_history enable row level security;
alter table public.settings enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "currencies_select_all" on public.currencies for select using (true);
create policy "currencies_all_auth" on public.currencies for all using (auth.role() = 'authenticated');

create policy "exchange_rates_select_all" on public.exchange_rates for select using (true);
create policy "exchange_rates_auth_update" on public.exchange_rates for update to authenticated
  using (public.is_cashier() or public.is_developer() or auth.role() = 'authenticated')
  with check (public.is_cashier() or public.is_developer() or auth.role() = 'authenticated');
create policy "exchange_rates_auth_insert" on public.exchange_rates for insert to authenticated
  with check (public.is_cashier() or public.is_developer() or auth.role() = 'authenticated');
create policy "exchange_rates_auth_delete" on public.exchange_rates for delete to authenticated
  using (public.is_developer());

create policy "exchange_history_select_all" on public.exchange_history for select using (true);
create policy "exchange_history_auth_insert" on public.exchange_history for insert to authenticated
  with check (public.is_cashier() or public.is_developer() or auth.role() = 'authenticated');
create policy "exchange_history_auth_delete" on public.exchange_history for delete to authenticated
  using (public.is_developer() or ((select profiles.role from public.profiles where profiles.id = auth.uid()) = 'developer'));

create policy "settings_select_all" on public.settings for select using (true);
create policy "settings_all_auth" on public.settings for all using (auth.role() = 'authenticated');

-- Enable Supabase Realtime for live board updates
alter publication supabase_realtime add table public.exchange_rates, public.settings;

-- Initial settings seed
insert into public.settings (key, value, description)
values ('display_font_size', '100', 'Font size scaling percentage for the public exchange rates board (e.g. 100, 120, 140, 160)')
on conflict (key) do nothing;
