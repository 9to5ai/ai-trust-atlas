# Design system

The Atlas has two themes built on one set of semantic tokens:

- **Observatory** (dark) is the default.
- **Paper** (light) is used for reading and printing.

Stage mode (`S`) enlarges type for projectors and screen shares.

## Layers

Stylesheets use cascade layers, declared once in `src/styles/index.css`. That file is imported first in `src/main.tsx` so the order holds:

```
reset, tokens, base, legacy, bridge, components, utilities
```

A later layer wins regardless of selector specificity.

| Layer | Where | Purpose |
|---|---|---|
| tokens | `src/styles/tokens.css` | Primitives, semantic tokens per theme, print palette, Stage mode |
| base | `src/styles/base.css` | Element defaults, focus ring, selection, reduced motion |
| legacy | `src/styles/legacy/*.css` | Pre-overhaul styles, fenced so new work always wins. Shrinking: a ratchet test (`legacy.test.ts`) fails if `!important`, raw colours or rule counts grow |
| bridge | `src/styles/bridge.css` | Re-skins legacy screens (Universe workspace, Inspector, dialogs) with tokens until each is rebuilt |
| components | `*.module.css` next to each component | All new UI. Styles are deleted with the component |

## Tokens

- **Surfaces:** `--surface-0` to `--surface-4`, plus `--surface-glass` and `--surface-glass-strong`.
- **Text:** `--text-primary`, `--text-secondary`, `--text-tertiary`.
- **Lines:** `--border-subtle`, `--border`, `--border-strong`.
- **Accents:** `--signal` (cyan, primary action and selection), `--aurora` (violet, interpretation and paths), `--positive`, `--caution`, `--critical`. Each has `-soft` and `-contrast` pairs where needed.
- **Type:**
  - `--font-sans` is Inter, for UI.
  - `--font-serif` is Source Serif 4, for headlines.
  - `--font-mono` is JetBrains Mono, for references and telemetry labels.
  - All are self-hosted through `@fontsource-variable`, so the Content Security Policy stays strict.
  - The scale runs from `--step--2` (11px, the floor) to `--step-6`.
- **Space, shape and motion:** `--space-1` to `--space-9`, `--radius-s` to `--radius-xl`, `--ease-out`, and `--dur-1` to `--dur-4`.

Legacy variable names (`--accent`, `--text-muted` and so on) are mapped onto these in the bridge layer. Do not use them in new code.

## Components

Shared building blocks live in `src/ui/`:

- `Page`, `PageHero` and `Section` for page scaffolding.
- `Chip`, `ChipGroup`, `Badge`, `DraftBadge`, `Button`, `Callout` and `EmptyState` in `Kit`.

Icons are Phosphor: regular weight by default, duotone for feature icons.

## Data visualisation

- Charts follow one method: form first, colour last, validated palettes, and a legend plus direct labels.
- Categorical colours come from the validated reference palette (blue, orange, aqua, yellow). Each theme has its own steps.
- Magnitude uses a single hue, `--signal`.
- Every chart has a text or table equivalent nearby. The Universe's equivalent is the List view.
- The WebGL Universe reads theme colours through `src/universe/engine.ts`. It falls back to the 2D canvas without WebGL2 or with `?renderer=2d`, and the List view is its accessible equivalent.

## Accessibility and motion

- Contrast meets WCAG AA in both themes. Axe checks run in e2e for the main pages.
- Focus rings come from `--focus-ring`.
- `prefers-reduced-motion` disables ambient rotation, fly-to animation, signal pulses and entrance animations.
