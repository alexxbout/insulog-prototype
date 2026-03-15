# GlycoLens — Instructions pour agents IA

## Présentation

GlycoLens est une application web mobile-first de gestion du diabète de type 1.
Prototype issu de Lovable.dev, actuellement avec données 100% mockées.
L'objectif est d'itérer sur l'UI/UX avant d'implémenter le backend et les intégrations réelles.

## Stack technique

- **Frontend** : React 18 + TypeScript 5.8 + Vite 5 (SWC)
- **UI** : Tailwind CSS 3 + shadcn/ui (Radix UI) + lucide-react
- **Charts** : Recharts
- **Animations** : Framer Motion
- **Routing** : react-router-dom v6
- **State** : @tanstack/react-query v5
- **Formulaires** : react-hook-form + zod
- **Tests** : Vitest (unitaires) + Playwright (E2E)
- **Alias** : `@/*` → `./src/*`

## Setup

```bash
npm install
npm run dev    # Démarre le serveur de dev sur le port 8080
```

Alternative Docker :
```bash
cd docker && docker-compose up
```

## Structure du projet

```
src/
├── pages/          # Pages/routes (composants fonctionnels, export default)
│   ├── ChatDashboard.tsx      # Route: / — Page d'accueil assistant IA
│   ├── MealDashboard.tsx      # Route: /meals — Journal des repas
│   ├── SportDashboard.tsx     # Route: /sport — Journal des activités sportives
│   ├── InsightsDashboard.tsx   # Route: /insights — Analyses CGM + pause
│   ├── CarbRatioDetail.tsx     # Route: /insights/carb-ratio
│   ├── SportDetail.tsx         # Route: /insights/sport
│   ├── NightlyDetail.tsx       # Route: /insights/nightly
│   ├── BasalDetail.tsx         # Route: /insights/basal
│   └── NotFound.tsx            # Route: *
├── components/     # Composants métier
│   ├── SportActivityBuilder.tsx # Overlay ajout activité sportive
│   └── ui/         # Composants shadcn/ui (NE PAS MODIFIER)
├── hooks/          # Hooks React custom
├── lib/
│   ├── utils.ts    # Fonction cn() (clsx + tailwind-merge)
│   └── mockData.ts # Données mockées (interfaces + exports)
└── test/           # Tests
```

**Navigation** : 4 onglets dans la tabbar — Chat (MessageCircle) | Repas (Utensils) | Sport (Dumbbell) | Analyses (BarChart3)

## Interfaces de données (src/lib/mockData.ts)

```typescript
interface MealEntry {
  id: string;
  name: string;
  brand?: string;
  quantity: number;        // grammes
  carbs: number;           // glucides en g
  sugars?: number;
  proteins: number;
  fats: number;
  calories: number;
  photo?: string;
  nutriscore?: string;
  insulinDose?: number;    // unités
  insulinType?: string;
  injectionSite?: string;
  note?: string;
}

interface Meal {
  id: string;
  date: string;            // YYYY-MM-DD
  time: string;            // HH:mm
  label: string;           // ex: "Petit-déjeuner"
  entries: MealEntry[];
}

interface GlucoseReading {
  timestamp: string;
  value: number;           // mg/dL
  trend: string;           // "stable" | "rising" | "falling" | etc.
}

interface SportSession {
  id: string;
  type: string;            // "Cardio" | "Musculation" | etc.
  name: string;
  date: string;
  startTime: string;
  duration: number;         // minutes
  glucoseDelta: number;
  glucoseCurve: Array<{ time: number; value: number }>;
}
```

## Conventions obligatoires

### Code
- Composants **fonctionnels** avec **export default**
- Imports via l'alias `@/` (exemple : `import { cn } from "@/lib/utils"`)
- Utiliser `cn()` pour combiner les classes Tailwind
- Utiliser les composants existants de `@/components/ui/*`
- **Ne jamais modifier** les fichiers dans `src/components/ui/`

### Styling
- **Tailwind CSS uniquement** (pas de CSS inline, pas de styled-components)
- **Dark mode uniquement** (pas de thème clair)
- **Mobile-first** : max-width 430px
- Couleurs sémantiques :
  - `text-accent-good` / `bg-accent-good` — vert (en cible)
  - `text-accent-low` / `bg-accent-low` — orange (hypo)
  - `text-accent-high` / `bg-accent-high` — rouge (hyper)
- Font : `font-satoshi-regular`, `font-satoshi-medium`, `font-satoshi-bold`, `font-satoshi-black`

### Langue
- **UI en français** : tous les textes visibles par l'utilisateur
- **Code en anglais** : variables, fonctions, composants, types, commentaires

## Workflow de validation

Avant de soumettre des changements, vérifier dans cet ordre :

1. **Build** : `npm run build` — doit compiler sans erreur
2. **Lint** : `npm run lint` — aucune erreur ESLint
3. **Tests unitaires** : `npx vitest run` — tous les tests passent
4. **Tests E2E** : `npx playwright test` — tous les tests passent
5. **Vérification visuelle** : l'UI est cohérente en dark mode, responsive à 430px max

## Contraintes actuelles

- **Pas de backend** : toutes les données viennent de `src/lib/mockData.ts`
- **Pas d'authentification** : pas de système de login
- **Pas d'API externe** : pas d'appels réseau réels
- Les modifications doivent fonctionner avec les données mockées existantes
- Les nouvelles fonctionnalités qui nécessitent des données doivent ajouter les mocks correspondants dans `mockData.ts`

## Checklist avant commit

- [ ] `npm run build` passe sans erreur
- [ ] Pas de `console.log` ou `console.error` oubliés
- [ ] UI responsive (testée à 430px max-width)
- [ ] Textes UI en français
- [ ] Dark mode cohérent (pas de fond blanc, pas de texte noir)
- [ ] Nouveaux composants dans le bon dossier (`pages/` ou `components/`)
- [ ] Imports avec l'alias `@/`
