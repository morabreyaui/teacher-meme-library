# Subir a GitHub y deploy en Vercel (sin instalar Node)

Guía visual — ~15 minutos.

---

## Parte 1 — Cuenta en GitHub

1. Abrí **https://github.com** y creá cuenta (o iniciá sesión).
2. No hace falta crear el repo todavía; GitHub Desktop lo puede crear por vos.

---

## Parte 2 — GitHub Desktop (recomendado)

### Instalar

1. **https://desktop.github.com** → Download → instalá.
2. Abrí **GitHub Desktop** e iniciá sesión con tu cuenta GitHub.

### Publicar este proyecto

1. Menú **File** → **Add Local Repository…**
2. Elegí la carpeta:
   ```
   /Users/morabreyaui/Code/teacher-meme-generator
   ```
3. Si dice que no es un repositorio git, clic en **create a repository** (o **Initialize**).
4. Abajo a la izquierda, mensaje del commit, por ejemplo:
   ```
   Teacher Meme Library MVP
   ```
5. Clic **Commit to main**.
6. Clic **Publish repository** (arriba).
7. Nombre sugerido: `teacher-meme-library`
8. **Desmarcá** “Keep this code private” solo si querés que sea público (Vercel gratis funciona con privado también).
9. **Publish repository**.

Cuando termine, tu código está en GitHub.

---

## Parte 3 — Vercel

### Conectar GitHub

1. Abrí **https://vercel.com** → **Sign Up** → **Continue with GitHub** (misma cuenta).
2. Autorizá a Vercel cuando GitHub lo pida.

### Importar el proyecto

1. En Vercel: **Add New…** → **Project**.
2. En la lista, buscá **teacher-meme-library** (o el nombre que pusiste).
3. Clic **Import**.

### Configuración (dejá casi todo por defecto)

| Campo | Valor |
|--------|--------|
| Framework Preset | Next.js (auto) |
| Root Directory | `./` |
| Build Command | `npm run build` (default) |
| Output | (default) |

**No** hace falta cambiar nada más para el MVP.

### Variables de entorno (opcional)

Antes de Deploy, expandí **Environment Variables**:

| Name | Value | Cuándo |
|------|--------|--------|
| `OPENAI_API_KEY` | tu `sk-...` | Si tenés key de OpenAI (mejor customize) |
| `NEXT_PUBLIC_SITE_URL` | la dejás vacía al primer deploy; después pegás la URL de prod | Después del primer deploy |

Clic **Deploy**.

Esperá 2–5 minutos. Cuando diga **Ready**, clic en la URL (ej. `teacher-meme-library.vercel.app`).

### Después del primer deploy

1. Copiá la URL de producción.
2. Vercel → proyecto → **Settings** → **Environment Variables**
3. Agregá `NEXT_PUBLIC_SITE_URL` = `https://TU-URL.vercel.app`
4. **Deployments** → ⋮ del último → **Redeploy**

---

## Parte 4 — Probar

- Galería carga
- Download / Share en una tarjeta
- Customize en un meme que lo tenga

---

## Si algo falla en Vercel

1. **Deployments** → clic en el deploy fallido → **Building** / logs.
2. Copiá el error y compartilo — suele ser variable de entorno o timeout (raro en galería).

---

## Actualizar el sitio más adelante

1. Cambiás código en Cursor.
2. GitHub Desktop: commit + **Push origin**.
3. Vercel redeploya solo en ~1 minuto.

---

## Alternativa sin GitHub Desktop (Terminal + git)

Solo si ya tenés `git` (en Mac suele venir instalado):

```bash
cd /Users/morabreyaui/Code/teacher-meme-generator
git add .
git commit -m "Teacher Meme Library MVP"
```

Creá repo vacío en github.com → New repository → sin README.

```bash
git remote add origin https://github.com/TU_USUARIO/teacher-meme-library.git
git branch -M main
git push -u origin main
```

(GitHub te pedirá login en el navegador.)

Luego Parte 3 (Vercel) igual.
