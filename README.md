# Ara Rapa Nui

Sitio de turismo y comercio para Rapa Nui: paquetes turísticos, experiencias, productos (turistas y residentes), arriendo de vehículos, directorio de empresas locales y pedidos especiales — con carrito de compras, checkout de invitado o con cuenta, pago vía Mercado Pago, y un panel de administración completo. Construido con Next.js, TypeScript, Tailwind CSS y Supabase.

## Primeros pasos

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El sitio funciona sin configuración, pero se ve vacío hasta que conectes Supabase.

## Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, corre **en orden** todos los archivos de `supabase/migrations/` (0001 a 0009), y después `supabase/seed.sql` para cargar datos de ejemplo.
3. Copia `.env.example` a `.env.local` y completa `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → Data API / API Keys). Las claves nuevas de Supabase se llaman "Publishable key" (va en `ANON_KEY`) y "Secret key" (va en `SERVICE_ROLE_KEY`).
4. Crea tu primer usuario admin en **Authentication → Users**, y agrega su fila en `profiles` (marcándolo `superadmin` para que también pueda crear otras cuentas de admin):
   ```sql
   insert into profiles (id, email, role) values ('<uuid-del-usuario>', 'tu@email.com', 'superadmin');
   ```
5. (Opcional) En **Authentication → Sign In / Providers → Email**, desactiva "Confirm email" si quieres que los clientes puedan comprar apenas se registran, sin esperar un correo de confirmación.

## Dos sistemas de inicio de sesión — no los mezcles

El sitio tiene **dos logins completamente separados**, aunque ambos usan Supabase Auth:

| | URL | Para quién | A dónde lleva |
|---|---|---|---|
| **Panel admin** | `/admin/login` | Staff (admin / superadmin) | `/admin` — gestión de todo el sitio |
| **Cuenta de cliente** | `/cuenta/login` | Clientes | `/cuenta` — historial de pedidos |

Una cuenta de staff (admin/superadmin) técnicamente *puede* iniciar sesión en `/cuenta/login` porque es la misma tabla de usuarios de Supabase — si eso pasa, el sitio la redirige automáticamente a `/admin` en vez de mostrarle la vista de cliente. Pero para gestionar el sitio, **siempre entra por `/admin/login` directamente**, no por el link "Iniciar sesión" del pie de página (ese es para clientes).

## Panel de administración

- **Admin**: gestiona pedidos, solicitudes, catálogo (paquetes/experiencias/productos/vehículos), empresas, y apariencia.
- **Superadmin**: todo lo anterior, más `/admin/administradores` para crear otras cuentas de admin/superadmin y darles o quitarles acceso — sin tocar Supabase directamente.
- `/admin/apariencia`: cambia los 14 colores del sitio (se aplican al instante en todo el sitio) y activa/desactiva qué categorías aparecen en el menú.
- Los formularios de catálogo suben fotos reales a Supabase Storage — ya no hay que pegar URLs de imágenes externas.
- Cada pedido tiene un recibo imprimible en `/admin/pedidos/[id]/recibo`, y la lista de pedidos se puede filtrar por estado y por categoría de producto.
- Los productos se pueden pausar con un clic (por ejemplo, cuando se agota el stock) sin borrar la publicación.

## Cuentas de cliente

Los visitantes pueden registrarse en `/cuenta/registro` para guardar su historial de pedidos en `/cuenta/pedidos`. El checkout sigue funcionando también como invitado, sin necesidad de cuenta — si el cliente está con sesión iniciada, el pedido queda vinculado a su cuenta automáticamente.

## Pagos con Mercado Pago

Sin configurar, el checkout usa un flujo de pago simulado para poder probar el sitio completo. Para pagos reales, agrega `MERCADOPAGO_ACCESS_TOKEN` en `.env.local` (ver [mercadopago.cl/developers](https://www.mercadopago.cl/developers)).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth + Storage) · Mercado Pago
