-- File: init.sql

-- Create profiles table
create table
  public.profiles (
    id uuid not null,
    username text null,
    first_name text null,
    last_name text null,
    avatar_url text null,
    created_at timestamp with time zone null default timezone ('utc'::text, now()),
    customer_id text null,
    email text null,
    constraint profiles_pkey primary key (id),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
  ) tablespace pg_default;


-- Create function to handle new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$;

-- Create trigger for auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();


-- Create plans table
create table
  public.plans (
    id text not null default gen_random_uuid (),
    name text not null,
    description text null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint plans_pkey primary key (id)
  ) tablespace pg_default;

-- Create prices table
create table
  public.prices (
    id text not null default gen_random_uuid (),
    plan_id text null,
    amount integer not null,
    currency text not null,
    interval text not null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint prices_pkey primary key (id),
    constraint prices_plan_id_fkey foreign key (plan_id) references plans (id)
  ) tablespace pg_default;

-- Create subscriptions table
create table
  public.subscriptions (
    id text not null default gen_random_uuid (),
    user_id uuid null,
    plan_id text null,
    price_id text null,
    interval text not null,
    status text not null,
    current_period_start timestamp with time zone null,
    current_period_end timestamp with time zone null,
    cancel_at_period_end boolean null default false,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint subscriptions_pkey primary key (id),
    constraint subscriptions_user_id_key unique (user_id),
    constraint subscriptions_plan_id_fkey foreign key (plan_id) references plans (id),
    constraint subscriptions_price_id_fkey foreign key (price_id) references prices (id),
    constraint subscriptions_user_id_fkey foreign key (user_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

-- Create keepalive table
create table
  public.keep_alive (
    id bigint generated by default as identity not null,
    name text null default ''::text,
    random text null default gen_random_uuid (),
    constraint keep_alive_pkey primary key (id)
  ) tablespace pg_default;

-- Create emails table
create table
  public.emails (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone not null default now(),
    email text null,
    constraint emails_pkey primary key (id)
  ) tablespace pg_default;

CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  company TEXT,
  position TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  template_id UUID,
  CONSTRAINT chk_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  education JSONB,
  experience JSONB,
  skills JSONB,
  projects JSONB,
  certifications JSONB,
  languages JSONB,
  interests JSONB,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  template_id UUID,
  CONSTRAINT chk_status CHECK (status IN ('draft', 'published', 'archived'))
);

create table public.cv_profiles (
  id bigint generated always as identity not null,
  user_id uuid null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text null,
  website text null,
  linkedin text null,
  github text null,
  address text null,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  constraint cv_profiles_pkey primary key (id),
  constraint cv_profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Create trigger for auth.users
create trigger on_auth_user_signup
after insert on auth.users
for each row execute procedure public.handle_new_user_signup();

create or replace function public.handle_new_user_signup()
returns trigger as $$
declare
  display_name text;
  first_name text;
  last_name text;
begin
  -- Extract full name from raw metadata
  display_name := NEW.raw_user_meta_data->>'full_name';

  -- Derive first and last names from the full name
  if display_name is not null then
    first_name := split_part(display_name, ' ', 1);
    if strpos(display_name, ' ') > 0 then
      last_name := ltrim(substr(display_name, strpos(display_name, ' ') + 1));
    else
      last_name := null;
    end if;
  else
    first_name := null;
    last_name := null;
  end if;

  -- Insert into profiles table with the new columns added
  INSERT INTO public.profiles (id, username, avatar_url, first_name, last_name)
  VALUES (NEW.id, display_name, NEW.raw_user_meta_data->>'avatar_url', first_name, last_name);

  -- Insert into cv_profiles if an email or display name is available
  if NEW.email is not null or display_name is not null then
    INSERT INTO public.cv_profiles (user_id, email, first_name, last_name)
    VALUES (NEW.id, NEW.email, first_name, last_name);
  end if;

  RETURN NEW;
end;
$$ language plpgsql security definer;
