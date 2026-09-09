create table todos (
  id bigint generated always as identity primary key,
  task text not null,
  is_complete boolean not null default false,
  created_at timestamptz not null default now()
);

alter table todos enable row level security;

-- POC only: wide-open policy so the anon key can read/write directly from
-- the browser. Replace with real auth-scoped policies before this is
-- anything but a learning project.
create policy "Allow anon full access to todos"
  on todos
  for all
  to anon
  using (true)
  with check (true);
