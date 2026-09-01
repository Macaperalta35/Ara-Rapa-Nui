# Ara Rapa Nui

Sitio de turismo para Rapa Nui: paquetes turísticos, experiencias y productos locales, con carrito de compras, checkout de invitado, pago vía Mercado Pago y un panel de administración. Construido con Next.js, TypeScript, Tailwind CSS y Supabase.

## Primeros pasos

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El sitio funciona sin configuración, pero se ve vacío hasta que conectes Supabase.

## Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, corre en orden los archivos de `supabase/migrations/` (0001, 0002, 0003) y luego `supabase/seed.sql` para cargar datos de ejemplo.
3. Copia `.env.example` a `.env.local` y completa `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API).
4. Crea tu usuario admin en **Authentication → Users**, y agrega su fila en `profiles`:
   ```sql
   insert into profiles (id, email) values ('<uuid-del-usuario>', 'tu@email.com');
   ```
5. Inicia sesión en `/admin/login`.

## Pagos con Mercado Pago

Sin configurar, el checkout usa un flujo de pago simulado para poder probar el sitio completo. Para pagos reales, agrega `MERCADOPAGO_ACCESS_TOKEN` en `.env.local` (ver [mercadopago.cl/developers](https://www.mercadopago.cl/developers)).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth) · Mercado Pago
