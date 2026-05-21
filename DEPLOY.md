# Deploy en Vercel — Teacher Meme Library

El proyecto ya compila con `npm run build`. Vercel detecta Next.js automáticamente.

## Requisitos

- Cuenta en [vercel.com](https://vercel.com)
- Node 20+ y npm en tu Mac
- (Recomendado) Repo en GitHub para deploys automáticos

## Opción A — Vercel CLI (rápido)

Desde la carpeta del proyecto:

```bash
cd /Users/morabreyaui/Code/teacher-meme-generator
npm install
npx vercel login
npx vercel          # preview
npx vercel --prod   # producción
```

La primera vez te preguntará nombre del proyecto y si quieres enlazarlo a un equipo.

## Opción B — GitHub + dashboard Vercel

1. Inicializa git y sube el repo (sin `.env.local`):

```bash
cd /Users/morabreyaui/Code/teacher-meme-generator
git init
git add .
git commit -m "Teacher Meme Library MVP"
# Crea repo en GitHub y:
git remote add origin git@github.com:TU_ORG/teacher-meme-generator.git
git push -u origin main
```

2. En [vercel.com/new](https://vercel.com/new) → **Import** el repositorio.
3. Framework: **Next.js** (auto).
4. Añade variables de entorno (ver abajo).
5. **Deploy**.

Cada push a `main` volverá a desplegar.

## Variables de entorno en Vercel

En **Project → Settings → Environment Variables**:

| Variable | Requerida | Notas |
|----------|-----------|--------|
| `OPENAI_API_KEY` | Recomendada | Sin ella, customize/generate usan captions de ejemplo + blocklist (MVP funciona, menos “mágico”). |
| `OPENAI_MODEL` | Opcional | Default `gpt-4.1-mini`. |
| `NEXT_PUBLIC_SITE_URL` | Recomendada en prod | URL canónica, ej. `https://teacher-meme-library.vercel.app` — mejora previews al compartir en `/meme/[id]`. |

`VERCEL_URL` la rellena Vercel sola si no pones `NEXT_PUBLIC_SITE_URL`.

Copia desde `.env.example`; **no** subas `.env.local` a git.

## Qué funciona en el MVP en Vercel

- Galería, filtros, download, share, customize (render con `sharp` en runtime Node).
- Signup CTAs y share links.
- APIs `/api/edit` y `/api/generate` (necesitan plan con timeout ≥ 60s si usas OpenAI a fondo; Hobby suele limitar a 10s — la galería no depende de eso).

## Limitación conocida (MVP)

Los memes **nuevos** guardados en `/public/memes` y `/data/memes` viven en el filesystem del servidor. En Vercel ese disco es **efímero**: un meme generado puede no persistir tras un redeploy o cold start. La **galería curada** en `/public/gallery` sí es permanente (va en el build).

Para persistencia real en producción: Vercel Blob, S3 o R2 (futuro).

## Después del deploy

1. Abre la URL de producción y prueba: galería → Share → Customize → Download.
2. En Vercel, asigna dominio custom si Legends lo provee.
3. Actualiza `NEXT_PUBLIC_SITE_URL` con la URL final y redeploy.

## Verificación local antes de subir

```bash
npm run build
npm run start
# → http://localhost:3001
```
