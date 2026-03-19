-- =============================================================================
-- EXTENSIONS
-- =============================================================================
create extension if not exists unaccent;
create extension if not exists "uuid-ossp";

-- =============================================================================
-- TYPES
-- =============================================================================
create type checkout_payment_status as enum (
  'paid',
  'unpaid',
  'no_payment_required'
);

create type checkout_status as enum (
  'open',
  'complete',
  'expired'
);

-- =============================================================================
-- BASE TABLES
-- =============================================================================
create table if not exists sections (
  id         uuid        not null default gen_random_uuid(),
  name       text        not null,
  slug       text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint sections_pkey     primary key (id),
  constraint sections_name_key unique (name),
  constraint sections_slug_key unique (slug)
);

create table if not exists categories (
  id         uuid        not null default gen_random_uuid(),
  name       text        not null,
  slug       text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  constraint categories_pkey     primary key (id),
  constraint categories_name_key unique (name),
  constraint categories_slug_key unique (slug)
);

create table if not exists products (
  id          uuid        not null default gen_random_uuid(),
  name        text        not null,
  description text,
  price_cents integer     not null,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz,
  constraint products_pkey primary key (id)
);

create table if not exists stores (
  id                uuid         not null default gen_random_uuid(),
  stripe_account_id text         not null,
  is_active         boolean               default true,
  name              text         not null,
  phone_number      text,
  coordinates       text,
  address           text,
  image_url         text,
  neighborhood      text,
  description       text,
  created_at        timestamptz  not null default now(),
  updated_at        timestamptz,
  commission_rate   numeric(5,4) not null default 0.05,
  constraint stores_pkey                  primary key (id),
  constraint stores_stripe_account_id_key unique (stripe_account_id),
  constraint stores_commission_rate_check check (commission_rate >= 0 and commission_rate <= 1)
);

-- =============================================================================
-- RELATIONSHIP TABLES
-- =============================================================================
create table if not exists operating_hours (
  id         uuid    not null default gen_random_uuid(),
  store_id   uuid    not null,
  weekday    integer,
  start_hour time    not null,
  end_hour   time    not null,
  constraint operating_hours_pkey          primary key (id),
  constraint operating_hours_weekday_check check (weekday >= 0 and weekday <= 6),
  constraint operating_hours_store_fkey    foreign key (store_id) references stores (id) on delete cascade
);

create table if not exists store_categories (
  store_id    uuid not null,
  category_id uuid not null,
  constraint store_categories_pkey          primary key (store_id, category_id),
  constraint store_categories_store_fkey    foreign key (store_id)    references stores     (id) on delete cascade,
  constraint store_categories_category_fkey foreign key (category_id) references categories (id) on delete cascade
);

create table if not exists store_products (
  store_id       uuid    not null,
  product_id     uuid    not null,
  stock_quantity integer not null default 0,
  is_available   boolean generated always as (stock_quantity > 0) stored,
  constraint store_products_pkey                 primary key (store_id, product_id),
  constraint store_products_stock_quantity_check check (stock_quantity >= 0),
  constraint store_products_store_fkey           foreign key (store_id)   references stores   (id) on delete cascade,
  constraint store_products_product_fkey         foreign key (product_id) references products (id) on delete cascade
);

create table if not exists product_sections (
  product_id uuid not null,
  section_id uuid not null,
  constraint product_sections_pkey         primary key (product_id, section_id),
  constraint product_sections_product_fkey foreign key (product_id) references products (id) on delete cascade,
  constraint product_sections_section_fkey foreign key (section_id) references sections (id) on delete cascade
);

-- =============================================================================
-- USER & SALES TABLES
-- =============================================================================
create table if not exists profiles (
  id           uuid        not null default gen_random_uuid(),
  user_id      uuid,
  full_name    text,
  username     text        unique,
  phone_number text,
  avatar_url   text,
  is_deleted   boolean     not null default false,
  deleted_at   timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz,
  constraint profiles_pkey         primary key (id),
  constraint profiles_user_id_fkey foreign key (user_id)
    references auth.users (id) on delete set null
);

create table if not exists customers (
  id                 uuid        not null default gen_random_uuid(),
  profile_id         uuid        not null unique,
  stripe_customer_id text        not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz,
  constraint customers_pkey                   primary key (id),
  constraint customers_stripe_customer_id_key unique (stripe_customer_id),
  constraint customers_profile_fkey           foreign key (profile_id) references profiles (id)
);

create table if not exists orders (
  id               text        not null,
  profile_id       uuid        not null,
  customer_id      text,
  payment_intent   text,
  payment_status   checkout_payment_status,
  status           checkout_status,
  created_at       timestamptz,
  expires_at       timestamptz,
  updated_at       timestamptz,
  shipping_amount  integer,
  shipping_address jsonb,
  constraint orders_pkey         primary key (id),
  constraint orders_profile_fkey foreign key (profile_id) references profiles (id)
);

create table if not exists order_products (
  id          uuid        not null default gen_random_uuid(),
  order_id    text        not null,
  store_id    uuid        not null,
  product_id  uuid        not null,
  transfer_id text,
  quantity    integer     not null default 1,
  price_cents integer     not null,
  created_at  timestamptz          default now(),
  constraint order_products_pkey         primary key (id),
  constraint order_products_unique       unique (order_id, store_id, product_id),
  constraint order_products_order_fkey   foreign key (order_id)   references orders   (id) on delete cascade,
  constraint order_products_store_fkey   foreign key (store_id)   references stores   (id),
  constraint order_products_product_fkey foreign key (product_id) references products (id)
);

create table if not exists product_ratings (
  id               uuid        not null default gen_random_uuid(),
  order_product_id uuid,
  product_id       uuid        not null,
  store_id         uuid        not null,
  profile_id       uuid        not null,
  stars            integer     not null,
  comment          text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz,
  constraint product_ratings_pkey           primary key (id),
  constraint product_ratings_stars_check    check (stars >= 1 and stars <= 5),
  constraint product_ratings_order_product_fkey foreign key (order_product_id) references order_products (id) on delete set null,
  constraint product_ratings_product_fkey   foreign key (product_id) references products (id) on delete cascade,
  constraint product_ratings_store_fkey     foreign key (store_id)   references stores   (id),
  constraint product_ratings_profile_fkey   foreign key (profile_id) references profiles (id)
);

create table if not exists session_splits (
  session_id text        not null,
  splits     jsonb       not null,
  created_at timestamptz not null default now(),
  constraint session_splits_pkey primary key (session_id)
);

create table if not exists order_transfers (
  id                 uuid         not null default gen_random_uuid(),
  order_id           text         not null,
  store_id           uuid         not null,
  stripe_transfer_id text         not null,
  gross_amount       integer      not null,
  commission_rate    numeric(5,4) not null,
  transferred_amount integer      not null,
  created_at         timestamptz  not null default now(),
  constraint order_transfers_pkey                   primary key (id),
  constraint order_transfers_stripe_transfer_id_key unique (stripe_transfer_id),
  constraint order_transfers_order_fkey             foreign key (order_id)  references orders (id) on delete cascade,
  constraint order_transfers_store_fkey             foreign key (store_id)  references stores (id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================
create index if not exists idx_operating_hours_store_id      on operating_hours (store_id);
create index if not exists idx_operating_hours_weekday       on operating_hours (weekday);
create index if not exists idx_store_products_is_available   on store_products  (is_available);
create index if not exists idx_orders_profile_id             on orders          (profile_id);
create index if not exists idx_order_products_order_id       on order_products  (order_id);
create index if not exists idx_order_products_store_id       on order_products  (store_id);
create index if not exists idx_order_products_transfer_id    on order_products  (transfer_id);
create index if not exists idx_product_ratings_product_id    on product_ratings (product_id);
create index if not exists idx_product_ratings_product_store on product_ratings (product_id, store_id);
create index if not exists idx_product_ratings_store_id      on product_ratings (store_id);
create index if not exists idx_product_ratings_profile_id    on product_ratings (profile_id);
create index if not exists idx_order_transfers_order_id      on order_transfers (order_id);
create index if not exists idx_order_transfers_store_id      on order_transfers (store_id);
create index if not exists idx_stores_neighborhood           on stores          (neighborhood);
create index if not exists idx_stores_is_active              on stores          (is_active);
create index if not exists idx_profiles_is_deleted           on profiles        (is_deleted);
create index if not exists idx_profiles_username             on profiles        (username);
 
create unique index if not exists idx_orders_payment_intent on orders (payment_intent)
  where payment_intent is not null;

create unique index if not exists idx_product_ratings_order_product_id
  on product_ratings (order_product_id)
  where order_product_id is not null;

create unique index if not exists idx_profiles_user_id on profiles (user_id)
  where user_id is not null;

-- =============================================================================
-- FUNCTIONS
-- =============================================================================
create or replace function generate_slug()
returns trigger
language plpgsql as $$
begin
  new.slug := lower(unaccent(new.name));
  new.slug := regexp_replace(new.slug, '[^a-z0-9\-]+', '-', 'g');
  new.slug := trim(both '-' from new.slug);
  return new;
end;
$$;

create or replace function get_categories_by_neighborhood(p_neighborhood text)
returns table(id uuid, name text)
language sql stable as $$
  select distinct c.id, c.name
  from categories c
    inner join store_categories sc on sc.category_id = c.id
    inner join stores s            on s.id = sc.store_id
  where s.neighborhood = p_neighborhood;
$$;

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public as $$
begin
  insert into profiles (user_id) values (new.id);
  return new;
end;
$$;

-- =============================================================================
-- TRIGGERS
-- =============================================================================
create trigger trg_generate_sections_slug
  before insert or update on sections
  for each row execute function generate_slug();
 
create trigger trg_generate_categories_slug
  before insert or update on categories
  for each row execute function generate_slug();
 
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================================================
-- VIEWS
-- =============================================================================
create or replace view product_ratings_summary as
select
  product_id,
  count(id)                  as total_reviews,
  avg(stars)::numeric(10, 1) as average_rating
from product_ratings
group by product_id;

create or replace view product_store_ratings_summary as
select
  product_id,
  store_id,
  count(id)                  as total_reviews,
  avg(stars)::numeric(10, 1) as average_rating
from product_ratings
group by product_id, store_id;

create or replace view stores_ratings_summary as
select
  s.id,
  s.name,
  s.image_url,
  s.coordinates,
  s.neighborhood,
  s.created_at,
  coalesce(avg(r.stars), 0)::numeric(10, 1)                    as average_rating,
  count(r.id)                                                  as total_reviews,
  array_agg(distinct c.name) filter (where c.name is not null) as categories
from stores s
  left join product_ratings r   on r.store_id  = s.id
  left join store_categories sc on sc.store_id = s.id
  left join categories c        on c.id        = sc.category_id
group by s.id, s.name, s.image_url, s.coordinates, s.neighborhood, s.created_at;

create or replace view store_details_view as
select
  s.id,
  s.name,
  s.image_url,
  s.description,
  s.phone_number,
  s.address,
  s.coordinates,
  s.neighborhood,
  coalesce(
    (
      select round(avg(pr.stars), 1)
      from product_ratings pr
      where pr.store_id = s.id
    ),
    0
  ) as average_rating,
  (
    select count(pr.stars)
    from product_ratings pr
    where pr.store_id = s.id
  ) as total_reviews,
  coalesce(
    exists (
      select 1
      from operating_hours oh
      where oh.store_id = s.id
        and oh.weekday = extract(dow from now() at time zone 'America/Sao_Paulo')::int
        and (now() at time zone 'America/Sao_Paulo')::time between oh.start_hour and oh.end_hour
    ),
    false
  ) as is_open,
  (
    select jsonb_agg(
      jsonb_build_object(
        'weekday',    oh.weekday,
        'start_hour', oh.start_hour,
        'end_hour',   oh.end_hour
      )
      order by oh.weekday
    )
    from operating_hours oh
    where oh.store_id = s.id
  ) as operating_hours,
  (
    select jsonb_agg(
      jsonb_build_object(
        'id',           p.id,
        'name',         p.name,
        'description',  p.description,
        'price_cents',  p.price_cents,
        'image_url',    p.image_url,
        'is_available', sp.is_available,
        'sections',
        (
          select jsonb_agg(sec.name)
          from product_sections ps
            join sections sec on sec.id = ps.section_id
          where ps.product_id = p.id
        ),
        'ratings',
        (
          select jsonb_agg(
            jsonb_build_object(
              'id',         pr.id,
              'profile_id', pr.profile_id,
              'stars',      pr.stars,
              'comment',    pr.comment,
              'created_at', pr.created_at
            )
          )
          from product_ratings pr
          where pr.product_id = p.id
            and pr.store_id = s.id
        ),
        'average_rating',
        (
          select coalesce(round(avg(pr.stars), 1), 0)
          from product_ratings pr
          where pr.product_id = p.id
            and pr.store_id = s.id
        )
      )
    )
    from store_products sp
      join products p on p.id = sp.product_id
    where sp.store_id = s.id
  ) as products
from stores s;

-- =============================================================================
-- STUDY
-- =============================================================================
-- create or replace function validate_rating_user () returns trigger as $$
-- begin
--   if not exists (
--     select 1
--     from order_products op
--     join orders o on op.order_id = o.id
--     where op.id = new.order_product_id
--       and o.profile_id = new.profile_id
--   ) then
--     raise exception 'User cannot rate a product they did not purchase';
--   end if;
--   return new;
-- end;
-- $$ language plpgsql;

-- create trigger trigger_validate_rating before insert
-- or update on product_ratings for each row
-- execute function validate_rating_user ();