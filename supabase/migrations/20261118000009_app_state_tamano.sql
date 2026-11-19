-- Tope de 1 MB por persona en app_state (hoy el mayor pesa menos de 1 KB): evita que alguien llene el almacenamiento.
alter table public.app_state add constraint app_state_tamano_maximo check (octet_length(data::text) <= 1000000);
