# Theme Contract Schema

The theme contract is the shape the component library consumes. It is produced by `Themer.buildTheme(...)` and reshaped internally by `createSystem` from a flat dotted token map into grouped `system.Style.tokens`. The `Color` group must carry all 38 required tokens listed in [api.md](api.md#required-color-tokens); `createSystem` throws when one is absent.

## Top-Level Shape

`system.Style.tokens` exposes these groups:

```javascript
{
  Color: { ... },
  Spacing: { ... },
  Shape: { ... },
  Size: { ... },
  TypeSet: { ... },
  Font: { ... },
  Border: { ... },
  Focus: { ... },
  Motion: { ... },
  Feedback: { ... },
  Shadow: { ... },
  Breakpoint: { ... }
}
```

## Color Group

Flat map of lowercase color tokens to hex strings.

| Token | Required | Description |
|---|---|---|
| `interactive` | Yes | Primary interactive color |
| `text_primary` | Yes | Primary text color |
| `text_secondary` | Yes | Secondary text color |
| `text_disabled` | Yes | Disabled text color |
| `text_on_color` | Yes | Auto-contrast text on colored backgrounds |
| `text_helper` | Yes | Helper text color |
| `background` | Yes | Base background |
| `layer_01` | Yes | First layer surface |
| `layer_02` | Yes | Second layer surface |
| `border_subtle_01` | Yes | Subtle border at layer 01 |
| `border_interactive` | Yes | Interactive border color |
| `support_success` | Yes | Success state |
| `support_error` | Yes | Error state |
| `support_warning` | Yes | Warning state |
| `support_info` | Yes | Info state |
| `button_primary` | Yes | Primary button background |
| `button_primary_hover` | Yes | Primary button hover |
| `button_primary_active` | Yes | Primary button active/pressed |
| `button_secondary` | Yes | Secondary button background |
| `button_secondary_hover` | Yes | Secondary button hover |
| `button_secondary_active` | Yes | Secondary button active/pressed |
| `button_tertiary` | Yes | Tertiary button background |
| `button_tertiary_hover` | Yes | Tertiary button hover |
| `button_tertiary_active` | Yes | Tertiary button active/pressed |
| `button_danger_primary` | Yes | Danger button background |
| `button_danger_hover` | Yes | Danger button hover |
| `button_danger_active` | Yes | Danger button active/pressed |
| `button_danger_secondary` | Yes | Danger secondary button |
| `button_disabled` | Yes | Disabled button background |
| `button_separator` | Yes | Button separator |
| `focus` | Yes | Focus ring color |
| `icon_primary` | Yes | Primary icon color |
| `icon_secondary` | Yes | Secondary icon color |
| `icon_on_color` | Yes | Icon on colored backgrounds |
| `icon_disabled` | Yes | Disabled icon color |
| `overlay` | Yes | Overlay backdrop |
| `shadow` | Yes | Shadow color |
| `skeleton_background` | Yes | Skeleton loading background |

## Spacing Group

```javascript
Spacing: { spacing_01: 4, spacing_02: 8, spacing_03: 12, spacing_04: 16,
  spacing_05: 16, spacing_06: 24, spacing_07: 32, spacing_08: 40,
  spacing_09: 48, spacing_10: 64, spacing_11: 80, spacing_12: 96, spacing_13: 160 }
```

## Shape Group

```javascript
Shape: { radius_00: 0, radius_02: 2, radius_04: 4, radius_08: 8,
  radius_16: 16, radius_24: 24, radius_max: 9999 }
```

## Size Group

```javascript
Size: { container_01: 16, container_02: 32, container_03: 48, container_04: 64, container_05: 80,
  size_xsmall: 24, size_small: 32, size_medium: 40, size_large: 48, size_xlarge: 64, size_2xlarge: 96,
  icon_01: 16, icon_02: 20,
  layout_01: 8, layout_02: 16, layout_03: 24, layout_04: 32, layout_05: 40, layout_06: 48, layout_07: 64 }
```

## TypeSet Group

Each entry is an object with `fontSize`, `lineHeight`, `letterSpacing`, and `fontWeight`:

```javascript
TypeSet: {
  body01: { fontSize: 14, lineHeight: 20, letterSpacing: 0.16, fontWeight: '400' },
  body02: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontWeight: '400' },
  heading01: { fontSize: 20, lineHeight: 28, letterSpacing: 0, fontWeight: '400' },
  heading02: { fontSize: 24, lineHeight: 32, letterSpacing: 0, fontWeight: '400' },
  heading03: { fontSize: 28, lineHeight: 36, letterSpacing: 0, fontWeight: '400' },
  // ... heading04 through heading07, caption01, caption02, label01, label02,
  //     display01 through display04, etc.
}
```

## Font Group

```javascript
Font: {
  family: { sans: 'System', serif: 'Georgia', mono: 'Menlo' },
  weight: { thin: '100', extralight: '200', light: '300', regular: '400',
    medium: '500', semibold: '600', bold: '700', extrabold: '800', black: '900' }
}
```

## Border Group

```javascript
Border: { width_01: 1, width_02: 2, width_03: 4 }
```

## Focus Group

```javascript
Focus: { width: 2, offset: 2 }
```

## Shadow Group

```javascript
Shadow: { level_01: { ... }, level_02: { ... }, level_03: { ... } }
```

## Breakpoint Group

Flat map of breakpoint keys to minimum width in pixels. These are layout boundaries, not design tokens.

```javascript
Breakpoint: { sm: 0, md: 768, lg: 1024, xlg: 1280, max: 1584 }
```

## Utility Class Naming

The `commonStyles` generator produces utility classes from the reshaped token groups:

| Category | Pattern | Example |
|---|---|---|
| Type set | `type_<typeSet>` | `type_body01` |
| Font color | `font_<color>` | `font_interactive` |
| Font weight | `font_weight_<weight>` | `font_weight_bold` |
| Font family | `font_family_<family>` | `font_family_sans` |
| Background | `background_<color>` | `background_interactive` |
| Radius | `br_<radius>` | `br_radius_04` |
| Padding | `p_<side>_<spacing>` | `p_a_spacing_05`, `p_h_spacing_03` |
| Margin | `m_<side>_<spacing>` | `m_a_spacing_05`, `m_s_spacing_02` |
| Flexbox | `flex_<key>`, `align_<key>`, `justify_<key>` | `flex_center`, `align_center` |

### Spacing Sides

| Side | Meaning | RTL-aware |
|---|---|---|
| `a` | All sides | No |
| `h` | Horizontal | No |
| `v` | Vertical | No |
| `t` | Top | No |
| `b` | Bottom | No |
| `s` | Start | Yes |
| `e` | End | Yes |
