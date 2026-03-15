# GlycoLens — Instructions Copilot

## Contexte

GlycoLens est une app web mobile-first de gestion du diabète de type 1 (React 18 + Vite + TypeScript + Tailwind + shadcn/ui).
Actuellement en phase prototype avec données mockées. L'UI est en français, le code en anglais.

## Stack

- React 18 + react-router-dom v6 + @tanstack/react-query v5
- TypeScript 5.8 (mode non-strict)
- Tailwind CSS 3 + shadcn/ui (Radix UI) + lucide-react
- Recharts (charts) + Framer Motion (animations)
- react-hook-form + zod (formulaires)
- Vitest + Playwright (tests)
- Alias : `@/*` → `./src/*`

## Conventions

- Composants fonctionnels avec export default
- Utiliser `cn()` de `@/lib/utils` pour combiner les classes Tailwind
- Dark mode uniquement, mobile-first (max-width 430px)
- Couleurs sémantiques : `text-accent-good` (vert), `text-accent-low` (orange), `text-accent-high` (rouge)
- Font : Satoshi (`font-satoshi-regular/medium/bold/black`)
- Données mockées dans `@/lib/mockData`
- Pages dans `src/pages/`, composants dans `src/components/`
- Navigation : 4 onglets — Chat (`/`) | Repas (`/meals`) | Sport (`/sport`) | Analyses (`/insights`)
- Page d'accueil = Chat (assistant IA avec input centré)
- Ajout repas/sport via bouton inline (pas de FAB)
- Section Analyses : possibilité de pause temporaire des analyses

## À faire

- Utiliser les composants `@/components/ui/*` existants
- Importer avec l'alias `@/` (ex: `import { Button } from "@/components/ui/button"`)
- UI en français, code en anglais
- Tailwind uniquement pour le styling

## À ne pas faire

- Ne pas modifier les fichiers dans `src/components/ui/` (générés par shadcn)
- Ne pas utiliser de CSS inline ou styled-components
- Ne pas écrire l'UI en anglais
- Ne pas utiliser de composants classe React
