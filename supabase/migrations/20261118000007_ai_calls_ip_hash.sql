-- Límite por persona anónima (vista previa del recorrido): se guarda solo una huella de la IP, nunca la IP.
alter table public.ai_calls add column if not exists ip_hash text check (ip_hash is null or char_length(ip_hash) <= 64);
create index if not exists ai_calls_ip_fecha_idx on public.ai_calls (ip_hash, created_at desc) where ip_hash is not null;
