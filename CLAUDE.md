# GlycoLens — Contexte projet

## Présentation

GlycoLens est une application web mobile-first de gestion du diabète de type 1.
Elle a été initialement générée via Lovable.dev et sert actuellement de **prototype/mock**
pour définir l'expérience utilisateur souhaitée avant une implémentation complète.

L'objectif est d'itérer sur ce prototype pour se rapprocher progressivement de la vision finale,
puis de remplacer les données mockées par de vraies intégrations (Dexcom CGM, Open Food Facts, IA photo, backend).

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Runtime | Node.js 20 |
| Bundler | Vite 5 + SWC (`@vitejs/plugin-react-swc`) |
| Langage | TypeScript 5.8 (mode non-strict) |
| Framework | React 18 |
| Routing | react-router-dom v6 |
| State/fetching | @tanstack/react-query v5 |
| UI components | shadcn/ui (style default, base slate, CSS variables) |
| Primitives | Radix UI |
| Styling | Tailwind CSS 3 + tailwindcss-animate + autoprefixer |
| CSS utilities | clsx + tailwind-merge (via `cn()` dans `src/lib/utils.ts`) |
| Charts | Recharts |
| Animations | Framer Motion |
| Formulaires | react-hook-form + zod + @hookform/resolvers |
| Icônes | lucide-react |
| Toasts | Sonner |
| Font | Satoshi (via Fontshare CDN) |
| Tests unitaires | Vitest 3 + jsdom + @testing-library/react |
| Tests E2E | Playwright |
| Linting | ESLint 9 (flat config) + typescript-eslint |
| Docker | node:20-alpine, docker-compose (dev) |

## Architecture du projet

```
src/
├── pages/          # Pages/routes (export default, composants fonctionnels)
├── components/     # Composants métier de l'app
│   └── ui/         # Composants shadcn/ui (NE PAS MODIFIER manuellement)
├── hooks/          # Hooks React custom
├── lib/            # Utilitaires et données
│   ├── utils.ts    # Fonction cn() (clsx + tailwind-merge)
│   └── mockData.ts # Toutes les données mockées
└── test/           # Configuration et fichiers de test
```

**Alias de chemin** : `@/*` → `./src/*` (configuré dans tsconfig + vite)

## Routing

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `ChatDashboard` | Page d'accueil — assistant IA avec input style ChatGPT |
| `/meals` | `MealDashboard` | Journal des repas du jour avec navigation par date |
| `/sport` | `SportDashboard` | Journal des activités sportives avec navigation par date |
| `/insights` | `InsightsDashboard` | Vue d'ensemble des analyses CGM (4 cartes) + pause analyses |
| `/insights/carb-ratio` | `CarbRatioDetail` | Analyse du ratio glucides/insuline |
| `/insights/sport` | `SportDetail` | Impact du sport sur la glycémie |
| `/insights/nightly` | `NightlyDetail` | Patterns glycémiques nocturnes |
| `/insights/basal` | `BasalDetail` | Efficacité de l'insuline basale |
| `*` | `NotFound` | Page 404 |

Toutes les routes sont wrappées dans `AppShell` qui fournit un conteneur mobile-first
(`max-w-[430px]`) et une barre de navigation inférieure à 4 onglets :
**Chat** (MessageCircle) | **Repas** (Utensils) | **Sport** (Dumbbell) | **Analyses** (BarChart3)

## Design System

- **Dark mode uniquement** (pas de light mode)
- **Mobile-first** : max-width 430px, centré sur desktop
- **Couleurs sémantiques** (CSS variables HSL) :
  - Primaire : deep blue `#1B4FD8`
  - En cible (bon) : vert `#22C55E` (`--accent-good`)
  - Haut (danger) : rouge `#EF4444` (`--accent-high`)
  - Bas (warning) : orange `#F97316` (`--accent-low`)
- **Font** : Satoshi (regular, medium, bold, black)
- **Esthétique** : clean, medical-grade, premium health app
- **Langue de l'UI** : français

## Données mockées

Tout est dans `src/lib/mockData.ts`. Interfaces principales :

- `MealEntry` — Entrée alimentaire (nom, macros, dose insuline, site injection, nutriscore)
- `Meal` — Groupe d'entrées par repas (date, heure, label)
- `CustomFood` — Aliments personnalisés
- `GlucoseReading` — Lecture CGM (timestamp, valeur, tendance)
- `SportSession` — Session sportive (type, durée, delta glycémie, courbe)

Exports principaux : `allMeals`, `searchResults`, `latestGlucose`, `glucoseHistory`,
`postMealGlucose`, `carbRatioScatter`, `sportSessions`, `nightlyData`, `basalWindows`

Helpers : `getMealsForDate(date)`, `getAvailableDates()`

## État actuel

- ✅ UI complète des 2 sections (Repas + Analyses) avec données mockées
- ✅ Navigation bottom tab bar
- ✅ Charts Recharts fonctionnels
- ✅ Composants shadcn/ui intégrés
- ✅ Docker dev setup
- ❌ Aucun backend / API
- ❌ Aucune authentification
- ❌ Données 100% mockées (pas de persistance)
- ❌ Pas d'intégration Dexcom
- ❌ Pas d'intégration Open Food Facts
- ❌ Pas d'analyse IA des photos

## Vision à terme

1. **Backend API** — Persistance des données, authentification utilisateur
2. **Intégration Dexcom** — Synchronisation des données CGM en temps réel
3. **Open Food Facts** — Recherche de produits alimentaires réels
4. **Analyse IA** — Reconnaissance de repas par photo
5. **Scan barcode** — Lecture de codes-barres produits
6. **Notifications** — Alertes hypo/hyper
7. **Export de données** — Rapports pour le médecin

## Commandes

```bash
npm install          # Installer les dépendances
npm run dev          # Serveur de dev (port 8080)
npm run build        # Build de production
npm run preview      # Preview du build
npm run lint         # Linter ESLint
npx vitest           # Tests unitaires
npx playwright test  # Tests E2E
```

## Conventions de code

### Composants
- **Export default** pour les pages et composants
- **Composants fonctionnels** uniquement (pas de classes)
- Utiliser `cn()` de `@/lib/utils` pour combiner les classes Tailwind
- Utiliser les composants `@/components/ui/*` existants (shadcn/ui)
- **Ne jamais modifier** les fichiers dans `components/ui/` directement — utiliser `npx shadcn-ui@latest add` pour en ajouter

### Styling
- Tailwind CSS uniquement (pas de CSS inline ni de styled-components)
- Utiliser les CSS variables du design system (`--accent-good`, `--accent-low`, `--accent-high`)
- Classes utilitaires custom : `font-satoshi-regular/medium/bold/black`, `text-accent-good/low/high`
- Responsive mobile-first : concevoir pour 430px max, puis adapter si besoin

### Langue
- **UI en français** : tous les labels, textes, messages
- **Code en anglais** : noms de variables, fonctions, composants, commentaires techniques

### Imports
- Utiliser l'alias `@/` pour tous les imports depuis `src/`
- Exemple : `import { cn } from "@/lib/utils"`
