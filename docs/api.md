# API Reference

## Entry Point

`createSystem` is the only entry point. The package has no default export.

```javascript
import { createSystem } from 'rnw-components';

const system = createSystem(shared_libs, config?, built, breakpoint?)
```

| Parameter | Type | Required | Description |
|---|---|---|---|
| `shared_libs.Utils` | Object | Yes | `helper-utils` instance |
| `shared_libs.Debug` | Object | Yes | `helper-debug` instance |
| `shared_libs.React` | Object | Yes | The `react` module (injected, not imported) |
| `shared_libs.Device` | Object | Yes | `js-rnw-helper-device` instance |
| `shared_libs.Themer` | Object | Yes | `helper-themer` engine; `createSystem` calls `Themer.getContract()` for validation |
| `shared_libs.Icons` | Object | No | Icon source with a `Glyph` component |
| `shared_libs.Font` | Object | No | `helper-font` instance |
| `config` | Object | No | Overrides merged over defaults |
| `built` | Object | Yes | Result of `Themer.buildTheme(...)`; must carry a `.tokens` flat map with all required tokens |
| `breakpoint` | String | No | Active breakpoint key, default `'sm'` |

The system carries the validated container, the mechanism parts, the
per-breakpoint utility styles, and an **empty** registry. No component exists
until it is registered, so a bundler drops every factory that was never
imported.

Re-theming builds a new system. A system is never mutated in place.

### Token Contract

A component system requires its tokens from the Superloom token contract and declares the subset it requires and the subset it supports as exported data. `createSystem` calls `Themer.validateContract` with both lists: missing required tokens are one `TypeError` naming them all; unsupported provided tokens are one warning naming them all. No component source contains a color literal, reads a token by a name outside the contract, or falls back from one token to another; CI gates G24, G27, G28, and G29 enforce this. A hardcoded fallback would make an incomplete theme look complete while substituting the library's own design decisions; the correct behavior is to refuse to build so the theme author sees the gap.

Signature `createSystem(shared_libs, config, built, breakpoint)`; `shared_libs.Themer` required; `built` is `Themer.buildTheme(...)` output; breakpoints `sm md lg xlg max` from `breakpoint.*`; utility families: `background_<name>`, `font_<name>`, `border_color_<name>`, `br_radius_<name>`, `border_w_<side>_width_<name>`, `p_<dir>_spacing_<name>`, `m_<dir>_spacing_<name>`, `type_<name>`, `flex_<name>`, `align_<name>`, `justify_<name>`, `focus_ring`; prop vocabulary: `kind` (`primary` `secondary` `tertiary` `danger` `ghost`), `size` (`sm` `md` `lg`), `color` (font color token), `background` (background color token), `radius` (radius token), `spacing` (spacing token); required and supported lists in `data/token-contract.js`.

## Module Exports

| Export | Kind | Description |
|---|---|---|
| `createSystem` | Function | The entry point above |
| `TOKENS` | Frozen Object | Valid token sets |
| 245 component names | Function | One factory per component, e.g. `Button`, `Text` |

Subpath `rnw-components/all` exports the registration barrel:

| Export | Description |
|---|---|
| `COMPONENTS` | 235 flat component factories |
| `VARIANTS` | 1 variant factory |
| `FREEFORMS` | 1 freeform factory |
| `PROVIDERS` | 8 provider factories |

Importing the barrel pulls in every component. Import components by name from
the package root to ship a subset.

## System Surface

### addComponents(factory_map)

Registers flat components at `Component.[name]`. Map keys become registry keys,
so ES shorthand keeps names typo-proof: a misspelled name fails at import time,
not at render time.

| Parameter | Type | Description |
|---|---|---|
| `factory_map` | Object | Registry key to component factory |

Returns the shared `Component` registry. Throws `TypeError` on a non-object
argument or a non-function entry.

### addVariants(factory_map)

Registers structured exceptions at `Component.variant.[name]`. A variant is a
preset of a canonical component and takes the same injection set.

Returns `Component.variant`.

### addFreeforms(factory_map)

Registers unstructured exceptions at `Component.freeform.[name]`. Freeform
factories receive `Lib` only: they cannot read tokens or compose siblings, they
take raw styles, and they do not re-theme.

Returns `Component.freeform`.

### addProviders(factory_map)

Registers context providers at `Component.provider.[name]`. A provider factory
returns a module whose single component key equals its registry key.

Provider factories are called with the canonical injection order
`(Lib, CONFIG, ERRORS, Parts, Registry, Style)`. A provider may declare a
shorter parameter list, but it must be a **prefix** of that order. Gate G22
enforces this.

Returns `Component.provider`. Throws `TypeError` when a factory does not expose
its own name.

### checkRegistry()

Reports which render-time dependencies are missing from the registry. A
component that renders a sibling reads it from the shared registry at render
time, so an unregistered sibling fails only when that branch renders. This
surfaces the gap at boot instead.

Returns `{ complete, missing }`, where `missing` maps a registered component to
the array of its absent dependencies.

### useBreakpoint(theme)

React hook that resolves the active breakpoint from the injected Device helper.
Subscribes to viewport changes and updates on resize.

| Parameter | Type | Description |
|---|---|---|
| `theme` | Object | Theme contract with `Breakpoint` group |

Returns the active breakpoint key string. The system carries every breakpoint's
utility set in `Style.allBreakpoints`, so a caller switches presentation on the
returned key without building a second system.

### make(factory)

Instantiates a factory with the full injection set without registering it.
Returns the component.

### Properties

| Property | Description |
|---|---|
| `Component` | The shared registry, with `variant`, `freeform`, `provider` namespaces |
| `Style` | `{ utilities, tokens, breakpoint, allBreakpoints }`. `tokens` exposes the reshaped groups: `Color`, `Spacing`, `Shape`, `TypeSet`, `Font`, `Breakpoint`, `Border`, `Focus`, `Motion`, `Feedback`, `Shadow`, `Grid`, `State`, `Tint`, `Size` |
| `Parts` | The 12 mechanism parts |
| `Lib` | The validated dependency container |
| `CONFIG` | Merged configuration |
| `ERRORS` | Frozen error catalog |
| `breakpoint` | Active breakpoint key |

## TOKENS

Frozen object of valid token sets. Every array is frozen too.

```javascript
{
  fontColor: ['text_primary', 'text_secondary', 'text_disabled', 'text_on_color',
    'text_helper', 'interactive', 'button_primary', 'button_primary_hover',
    'button_primary_active', 'button_secondary', 'button_secondary_hover',
    'button_secondary_active', 'button_tertiary', 'button_tertiary_hover',
    'button_tertiary_active', 'button_danger_primary', 'button_danger_hover',
    'button_danger_active', 'button_danger_secondary', 'button_disabled',
    'button_separator', 'support_success', 'support_error', 'support_warning',
    'support_info', 'background', 'layer_01', 'layer_02', 'border_subtle_01',
    'border_interactive', 'focus', 'icon_primary', 'icon_secondary',
    'icon_on_color', 'icon_disabled', 'overlay', 'shadow', 'skeleton_background'],
  fontWeight: ['thin', 'extralight', 'light', 'regular', 'medium', 'semibold',
    'bold', 'extrabold', 'black'],
  fontFamily: ['sans', 'serif', 'mono'],
  typeSet: ['body01', 'body02', 'heading01', 'heading02', 'heading03',
    'display01', 'display02', 'display03', 'caption01', 'label01', 'overline01'],
  radius: ['radius_00', 'radius_01', 'radius_02', 'radius_03', 'radius_04',
    'radius_06', 'radius_08', 'radius_12', 'radius_28', 'radius_max'],
  spacing: ['spacing_00', 'spacing_01', 'spacing_02', 'spacing_03', 'spacing_04',
    'spacing_05', 'spacing_06', 'spacing_07', 'spacing_08', 'spacing_09',
    'spacing_10', 'spacing_11', 'spacing_12', 'spacing_13'],
  borderWidth: ['width_00', 'width_01', 'width_02', 'width_03', 'width_04'],
  background: ['background', 'layer_01', 'layer_02', 'layer_03',
    'button_primary', 'button_primary_hover', 'button_primary_active',
    'button_secondary', 'button_secondary_hover', 'button_secondary_active',
    'button_tertiary', 'button_tertiary_hover', 'button_tertiary_active',
    'button_danger_primary', 'button_danger_hover', 'button_danger_active',
    'button_danger_secondary', 'button_disabled', 'button_separator',
    'skeleton_background', 'overlay']
}
```

## Mechanisms

Eight shared mechanisms live in `parts/` and are used across all components.

### a11y (M1)

The single translator from semantic state to `aria-*` props. The only module allowed to emit accessibility state/value/relation/position props.

```javascript
import a11yPart from './parts/a11y.js';
const a11y = a11yPart({ React: React, Utils: Utils, Debug: Debug }, {}, {});
a11y.state({ checked: true, disabled: false });  // -> { 'aria-checked': true }
a11y.value({ min: 0, max: 1, now: 0.5 });        // -> { 'aria-valuemin': 0, ... }
a11y.relation({ controls: 'panel-1' });           // -> { 'aria-controls': 'panel-1' }
a11y.position({ posinset: 3, setsize: 10 });      // -> { 'aria-posinset': 3, ... }
a11y.id('carbon-tab');                            // -> 'carbon-tab-1'
```

### usePressKeys (M2)

Normalizes Enter and Space activation per role. Fixes the RNW bug where Space does not activate non-button roles.

### useRovingTabIndex (M3)

Roving tab index for composite widgets. Exactly one item carries `focusable={true}`; arrow keys move the active index.

### OverlayHost (M4)

Overlay stacking provider. Maintains an ordered stack so a Popover opened from inside a Modal paints above it.

### useAnchoredPosition (M5)

Position calculation for anchored overlays. Measures the anchor and viewport, computes placement, flips on overflow.

### LiveRegionProvider (M6)

Screen reader announcements through permanently-mounted `aria-live` regions. Fixes the `announceForAccessibility` no-op on web.

### createCompoundContext (M7)

Context factory for compound components. Creates a Provider and useContext hook that throws when used outside its Provider.

### useControllableState (M8)

Controlled/uncontrolled state hook. Controlled when `value` is not undefined, uncontrolled otherwise. Warns once on mode switch.

## Component Sections

<!-- BEGIN GENERATED: component-sections -->
### AILabel

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (label text, default 'AI') |
| `details` | - | - | string (toggletip content) |
| `style` | Object|Array | - | custom style overrides |

### AILabelActions

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | action button elements |
| `style` | Object|Array | - | custom style overrides |

### AILabelContent

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content elements |
| `style` | Object|Array | - | custom style overrides |

### AISkeletonIcon

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | custom style overrides |

### AISkeletonPlaceholder

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | custom style overrides |

### AISkeletonText

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `lines` | Number | 3 | number (default 3) |
| `style` | Object|Array | - | custom style overrides |

### AcceptTerms

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | document title |
| `source` | - | - | URL or HTML content for DocumentViewer |
| `resultsCallback` | Boolean | - | called with true (agree) or false (disagree) |
| `textStrings` | - | {} | { disagree, agree, modalTitle, modalBody, |
| `style` | Object|Array | - | custom style overrides |

### Accordion

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `allowMultiple` | Boolean | - | boolean (allow multiple items expanded at once) |
| `expandedKeys` | Array | - | array (keys of expanded items) |
| `onChange` | Function | - | function (called with key of toggled item) |
| `children` | Node | - | AccordionItem elements |
| `style` | Object|Array | - | custom style overrides |

### AccordionItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | string (header label) |
| `children` | Node | - | expandable content |
| `expanded` | Boolean | - | boolean, whether the item is expanded |
| `onToggle` | Function | - | function (called when header is pressed) |
| `style` | Object|Array | - | custom style overrides |

### ActionSheet

**Tier:** composite | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | - | array of { label, onPress, disabled } |
| `children` | Node | - | the element to attach the long-press handler to |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### ActionableNotification

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `subtitle` | - | - | secondary text (optional) |
| `actionText` | - | - | string (action button label, optional) |
| `onAction` | Function | - | function (action handler, optional) |
| `onDismiss` | Function | - | function (dismiss handler, optional) |
| `kind` | String | 'info' | 'info' | 'success' | 'warning' | 'error' |
| `style` | Object|Array | - | custom style overrides |

### AspectRatio

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `ratio` | Number | - | number (width/height, default 1) |
| `children` | Node | - | content to render inside |
| `style` | Object|Array | - | custom style overrides |

### BadgeIndicator

**Tier:** atom | **Platform:** Both web and native | **Source:** unexported

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | Number | - | number (the count to display) |
| `max` | Number | - | number (display '99+' when count exceeds max, default 99) |
| `color` | - | - | string (color token, default 'interactive') |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### BottomNavigationBar

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | - | array of { icon, text, onPress, active } |
| `style` | Object|Array | - | custom style overrides |

### BottomSafeAreaColorOverride

**Tier:** molecule | **Platform:** Native primary (degrades on web) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | - | - | background color for the bottom safe area |
| `children` | Node | - | content above the safe area |
| `style` | Object|Array | - | custom style overrides |

### BottomToolbar

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | - | array of { text, icon, onPress } |
| `style` | Object|Array | - | custom style overrides |

### BottomToolbarPrimaryAction

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `primaryAction` | - | - | object with { text, onPress } |
| `items` | Array | - | array of secondary { text, icon, onPress } |
| `style` | Object|Array | - | custom style overrides |

### Breadcrumb

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | BreadcrumbItem elements |
| `style` | Object|Array | - | custom style overrides |

### BreadcrumbItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | - | - | string (optional URL) |
| `onPress` | Function | - | function (press handler) |
| `children` | Node | - | label content |
| `isCurrentPage` | Boolean | - | boolean, whether this is the current page |
| `style` | Object|Array | - | custom style overrides |

### Button

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `onPress` | Function | - | - |
| `disabled` | Boolean | - | - |
| `selected` | Boolean | - | - |
| `background` | - | - | - |
| `kind` | String | - | 'primary' | 'secondary' | 'danger' | 'ghost' (maps to button token family background and label color) |
| `radius` | - | - | - |
| `style` | Object|Array | - | - |
| `children` | Node | - | Node|Function (string wrapped in Text, function passed through) |
| `accessibilityLabel` | - | - | - |

### ButtonSet

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | button elements |
| `stacked` | Boolean | - | boolean (stack vertically, default false) |
| `style` | Object|Array | - | custom style overrides |

### Callout

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `kind` | String | 'info' | 'info' | 'success' | 'warning' | 'error' |
| `children` | Node | - | additional content (optional) |
| `style` | Object|Array | - | custom style overrides |

### Checkbox

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | String | - | true | false | 'mixed' |
| `onChange` | Function | - | callback receiving the next boolean |
| `disabled` | Boolean | - | boolean |
| `label` | - | - | string (rendered as Text child) |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### CheckboxGroup

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `values` | Array | - | array (controlled) |
| `defaultValues` | - | - | - |
| `onChange` | Function | - | callback receiving the selected values array |
| `options` | Array | [] | array of { value, label, disabled } |
| `disabled` | Boolean | - | boolean (disables the entire group) |
| `name` | - | - | string (group name for form submission) |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### ClickableTile

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | string |
| `subtitle` | - | - | string |
| `onPress` | Function | - | function |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### CodeSnippet

**Tier:** molecule | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | - | - | string (the code to display) |
| `language` | - | - | string (language label, e.g. 'javascript') |
| `showCopy` | Boolean | - | boolean (default true) |
| `onCopy` | Function | - | function (callback after copy) |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### Column

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content elements |
| `span` | Number | - | number (grid column span; absorbed from GridItem) |
| `style` | Object|Array | - | custom style overrides |

### ColumnHang

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content elements |
| `style` | Object|Array | - | custom style overrides |

### ComboBox

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `defaultValue` | - | - | - |
| `onChange` | Function | - | callback receiving the selected value |
| `options` | Array | [] | array of { value, label } |
| `placeholder` | - | - | string (default 'Search') |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### ComboButton

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `primaryLabel` | - | - | string (main button label) |
| `onPrimaryPress` | Function | - | - |
| `items` | Array | - | array of { label, onPress, disabled } |
| `style` | Object|Array | - | custom style overrides |

### ComposedModal

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | Boolean | - | boolean |
| `onClose` | Function | - | function |
| `children` | Node | - | ModalHeader, ModalBody, ModalFooter elements |
| `style` | Object|Array | - | custom style overrides |
| `initialFocusRef` | - | - | - |

### ContainedList

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (list label, optional) |
| `children` | Node | - | list item elements |
| `style` | Object|Array | - | custom style overrides |

### ContainedListItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | primary text for the nav item |
| `onPress` | Function | - | press handler |
| `children` | Node | - | additional content (optional) |
| `style` | Object|Array | - | custom style overrides |

### Content

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content elements |
| `style` | Object|Array | - | custom style overrides |

### ContentSwitcher

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectedIndex` | Number | - | number (0-based active switch index) |
| `onChange` | Function | - | function (called with new index) |
| `children` | Node | - | Switch elements |
| `style` | Object|Array | - | custom style overrides |

### ControlledPasswordInput

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `onChange` | Function | - | callback receiving the text value |
| `placeholder` | - | - | string |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### Copy

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (the text to copy) |
| `onSuccess` | Function | - | function (callback after successful copy) |
| `style` | Object|Array | - | custom style overrides |

### CopyButton

**Tier:** molecule | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (the text to copy) |
| `label` | - | - | string (button label, default 'Copy') |
| `onCopy` | Function | - | function (callback after copy) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### DataTable

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `headers` | Array | - | array of header strings |
| `rows` | Array | - | array of arrays (each inner array is a row of cell values) |
| `style` | Object|Array | - | custom style overrides |

### DataTableCell

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | - | - | string or node rendered inside the cell |
| `type` | String | - | 'default' | 'header' (controls text styling) |
| `width` | Number | - | number of points or a percentage string (cell width) |
| `onPress` | Function | - | optional press handler (makes the cell pressable) |
| `style` | Object|Array | - | custom style overrides |

### DataTableHeader

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `primaryAction` | - | - | single action object { label, onPress, kind } |
| `secondaryActions` | Array | - | array of action objects { label, onPress, kind } |
| `style` | Object|Array | - | custom style overrides |

### DataTableHeaderSelected

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectedCount` | Number | 0 | number of selected rows |
| `batchActions` | Array | - | array of action objects { label, onPress, kind } |
| `onCancel` | Function | - | function invoked when the cancel button is pressed |
| `style` | Object|Array | - | custom style overrides |

### DataTableRow

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `cells` | Array | - | array of cell values (strings or elements) |
| `onPress` | Function | - | press handler (optional; when absent, row is static) |
| `selected` | Boolean | - | boolean, whether the row is selected |
| `style` | Object|Array | - | custom style overrides |

### DateInput

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string YYYY-MM-DD (controlled) |
| `defaultValue` | - | - | - |
| `onChange` | Function | - | callback receiving the date string |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### DatePicker

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string YYYY-MM-DD (controlled) |
| `defaultValue` | - | - | - |
| `onChange` | Function | - | callback receiving the selected date string |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `datePickerType` | String | - | 'single' | 'range' (default 'single'; 'range' absorbed from DateRangePicker) |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### DatePickerInput

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `onChange` | Function | - | callback receiving the selected date string |
| `placeholder` | - | - | string |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### DefinitionTooltip

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `term` | - | - | string (the term being defined, shown inline) |
| `definition` | - | - | string (the definition content) |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### DismissibleTag

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (the tag label) |
| `onDismiss` | Function | - | function (called when dismiss is pressed) |
| `style` | Object|Array | - | custom style overrides |

### DocumentViewer

**Tier:** molecule | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `source` | - | - | string (URL or HTML content) |
| `style` | Object|Array | - | custom style overrides |

### Dropdown

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `triggerLabel` | - | - | - |
| `items` | - | - | - |
| `onSelect` | Function | - | - |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### ErrorBoundary

**Tier:** provider | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `onError` | Function | - | function (called with the error) |
| `fallback` | - | - | node (rendered when an error is caught) |
| `children` | Node | - | content to protect |

### ErrorBoundaryContext

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content to render within the error context |
| `style` | Object|Array | - | custom style overrides |

### ErrorState

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `subtitle` | - | - | secondary text (optional) |
| `icon` | - | 'error--filled' | icon name (optional, defaults to error--filled) |
| `children` | Node | - | additional content (optional) |
| `style` | Object|Array | - | custom style overrides |

### ExpandableSearch

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `defaultValue` | - | - | string (uncontrolled) |
| `onChange` | Function | - | callback receiving the text value |
| `onClear` | Function | - | callback when clear button is pressed |
| `placeholder` | - | - | string (default 'Search') |
| `disabled` | Boolean | - | boolean |
| `defaultExpanded` | Boolean | - | boolean (default false) |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### ExpandableTile

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | string (tile title) |
| `expanded` | Boolean | - | boolean (whether the tile is expanded) |
| `onToggle` | Function | - | function (called with next boolean) |
| `children` | Node | - | content (shown when expanded) |
| `style` | Object|Array | - | custom style overrides |

### FeatureFlags

**Tier:** provider | **Platform:** Both web and native | **Source:** unexported

| Prop | Type | Default | Description |
|---|---|---|---|
| `flags` | Number | {} | object (key-value map of feature flags) |
| `children` | Node | - | content to render within the flag context |

### FileUploader

**Tier:** composite | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (uploader label) |
| `accept` | Array | - | string | array (accepted file types) |
| `multiple` | Boolean | - | boolean (allow multiple files) |
| `onChange` | Function | - | function (called with selected files) |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### FileUploaderButton

**Tier:** molecule | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (button label) |
| `onPress` | Function | - | function (press handler) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### FileUploaderDropContainer

**Tier:** molecule | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `onDrop` | Function | - | function (called with dropped files) |
| `label` | - | - | string (drop area label) |
| `style` | Object|Array | - | custom style overrides |

### FileUploaderItem

**Tier:** molecule | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `filename` | - | - | string (name of the uploaded file) |
| `status` | String | - | string ('uploading' | 'edit' | 'complete') |
| `onRemove` | Function | - | function (called when remove is pressed) |
| `style` | Object|Array | - | custom style overrides |

### Filename

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | - | - | string (the filename to display) |
| `status` | String | - | string ('uploading' | 'edit' | 'complete') |
| `style` | Object|Array | - | custom style overrides |

### FilterableMultiSelect

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | [] | array of { value, label } (all available items) |
| `selectedItems` | Array | - | array (controlled, selected values) |
| `onChange` | Function | - | callback receiving the selected values array |
| `placeholder` | - | - | string (filter placeholder) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |
| `accessibilityLabel` | - | - | - |

### FlexGrid

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | grid item elements |
| `gap` | - | - | gap in pixels between items (default 0) |
| `style` | Object|Array | - | custom style overrides |

### FluidForm

**Tier:** provider | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `fluid` | Boolean | true | boolean (default true) |
| `children` | Node | - | content to render within the fluid context |

### Form

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | form field elements |
| `onSubmit` | Function | - | submit handler function |
| `style` | Object|Array | - | custom style overrides |

### FormContext

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content to render within the form context |
| `style` | Object|Array | - | custom style overrides |

### FormGroup

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | form field elements |
| `label` | - | - | string (optional group label) |
| `invalid` | Boolean | - | boolean (shows message in danger color) |
| `message` | - | - | string (helper or error text shown below the group) |
| `disabled` | Boolean | - | boolean (dims the label) |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### FormItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string, rendered through FormLabel |
| `children` | Node | - | the form control element |
| `helperText` | - | - | string, shown below the control when no error |
| `errorText` | - | - | string, shown below the control in danger color |
| `required` | Boolean | - | boolean, passed to FormLabel |
| `disabled` | Boolean | - | boolean, passed to FormLabel |
| `style` | Object|Array | - | custom style overrides |

### FormLabel

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | string or node, the label text |
| `htmlFor` | - | - | string, the id of the associated control (web only) |
| `required` | Boolean | - | boolean, shows required indicator |
| `disabled` | Boolean | - | boolean, dims the label |
| `style` | Object|Array | - | custom style overrides |

### GlobalTheme

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content to theme |
| `style` | Object|Array | - | custom style overrides |

### GrantPermission

**Tier:** molecule | **Platform:** Native primary (degrades on web) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `subtitle` | - | - | secondary text (optional) |
| `icon` | - | 'information--filled' | icon name (optional) |
| `onGrant` | Function | - | grant handler |
| `onDeny` | Function | - | deny handler (optional) |
| `style` | Object|Array | - | custom style overrides |

### Grid

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | grid item elements |
| `columns` | Number | - | number of columns (default 2) |
| `gap` | - | - | gap in pixels between items (default 0) |
| `style` | Object|Array | - | custom style overrides |

### GridSettings

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | Number | - | number (grid column count) |
| `gap` | - | - | string (grid gap token) |
| `style` | Object|Array | - | custom style overrides |

### HStack

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `spacing` | - | 'spacing_03' | string (space token, default 'md') |
| `children` | Node | - | content to stack |
| `style` | Object|Array | - | custom style overrides |

### Header

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | HeaderNavigation, HeaderMenuButton, HeaderPanel elements |
| `style` | Object|Array | - | custom style overrides |

### HeaderContainer

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | header content elements |
| `style` | Object|Array | - | custom style overrides |

### HeaderGlobalAction

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | - | - | string (icon name) |
| `onPress` | Function | - | function (press handler) |
| `label` | - | - | string (accessibility label) |
| `style` | Object|Array | - | custom style overrides |

### HeaderGlobalBar

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | HeaderGlobalAction elements |
| `style` | Object|Array | - | custom style overrides |

### HeaderMenu

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (menu label) |
| `children` | Node | - | HeaderMenuItem elements |
| `style` | Object|Array | - | custom style overrides |

### HeaderMenuButton

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `onPress` | Function | - | function (press handler) |
| `label` | - | - | string (button label) |
| `isActive` | Boolean | - | boolean, whether the menu is currently open |
| `style` | Object|Array | - | custom style overrides |

### HeaderMenuItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (item label) |
| `onPress` | Function | - | function (press handler) |
| `style` | Object|Array | - | custom style overrides |

### HeaderName

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (application name) |
| `onPress` | Function | - | function (press handler) |
| `prefix` | - | - | string (optional prefix before the name) |
| `style` | Object|Array | - | custom style overrides |

### HeaderNavigation

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | navigation content (links, menu items) |
| `style` | Object|Array | - | custom style overrides |

### HeaderPanel

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | panel content |
| `expanded` | Boolean | - | boolean, whether the panel is visible |
| `style` | Object|Array | - | custom style overrides |

### HeaderSideNavItems

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | side nav item elements |
| `style` | Object|Array | - | custom style overrides |

### Heading

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `level` | - | - | 1-6 (default 1, maps to aria-level) |
| `typeSet` | - | typeSetMap[lvl] || 'heading01' | type set name (heading01 through heading07) |
| `children` | Node | - | heading text content |
| `style` | Object|Array | - | custom style overrides |

### Icon

**Tier:** atom | **Platform:** Both web and native | **Source:** substrate

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | - | - | glyph name (vendor-specific, set by the host adapter) |
| `size` | Number | - | number of points or a size token (xs..xxl, default md) |
| `color` | - | - | color.* token name (default icon_primary) |
| `style` | Object|Array | - | - |

### IconButton

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | - | - | string (icon glyph name) |
| `onPress` | Function | - | function |
| `disabled` | Boolean | - | boolean |
| `size` | - | - | string (icon size token, default 'md'); a CSS unit string is rejected |
| `color` | - | - | string (icon color token) |
| `label` | - | - | string (accessibility label, required) |
| `style` | Object|Array | - | custom style overrides |

### IconIndicator

**Tier:** atom | **Platform:** Both web and native | **Source:** unexported

| Prop | Type | Default | Description |
|---|---|---|---|
| `iconName` | - | - | string (name of the icon to render) |
| `color` | - | - | color.* token name (background, default interactive) |
| `iconColor` | - | 'text_on_color' | color.* token name (icon glyph, default text_on_color) |
| `size` | Number | - | number of points (default 24) |
| `label` | - | - | string (accessibility label) |
| `style` | Object|Array | - | custom style overrides |

### IconSwitch

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | - | - | string (icon name) |
| `checked` | Boolean | - | boolean (whether the switch is on) |
| `onToggle` | Function | - | function (called with next boolean) |
| `style` | Object|Array | - | custom style overrides |

### IconTab

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | - | - | string (icon name) |
| `active` | Boolean | - | boolean (whether this tab is active) |
| `onPress` | Function | - | function (press handler) |
| `style` | Object|Array | - | custom style overrides |

### IdPrefix

**Tier:** provider | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `prefix` | - | '' | string (the id prefix, e.g. 'my-app') |
| `children` | Node | - | content to render within the prefix context |

### Image

**Tier:** atom | **Platform:** Both web and native | **Source:** substrate

| Prop | Type | Default | Description |
|---|---|---|---|
| `radius` | - | - | - |
| `background` | - | - | - |
| `style` | Object|Array | - | - |

### InlineLink

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `onPress` | Function | - | callback |
| `title` | - | - | link text content |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |
| `accessibilityLabel` | - | - | - |

### InlineLoading

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | String | 'active' | 'active' | 'inactive' | 'error' (default 'active') |
| `label` | - | - | string (loading text, default 'Loading...') |
| `style` | Object|Array | - | custom style overrides |

### InlineNotification

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `subtitle` | - | - | secondary text (optional) |
| `kind` | String | 'info' | 'info' | 'success' | 'warning' | 'error' |
| `style` | Object|Array | - | custom style overrides |

### LandingView

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | page content |
| `style` | Object|Array | - | custom style overrides |

### Layer

**Tier:** provider | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `level` | Number | - | number (optional override; defaults to parent level + 1) |
| `children` | Node | - | content to render within the layer context |

### Link

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | - | - | string (URL, web only) |
| `onPress` | Function | - | callback |
| `disabled` | Boolean | - | boolean |
| `children` | Node | - | link text content |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### List

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `ordered` | Boolean | - | boolean (when true, renders an ordered list) |
| `children` | Node | - | list items |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### ListItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `subtitle` | - | - | secondary text (optional) |
| `icon` | - | - | leading icon name (optional) |
| `trailing` | - | - | trailing element (optional) |
| `onPress` | Function | - | press handler (optional; when absent, item is static) |
| `selected` | Boolean | - | boolean, whether the item is selected |
| `disabled` | Boolean | - | - |
| `style` | Object|Array | - | - |

### LiveRegionProvider

**Tier:** provider | **Platform:** Both web and native | **Source:** infrastructure

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | - |

### Loading

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (announced to screen readers) |
| `size` | String | - | 'sm' | 'md' | 'lg' (default 'md'); a CSS unit string is rejected |
| `style` | Object|Array | - | custom style overrides |

### Menu

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | Boolean | - | boolean |
| `onClose` | Function | - | function |
| `children` | Node | - | MenuItem elements |
| `placement` | - | - | string (default 'bottom-start') |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### MenuButton

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (button label) |
| `items` | Array | - | array of { label, onPress, disabled } |
| `icon` | - | - | string (optional leading icon) |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### MenuItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string |
| `onPress` | Function | - | function |
| `disabled` | Boolean | - | boolean |
| `icon` | - | - | string (optional leading icon) |
| `shortcut` | - | - | string (optional shortcut hint) |
| `style` | Object|Array | - | custom style overrides |

### MenuItemDivider

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | custom style overrides |

### MenuItemGroup

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (group label, optional) |
| `children` | Node | - | menu item elements |
| `style` | Object|Array | - | custom style overrides |

### MenuItemRadioGroup

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | - | array of { label, value } |
| `value` | Number | - | string (selected value) |
| `onChange` | Function | - | function (called with selected value) |
| `style` | Object|Array | - | custom style overrides |

### MenuItemSelectable

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string |
| `checked` | Boolean | - | boolean |
| `onChange` | Function | - | function (called with next boolean) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### Modal

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | Boolean | - | - |
| `onClose` | Function | - | - |
| `children` | Node | - | - |
| `style` | Object|Array | - | - |
| `initialFocusRef` | - | - | - |
| `finalFocusRef` | - | - | - |

### ModalBody

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | modal body content |
| `style` | Object|Array | - | custom style overrides |

### ModalFooter

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | footer content (usually buttons) |
| `style` | Object|Array | - | custom style overrides |

### ModalHeader

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | string |
| `subtitle` | - | - | string (optional) |
| `closeOnPress` | - | - | - |
| `children` | Node | - | additional content |
| `style` | Object|Array | - | custom style overrides |

### MultiSelect

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `values` | Array | - | array (controlled) |
| `defaultValues` | - | - | - |
| `onChange` | Function | - | callback receiving the selected values array |
| `options` | Array | [] | array of { value, label } |
| `placeholder` | - | - | string (default 'Select options') |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### NavigationList

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | heading text (optional) |
| `children` | Node | - | navigation list items |
| `style` | Object|Array | - | custom style overrides |

### NavigationListItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `onPress` | Function | - | press handler |
| `icon` | - | - | leading icon name (optional) |
| `style` | Object|Array | - | custom style overrides |

### Notification

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `subtitle` | - | - | secondary text (optional) |
| `status` | String | 'info' | 'success' | 'error' | 'warning' | 'info' |
| `onClose` | Function | - | close handler (optional; when absent, no close button) |
| `children` | Node | - | additional content (optional) |
| `style` | Object|Array | - | - |

### NotificationActionButton

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (button label) |
| `onPress` | Function | - | function (press handler) |
| `kind` | - | - | string (button kind, optional) |
| `style` | Object|Array | - | custom style overrides |

### NotificationButton

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `onPress` | Function | - | function (press handler) |
| `style` | Object|Array | - | custom style overrides |

### NumberInput

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | Number | - | number (controlled) |
| `defaultValue` | Number | - | number (uncontrolled) |
| `onChange` | Function | - | callback receiving the next number |
| `min` | Number | - | number |
| `max` | Number | - | number |
| `step` | Number | - | number (default 1) |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### OperationalTag

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (the tag label) |
| `onAction` | Function | - | function (called when the tag is pressed) |
| `style` | Object|Array | - | custom style overrides |

### OrderedList

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | list item elements |
| `style` | Object|Array | - | custom style overrides |

### OverflowMenu

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | Array | - | array of { label, onPress, disabled } |
| `triggerLabel` | - | - | - |
| `placement` | - | - | string (default 'bottom-end') |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### OverflowMenuItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (item label) |
| `onPress` | Function | - | function (press handler) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### Overlay

**Tier:** provider | **Platform:** Split (web and native differ) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | - |

### Pagination

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `page` | Number | - | number (current page, 1-based) |
| `totalPage` | Number | - | number (total number of pages) |
| `onChange` | Function | - | function (called with new page number) |
| `pageSize` | Number | - | number (items per page, optional) |
| `style` | Object|Array | - | custom style overrides |
| `// eslint-disable-line no-unused-vars
      ...rest` | - | - | - |

### PaginationNav

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `currentPage` | Number | - | number (the active page, 1-based) |
| `totalPages` | Number | - | number (total number of pages) |
| `onChange` | Function | - | function (called with selected page number) |
| `style` | Object|Array | - | custom style overrides |

### PasswordInput

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `defaultValue` | - | - | string (uncontrolled) |
| `onChange` | Function | - | callback receiving the text value |
| `placeholder` | - | - | string |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### Popover

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | Boolean | - | boolean |
| `onClose` | Function | - | function |
| `placement` | - | - | string (default 'top') |
| `content` | - | - | node (popover content) |
| `children` | Node | - | trigger element |
| `style` | Object|Array | - | custom style overrides |

### PopoverContent

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | popover content elements |
| `style` | Object|Array | - | custom style overrides |

### PrefixContext

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content to render within the prefix context |
| `style` | Object|Array | - | custom style overrides |

### ProgressBar

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | 0 to 1 for determinate, null for indeterminate |
| `color` | - | - | color.* token name for the fill (default interactive) |
| `trackColor` | - | - | color.* token name for the track (default layer_02) |
| `height` | - | - | bar height in points (default 4) |
| `style` | Object|Array | - | - |

### ProgressIndicator

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | Number | - | number (1-based current step number) |
| `children` | Node | - | ProgressStep elements |
| `style` | Object|Array | - | custom style overrides |

### ProgressStep

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (step label) |
| `status` | String | 'incomplete' | 'complete' | 'current' | 'incomplete' |
| `stepNumber` | Number | - | number (1-based step position) |
| `style` | Object|Array | - | custom style overrides |

### RadioButton

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | Boolean | - | boolean |
| `onChange` | Function | - | callback receiving the next boolean (always true) |
| `disabled` | Boolean | - | boolean |
| `label` | - | - | string (rendered as Text child) |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### RadioButtonGroup

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `defaultValue` | - | - | - |
| `onChange` | Function | - | callback receiving the selected value |
| `options` | Array | [] | array of { value, label, disabled } |
| `disabled` | Boolean | - | boolean (disables the entire group) |
| `name` | - | - | string (group name for form submission) |
| `orientation` | String | - | 'horizontal' | 'vertical' (default 'vertical') |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### RadioTile

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | - | - | string (radio group name) |
| `value` | Number | - | string (tile value) |
| `checked` | Boolean | - | boolean (whether this tile is selected) |
| `onSelect` | Function | - | function (called with the value) |
| `style` | Object|Array | - | custom style overrides |

### Row

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content elements |
| `style` | Object|Array | - | custom style overrides |

### SafeAreaWrapper

**Tier:** molecule | **Platform:** Native primary (degrades on web) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | wrapped content |
| `style` | Object|Array | - | custom style overrides |

### Search

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `defaultValue` | - | - | string (uncontrolled) |
| `onChange` | Function | - | callback receiving the text value |
| `onClear` | Function | - | callback when clear button is pressed |
| `placeholder` | - | - | string (default 'Search') |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### Section

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content elements |
| `style` | Object|Array | - | custom style overrides |

### Select

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `defaultValue` | - | - | - |
| `onChange` | Function | - | callback receiving the selected value |
| `options` | Array | [] | array of { value, label } |
| `placeholder` | - | - | string (default 'Select an option') |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### SelectItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | Number | - | string (the option value) |
| `text` | - | - | string (the display label) |
| `onSelect` | Function | - | function (called with the value when selected) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### SelectItemGroup

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (the group label) |
| `children` | Node | - | SelectItem elements |
| `style` | Object|Array | - | custom style overrides |

### SelectableTag

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (the tag label) |
| `selected` | Boolean | - | boolean (whether the tag is selected) |
| `onSelect` | Function | - | function (called with next boolean) |
| `style` | Object|Array | - | custom style overrides |

### SelectableTile

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | string |
| `selected` | Boolean | - | boolean |
| `onSelect` | Function | - | function (called with next boolean) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### ShapeIndicator

**Tier:** atom | **Platform:** Both web and native | **Source:** unexported

| Prop | Type | Default | Description |
|---|---|---|---|
| `shape` | String | 'circle' | 'circle' | 'square' | 'triangle' (default 'circle') |
| `color` | - | - | color.* token name (default interactive) |
| `size` | Number | - | number of points (default 16) |
| `label` | - | - | string (accessibility label) |
| `style` | Object|Array | - | custom style overrides |

### SideNav

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | side nav content elements |
| `expanded` | Boolean | - | boolean (whether the side nav is expanded) |
| `style` | Object|Array | - | custom style overrides |

### SideNavDetails

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | string (section title) |
| `children` | Node | - | detail content elements |
| `style` | Object|Array | - | custom style overrides |

### SideNavDivider

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | custom style overrides |

### SideNavFooter

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | footer content elements |
| `style` | Object|Array | - | custom style overrides |

### SideNavHeader

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | string (section title) |
| `children` | Node | - | header content elements |
| `style` | Object|Array | - | custom style overrides |

### SideNavIcon

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | - | - | string (icon name) |
| `style` | Object|Array | - | custom style overrides |

### SideNavItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (item label) |
| `onPress` | Function | - | function (press handler) |
| `active` | Boolean | - | boolean (whether this item is active) |
| `style` | Object|Array | - | custom style overrides |

### SideNavItems

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | side nav item elements |
| `style` | Object|Array | - | custom style overrides |

### SideNavLink

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (link label) |
| `onPress` | Function | - | function (press handler) |
| `icon` | - | - | string (optional leading icon name) |
| `style` | Object|Array | - | custom style overrides |

### SideNavLinkText

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | text content |
| `style` | Object|Array | - | custom style overrides |

### SideNavMenu

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (menu label) |
| `expanded` | Boolean | - | boolean (whether the menu is expanded) |
| `onToggle` | Function | - | function (called with next boolean) |
| `children` | Node | - | SideNavMenuItem elements (shown when expanded) |
| `style` | Object|Array | - | custom style overrides |

### SideNavMenuItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (item label) |
| `onPress` | Function | - | function (press handler) |
| `style` | Object|Array | - | custom style overrides |

### SideNavSwitcher

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (switcher label) |
| `options` | Array | - | array (switcher options) |
| `onChange` | Function | - | function (called with selected option) |
| `style` | Object|Array | - | custom style overrides |

### SidePanel

**Tier:** composite | **Platform:** Both web and native | **Source:** unexported

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | Boolean | - | boolean |
| `onClose` | Function | - | function |
| `title` | - | - | string (optional panel header) |
| `children` | Node | - | panel content |
| `side` | String | 'right' | 'left' | 'right' (default 'right') |
| `width` | Number | - | number of points or a percentage string (default 320) |
| `style` | Object|Array | - | custom style overrides |

### Skeleton

**Tier:** atom | **Platform:** Both web and native | **Source:** collapse

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | String | 'text' | 'text' | 'icon' | 'placeholder' (default 'text') |
| `lines` | Number | 1 | number (for text variant, default 1) |
| `width` | Number | - | number of points or a percentage string (default '100%') |
| `height` | Number | - | number of points or a percentage string (default 16 for text, 48 for placeholder) |
| `style` | Object|Array | - | custom style overrides |

### SkeletonIcon

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | custom style overrides |

### SkeletonPlaceholder

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | custom style overrides |

### SkeletonText

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `lines` | Number | 3 | number (default 3) |
| `style` | Object|Array | - | custom style overrides |

### SkipToContent

**Tier:** molecule | **Platform:** Web primary (null on native) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | - | (targetId ? ('#' + targetId) : '#main-content') | string (link target, optional) |
| `targetId` | - | - | string (id of the content to skip to) |
| `style` | Object|Array | - | custom style overrides |

### Slider

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | Number | - | number (controlled) |
| `defaultValue` | - | - | - |
| `min` | Number | - | number (default 0) |
| `max` | Number | - | number (default 100) |
| `step` | Number | - | number (default 1) |
| `onChange` | Function | - | callback receiving the next number |
| `disabled` | Boolean | - | boolean |
| `hideTextInput` | Boolean | - | boolean (default true; when false, shows a paired NumberInput) |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### Stack

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | String | 'vertical' | 'vertical' | 'horizontal' (default 'vertical') |
| `gap` | - | 'spacing_03' | string (space token, default 'md') |
| `children` | Node | - | content to stack |
| `style` | Object|Array | - | custom style overrides |

### StaticNotification

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `kind` | String | 'info' | 'info' | 'success' | 'warning' | 'error' |
| `children` | Node | - | additional content (optional) |
| `style` | Object|Array | - | custom style overrides |

### StructuredListBody

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | structured list row elements |
| `style` | Object|Array | - | custom style overrides |

### StructuredListCell

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | cell content |
| `style` | Object|Array | - | custom style overrides |

### StructuredListHead

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | structured list row elements (header rows) |
| `style` | Object|Array | - | custom style overrides |

### StructuredListInput

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | - | - | string (radio group name) |
| `value` | Number | - | string (input value) |
| `checked` | Boolean | - | boolean (whether this input is selected) |
| `onChange` | Function | - | function (called with the value) |
| `style` | Object|Array | - | custom style overrides |

### StructuredListRow

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | cell elements |
| `style` | Object|Array | - | custom style overrides |

### StructuredListWrapper

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | structured list row elements |
| `style` | Object|Array | - | custom style overrides |

### Switch

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (switch label text) |
| `selected` | Boolean | - | boolean, whether this switch is selected |
| `onPress` | Function | - | function (press handler) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### Switcher

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | switcher item elements |
| `style` | Object|Array | - | custom style overrides |

### SwitcherDivider

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | custom style overrides |

### SwitcherItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (item label) |
| `onPress` | Function | - | function (press handler) |
| `style` | Object|Array | - | custom style overrides |

### Tab

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (tab label text) |
| `selected` | Boolean | - | boolean, whether this tab is selected |
| `onPress` | Function | - | function (press handler) |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### TabContent

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | tab panel content |
| `style` | Object|Array | - | custom style overrides |

### TabList

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | Tab elements |
| `style` | Object|Array | - | custom style overrides |

### TabListVertical

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | Tab elements |
| `style` | Object|Array | - | custom style overrides |

### TabPanel

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | panel content |
| `selected` | Boolean | - | boolean, whether this panel is visible |
| `style` | Object|Array | - | custom style overrides |

### TabPanels

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | tab panel elements |
| `style` | Object|Array | - | custom style overrides |

### Table

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | table content elements |
| `style` | Object|Array | - | custom style overrides |

### TableActionList

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | action button elements |
| `style` | Object|Array | - | custom style overrides |

### TableBatchAction

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | button text |
| `onPress` | Function | - | press handler |
| `disabled` | Boolean | - | boolean |
| `style` | Object|Array | - | custom style overrides |

### TableBatchActions

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | action button elements |
| `style` | Object|Array | - | custom style overrides |

### TableBody

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | row elements |
| `style` | Object|Array | - | custom style overrides |

### TableCell

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | cell content |
| `style` | Object|Array | - | custom style overrides |

### TableContainer

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content elements |
| `maxWidth` | Number | - | number of points or a percentage string (default 1200) |
| `style` | Object|Array | - | custom style overrides |

### TableDecoratorRow

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | custom style overrides |

### TableExpandHeader

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `isExpanded` | Boolean | - | boolean, whether the row group is currently expanded |
| `onToggle` | Function | - | function invoked when the toggle is pressed |
| `style` | Object|Array | - | custom style overrides |

### TableExpandRow

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `isExpanded` | Boolean | - | boolean, whether this row is currently expanded |
| `onToggle` | Function | - | function invoked when the row is pressed to toggle |
| `children` | Node | - | row cell elements |
| `style` | Object|Array | - | custom style overrides |

### TableExpandedRow

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | expanded content elements |
| `style` | Object|Array | - | custom style overrides |

### TableHead

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | header row elements |
| `style` | Object|Array | - | custom style overrides |

### TableHeader

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | header content |
| `style` | Object|Array | - | custom style overrides |

### TableRow

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | cell elements |
| `style` | Object|Array | - | custom style overrides |

### TableSelectAll

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | String | - | true | false | 'mixed' (current selection state) |
| `onSelectAll` | Function | - | function receiving the next boolean |
| `ariaLabel` | - | - | string (accessibility label for the checkbox) |
| `style` | Object|Array | - | custom style overrides |

### TableSelectRow

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | Boolean | - | true | false (current selection state of the row) |
| `onSelect` | Function | - | function receiving the next boolean |
| `ariaLabel` | - | - | string (accessibility label for the checkbox) |
| `style` | Object|Array | - | custom style overrides |

### TableSlugRow

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `slug` | - | - | string (short label rendered at the row start) |
| `children` | Node | - | row cell elements |
| `style` | Object|Array | - | custom style overrides |

### TableToolbar

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | tool button elements |
| `style` | Object|Array | - | custom style overrides |

### TableToolbarAction

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | - | - | string (icon glyph name) |
| `onPress` | Function | - | function (press handler) |
| `label` | - | - | string (button text / accessibility label) |
| `style` | Object|Array | - | custom style overrides |

### TableToolbarContent

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | toolbar content elements (actions, search) |
| `style` | Object|Array | - | custom style overrides |

### TableToolbarMenu

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (trigger label, default 'Options') |
| `children` | Node | - | array of menu item objects { label, onPress, disabled } |
| `style` | Object|Array | - | custom style overrides |

### TableToolbarSearch

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | Number | - | string (controlled search value) |
| `onChange` | Function | - | callback receiving the text value |
| `placeholder` | - | - | string (placeholder text, default 'Search') |
| `style` | Object|Array | - | custom style overrides |

### Tabs

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectedIndex` | Number | - | number (0-based active tab index) |
| `onChange` | Function | - | function (called with new index) |
| `children` | Node | - | Tab elements |
| `style` | Object|Array | - | custom style overrides |

### TabsVertical

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectedIndex` | Number | - | number (0-based active tab index) |
| `onChange` | Function | - | function (called with new index) |
| `children` | Node | - | TabListVertical and TabPanels elements |
| `style` | Object|Array | - | custom style overrides |

### Tag

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string, tag text |
| `onDismiss` | Function | - | function (when provided, renders a close button) |
| `disabled` | Boolean | - | boolean |
| `selected` | Boolean | - | boolean (for selectable tags) |
| `onPress` | Function | - | function (for selectable tags) |
| `variant` | String | - | 'default' | 'operational' (color scheme) |
| `style` | Object|Array | - | custom style overrides |
| `accessibilityLabel` | - | - | - |

### Text

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `typeSet` | - | CONFIG.DEFAULT_TYPE_SET | type_<typeSet>     (body01|heading01|caption01|...) |
| `color` | - | - | font_<color>       (text_primary|text_secondary|interactive|...) |
| `weight` | - | - | font_weight_<weight> (regular|medium|semibold|bold) |
| `family` | - | - | font_family_<family> (sans|serif|mono) |
| `align` | - | - | - |
| `style` | Object|Array | - | - |
| `children` | Node | - | - |

### TextArea

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string (controlled) |
| `defaultValue` | - | - | string (uncontrolled) |
| `onChange` | Function | - | callback receiving the text value |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `placeholder` | - | - | string |
| `rows` | Number | - | number (visual height in lines, default 4) |
| `layer` | - | - | - |
| `typeSet` | - | - | - |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### TextInput

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |
| `isInvalid` | Boolean | - | - |
| `isDisabled` | Boolean | - | - |
| `layer` | - | - | - |
| `typeSet` | - | - | - |
| `onFocus` | Function | - | - |
| `onBlur` | Function | - | - |

### Theme

**Tier:** provider | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | - | - | object (theme contract to provide) |
| `children` | Node | - | content to render within the theme context |

### ThemeContext

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | content to render within the theme context |
| `style` | Object|Array | - | custom style overrides |

### Tile

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | string |
| `subtitle` | - | - | string |
| `icon` | - | - | string (icon name) |
| `children` | Node | - | additional content |
| `style` | Object|Array | - | custom style overrides |

### TileAboveTheFoldContent

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | above-the-fold content |
| `style` | Object|Array | - | custom style overrides |

### TileBelowTheFoldContent

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | below-the-fold content |
| `style` | Object|Array | - | custom style overrides |

### TileGroup

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | tile elements |
| `style` | Object|Array | - | custom style overrides |

### TimePicker

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | - | - | string HH:MM (controlled) |
| `defaultValue` | - | - | - |
| `onChange` | Function | - | callback receiving the selected time string |
| `disabled` | Boolean | - | boolean |
| `invalid` | Boolean | - | boolean |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### TimePickerSelect

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | Number | - | string (controlled, the selected time value) |
| `onChange` | Function | - | callback receiving the selected value |
| `options` | Array | - | array of { value, label } |
| `style` | Object|Array | - | custom style overrides |

### ToastNotification

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | primary text |
| `subtitle` | - | - | secondary text (optional) |
| `status` | String | 'info' | 'success' | 'error' | 'warning' | 'info' |
| `onClose` | Function | - | close handler (called on close or auto-dismiss) |
| `duration` | - | - | milliseconds before auto-dismiss (default 3000) |
| `style` | Object|Array | - | - |

### Toggle

**Tier:** atom | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | Boolean | - | boolean, whether the toggle is on |
| `onValueChange` | Function | - | callback when the value changes |
| `disabled` | Boolean | - | boolean, whether the toggle is non-interactive |
| `style` | Object|Array | - | - |
| `accessibilityLabel` | - | - | - |

### Toggletip

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | - | - | string or node (toggletip content) |
| `children` | Node | - | trigger element |
| `placement` | - | - | string (default 'top') |
| `style` | Object|Array | - | custom style overrides |

### ToggletipActions

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | action button elements |
| `style` | Object|Array | - | custom style overrides |

### ToggletipButton

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | - | - | string (the button label) |
| `onPress` | Function | - | function (called when pressed) |
| `style` | Object|Array | - | custom style overrides |

### ToggletipContent

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | toggletip content elements |
| `style` | Object|Array | - | custom style overrides |

### ToggletipLabel

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | the label text |
| `toggletipContent` | - | - | content to show in the toggletip |
| `children` | Node | - | additional content (optional) |
| `style` | Object|Array | - | custom style overrides |

### Tooltip

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | - | - | string or node (tooltip content) |
| `children` | Node | - | trigger element |
| `placement` | - | - | string (default 'top') |
| `style` | Object|Array | - | custom style overrides |

### TopNavigationBar

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | main title string |
| `subTitle` | - | - | optional subtitle string |
| `leftItems` | Array | - | array of { icon, text, onPress } |
| `rightItems` | Array | - | array of { icon, text, onPress } |
| `headerMode` | Boolean | - | boolean (larger title when true) |
| `style` | Object|Array | - | custom style overrides |

### TopNavigationBarLogin

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | main title string |
| `loginAction` | - | - | object with { text, onPress } |
| `style` | Object|Array | - | custom style overrides |

### TreeNode

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | - | - | string (node label) |
| `children` | Node | - | child TreeNode elements (optional) |
| `expanded` | Boolean | - | boolean, whether the node is expanded |
| `onToggle` | Function | - | function (called when expand/collapse is pressed) |
| `selected` | Boolean | - | boolean, whether this node is selected |
| `level` | Number | - | number (depth in the tree, 1-based) |
| `style` | Object|Array | - | custom style overrides |

### TreeView

**Tier:** composite | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | Array | - | array of { key, label, children, expanded, selected } |
| `onSelect` | Function | - | function (called with selected node key) |
| `expandedKeys` | Array | - | array (keys of expanded nodes) |
| `style` | Object|Array | - | custom style overrides |

### TruncatedText

**Tier:** molecule | **Platform:** Both web and native | **Source:** unexported

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | string (the text content) |
| `maxLines` | Number | - | number (max lines before truncation, default 2) |
| `style` | Object|Array | - | custom style overrides |

### UiPanel

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | - | - | panel header text |
| `collapsed` | Boolean | - | boolean (true = content hidden) |
| `onToggle` | Function | - | callback when header is pressed |
| `children` | Node | - | panel content |
| `style` | Object|Array | - | custom style overrides |

### UiPanelItem

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | - | - | icon name (optional) |
| `text` | - | - | item label |
| `onPress` | Function | - | callback when pressed |
| `style` | Object|Array | - | custom style overrides |

### UnorderedList

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | list item elements |
| `style` | Object|Array | - | custom style overrides |

### UserAvatar

**Tier:** molecule | **Platform:** Both web and native | **Source:** unexported

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | - | - | string (image URL) |
| `initials` | - | - | string (fallback text, e.g. 'JD') |
| `size` | Number | - | number of points (default 40) |
| `label` | - | - | string (accessibility label) |
| `style` | Object|Array | - | custom style overrides |

### VStack

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `spacing` | - | 'spacing_03' | string (space token, default 'md') |
| `children` | Node | - | content to stack |
| `style` | Object|Array | - | custom style overrides |

### View

**Tier:** atom | **Platform:** Both web and native | **Source:** substrate

| Prop | Type | Default | Description |
|---|---|---|---|
| `background` | - | - | - |
| `layer` | - | background | - |
| `radius` | - | - | - |
| `border` | - | - | - |
| `style` | Object|Array | - | - |
| `children` | Node | - | - |

### ViewWrapper

**Tier:** molecule | **Platform:** Native primary (degrades on web) | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | wrapped content |
| `style` | Object|Array | - | custom style overrides |

### WebHeader

**Tier:** molecule | **Platform:** Both web and native | **Source:** non-carbon

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | Node | - | header content |
| `style` | Object|Array | - | custom style overrides |

<!-- END GENERATED: component-sections -->

## Motion

Every animation in this library reads its curve and duration from the theme and runs it through `parts/motion.js`, which implements the three curve kinds of the Superloom contract: a bezier (`Easing.bezier`), a spring (`Animated.spring` parameters), and segments (a sequenced list of beziers). Components decide what animates and in which order; the theme decides how fast and along which curve. A theme can change every curve without a release of this library. Adding a fourth curve kind is a release of this library and a new contract version.

## Stacking

Which surface sits above which is the same in every design system, so it is not a theme value. `data/stacking.js` is the one table: `hidden -1`, `overflow_hidden -1`, `header 8000`, `footer 8000`, `overlay 8000`, `modal 9000`, `dropdown 9100`, `floating 10000`. Every `zIndex` in this library reads it.

## Focus ring

The focus ring is drawn with the `outline*` style props (React Native 0.77 or later), so it never changes layout. `feedback.focus` selects `outline`, `inset`, or `underline`; `focus.width`, `focus.offset`, and `color.focus` size and color it.

## Runtime floor

This library requires React Native 0.86 or later and React Native for Web 0.21 or later. The floor is the React Native version pinned by the latest Expo SDK and rises with it. Below the floor, `boxShadow` and the `outline*` props do not render.

## Units

Theme values are unit-free numbers. The Themer engine attaches units at emit time; the component library never carries `rem`, `em`, `px`, `vw`, `vh`, or `ms` strings in its theme data or component source. A layout dimension is a number of points or a percentage string; percentage strings are layout units, never theme values, and appear only on the style props in `percent_style_props` (`data/style-contract.json`). The runtime unit audit (L1) walks every rendered component and fails on a percentage string under a prop not in that list or on any unit string under any prop. CI gate G29 enforces the same rule statically. `Parts.Units.isLength(value)` validates a layout dimension: `true` for a number or a percentage string, `false` for a CSS unit string.

## Where a value came from

A reference theme package lists in `from_base` the keys its design system did not define. When `config.DEBUG_FROM_BASE` is true, `createSystem` reports at debug level every key it read that the theme took from the base template. This is information, not an error: leaving a key to Superloom's base is a legitimate choice.