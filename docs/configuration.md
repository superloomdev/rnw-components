# Configuration

## Config Keys

All keys can be overridden by passing a config object to the loader.

| Key | Type | Default | Constraint | Description |
|---|---|---|---|---|
| `DEFAULT_FONT_SIZE` | String | `'md'` | non-empty string | Default font size token when a component receives no `size` prop |
| `DEFAULT_FONT_COLOR` | String | `'text_primary'` | non-empty string | Default font color token when a component receives no `color` prop |
| `DEFAULT_FONT_WEIGHT` | String | `'regular'` | non-empty string | Default font weight token when a component receives no `weight` prop |
| `MIN_HIT_TARGET` | Number | `44` | positive number | Minimum accessible hit target in points (iOS HIG 44, Android Material 48) |
| `BREAKPOINT_ORDER` | Array | `['base','sm','md','lg','xl']` | non-empty array of strings | Breakpoint keys in ascending order |

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
| `shared_libs.Icons` | No | Icon source with `Glyph` component |

Missing required injections throw `TypeError` at construction time.

## Peer Dependencies

The `package.json` peer dependencies must match the injections:

| Package | Range | Injection |
|---|---|---|
| `react` | `>=18` | `shared_libs.React` |
| `react-native` | `>=0.74` | Direct import (not injected) |
| `helper-utils` | `^1.0.0` | `shared_libs.Utils` |
| `helper-debug` | `^1.0.0` | `shared_libs.Debug` |
| `helper-themer` | `^1.0.0` | Used by the host to produce theme contracts |
| `helper-device` | `^1.0.0` | `shared_libs.Device` |

## Breakpoint Configuration

Breakpoints are layout boundaries, not design tokens. They live in the theme contract's `Breakpoint` group, not in the themer template. The default breakpoints are:

| Key | Min Width |
|---|---|
| `base` | 0 |
| `sm` | 480 |
| `md` | 768 |
| `lg` | 1024 |
| `xl` | 1280 |

The `BREAKPOINT_ORDER` config key must match the keys in the theme contract's `Breakpoint` group. The `useBreakpoint` hook walks the order in descending width to find the active breakpoint.

## Theme requirements

The theme is not configuration, but `createSystem` rejects an incomplete one, so it belongs
in the same boot-time checklist. `theme.Color` must carry all 22 required tokens; see
[api.md](api.md#required-color-tokens) for the list. Every value is a non-empty string.

The library ships no color of its own. There is no default palette and no fallback: a
theme supplies every color, or the system refuses to build.
