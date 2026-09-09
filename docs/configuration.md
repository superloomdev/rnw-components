# Configuration

## Config Keys

All keys can be overridden by passing a config object to the loader.

| Key | Type | Default | Constraint | Description |
|---|---|---|---|---|
| `DEFAULT_TYPE_SET` | String | `'body01'` | non-empty string | Default type set when a component receives no `typeSet` prop |
| `DEFAULT_FONT_COLOR` | String | `'text_primary'` | non-empty string | Default font color token when a component receives no `color` prop |
| `DEFAULT_FONT_FAMILY` | String | `'sans'` | non-empty string | Default font family role when a component receives no `family` prop |
| `MIN_HIT_TARGET` | Number | `44` | positive number | Minimum accessible hit target in points (iOS HIG 44, Android Material 48) |
| `BREAKPOINT_ORDER` | Array | `['sm','md','lg','xlg','max']` | non-empty array of strings | Breakpoint keys in ascending order |
| `STRICT_TOKENS` | Boolean | `true` | boolean | Unknown utility read throws `TypeError`; when `false`, returns `undefined` and warns once per key |
| `DEBUG_FROM_BASE` | Boolean | `false` | boolean | When true, `createSystem` reports at debug level every key it read that the theme took from the base template. This is information, not an error: leaving a key to Superloom's base is a legitimate choice. |

## Validation

Config is validated at load time. Bad config throws `TypeError` immediately:

```javascript
// Throws: rnw-components: MIN_HIT_TARGET must be a positive number
import { createSystem } from 'rnw-components';

const system = createSystem({
  Utils: Utils, Debug: Debug, React: React, Device: Device
}, {
  MIN_HIT_TARGET: -10
});
```

## Injection Requirements

| Injection | Required | Source |
|---|---|---|
| `shared_libs.Utils` | Yes | `helper-utils` |
| `shared_libs.Debug` | Yes | `helper-debug` |
| `shared_libs.React` | Yes | `react` module |
| `shared_libs.Device` | Yes | `js-rnw-helper-device` |
| `shared_libs.Themer` | Yes | `helper-themer` engine; `createSystem` calls `Themer.getContract()` for validation |
| `shared_libs.Icons` | No | Icon source with `Glyph` component |

Missing required injections throw `TypeError` at construction time.

## Peer Dependencies

The `package.json` peer dependencies must match the injections:

| Package | Range | Injection |
|---|---|---|
| `react` | `>=18` | `shared_libs.React` |
| `react-native` | `>=0.86.0` | Direct import (not injected) |
| `helper-utils` | `^1.0.0` | `shared_libs.Utils` |
| `helper-debug` | `^1.0.0` | `shared_libs.Debug` |
| `helper-themer` | `^1.0.0` | `shared_libs.Themer` |
| `helper-device` | `^1.0.0` | `shared_libs.Device` |

## Breakpoint Configuration

Breakpoints are layout boundaries, not design tokens. They live in the Themer contract's `breakpoint` group, not in the themer template. The default breakpoints are:

| Key | Min Width |
|---|---|
| `sm` | 0 |
| `md` | 768 |
| `lg` | 1024 |
| `xlg` | 1280 |
| `max` | 1584 |

The `BREAKPOINT_ORDER` config key must match the keys in the contract's `breakpoint` group. The `useBreakpoint` hook walks the order in descending width to find the active breakpoint. The default breakpoint is `'sm'`.

## Theme requirements

The theme is not configuration, but `createSystem` rejects an incomplete one, so it belongs
in the same boot-time checklist. The built theme (from `Themer.buildTheme(...)`) must carry all
required tokens in its `.tokens` map; the required list is computed by the D8 rule in
`data/token-contract.js` (every value-tier token except `color.tag_*` and `color.ai_*`, plus
every structure-tier token). Every value is a non-empty string.

The library ships no color of its own. There is no default palette and no fallback: a
theme supplies every required token, or the system refuses to build.
