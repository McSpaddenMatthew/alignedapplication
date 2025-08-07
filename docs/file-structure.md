# 🧠 Aligned App Structure

## Folders
- `/pages` – All routes (e.g., login, dashboard, summary)
- `/components` – Shared UI pieces (buttons, forms)
- `/lib` – Supabase client & helper functions
- `/styles` – Global CSS, Tailwind setup
- `/public` – Static assets like logo, favicon

## Key Pages
- `/index.tsx` – Landing page
- `/login.tsx` – Supabase login page
- `/dashboard.tsx` – After login
- `/summary.tsx` – Candidate summary form

## Supabase
- `.env.local` – Stores `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Connected to table: `Test`

## Next Steps
- ✅ Supabase working
- ⏳ Recruiter login logic
- ⏳ Job intake form
- ⏳ Candidate summary builder
- ⏳ Hiring manager link view
