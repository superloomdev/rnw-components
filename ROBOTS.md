# ROBOTS.md - rnw-components

> Compact signature reference for AI agents. Read this before calling any function in this module.

**Module:** `@superloomdev/rnw-components` | **Alias:** `rnw-components` | **Class:** I (standalone framework module, createSystem) | **Runtime:** React Native Web (web, iOS, Android), Node.js 24+ for testing

## Load

`createSystem` is the only entry point. There is no default export.

```javascript
import { createSystem, View, Text, Button } from 'rnw-components';
import Themer from 'helper-themer';

const built = Themer.buildTheme(template, layers, 'native');

const system = createSystem({
  Utils: Utils,
  Debug: Debug,
  React: React,
  Device: Device,
  Themer: Themer,         // required; contract validation and theme building
  Icons: Icons            // optional; Icon atom returns null without it
}, {}, built, 'sm');

system.addComponents({ View, Text, Button });

const C = system.Component;
```

Each call returns an independent system with its own registry. No component exists until it is registered, so a bundler drops every factory that was never imported. `React` is injected (not imported) to prevent two-copy hook errors. `Device` is `js-rnw-helper-device`. `Themer` is the `helper-themer` engine; the host calls `Themer.buildTheme(...)` and passes the result as `built`.

To register the whole roster, import the barrel:

```javascript
import { createSystem } from 'rnw-components';
import { COMPONENTS, VARIANTS, FREEFORMS, PROVIDERS } from 'rnw-components/all';

const system = createSystem(shared_libs, {}, built, 'sm');

system.addComponents(COMPONENTS);
system.addVariants(VARIANTS);
system.addFreeforms(FREEFORMS);
system.addProviders(PROVIDERS);
```

Importing the barrel pulls in every component. A consumer that wants a subset imports components by name from the package root instead.

## Peer Dependencies

| Package | Range |
|---|---|
| `react` | `>=18` |
| `react-native` | `>=0.74` |
| `helper-utils` | `^1.0.0` |
| `helper-debug` | `^1.0.0` |
| `helper-themer` | `^1.0.0` |
| `helper-device` | `^1.0.0` |

`react-native` is a direct peer (imported normally for View, Text, Pressable, etc.). `react` is injected via `shared_libs.React` to prevent two-copy hook errors.

## CONFIG

| Key | Type | Default | Constraint |
|---|---|---|---|
| `DEFAULT_TYPE_SET` | String | `'body01'` | non-empty string |
| `DEFAULT_FONT_COLOR` | String | `'text_primary'` | non-empty string |
| `DEFAULT_FONT_FAMILY` | String | `'sans'` | non-empty string |
| `MIN_HIT_TARGET` | Number | `44` | positive number |
| `BREAKPOINT_ORDER` | Array | `['sm','md','lg','xlg','max']` | non-empty array of strings |
| `STRICT_TOKENS` | Boolean | `false` | throw on unknown utility lookup |

Validated at load. Bad config throws immediately.

## Signatures

Module exports:

```javascript
createSystem(shared_libs, config, built, breakpoint?) -> system
TOKENS                        -> { fontColor, fontWeight, fontFamily, typeSet, radius, spacing, borderWidth, background }  // frozen
[ComponentName]               -> component factory   // 245 named exports
```

Subpath `rnw-components/all` exports:

```javascript
COMPONENTS  -> { [name]: factory }   // 235 flat
VARIANTS    -> { [name]: factory }   // 1
FREEFORMS   -> { [name]: factory }   // 1
PROVIDERS   -> { [name]: factory }   // 8
```

System surface:

```javascript
system.addComponents(factory_map)  -> Component          // registers at Component.[name]
system.addVariants(factory_map)    -> Component.variant  // registers at Component.variant.[name]
system.addFreeforms(factory_map)   -> Component.freeform // registers at Component.freeform.[name]
system.addProviders(factory_map)   -> Component.provider // registers at Component.provider.[name]
system.checkRegistry()             -> { complete, missing }
system.useBreakpoint(theme)        -> string             // React hook
system.make(factory)               -> component          // instantiate without registering
system.Component                   -> the shared registry
system.Style                       -> { utilities, tokens, breakpoint, allBreakpoints }
system.Parts                       -> the 12 mechanism parts
system.Lib | system.CONFIG | system.ERRORS | system.breakpoint
```

`built` is the result of `Themer.buildTheme(...)`; it carries a flat `.tokens` map of dotted
token names (`color.interactive`, `spacing.spacing_05`, `type.body01`, etc.). `createSystem`
reshapes it internally into `system.Style.tokens` groups. **The built theme must carry all 38
required color tokens**; `createSystem` throws a `TypeError` naming every absent one. The library
holds no color of its own, so a missing token has no value to fall back to:

```
interactive  text_primary  text_secondary  text_disabled  text_on_color  text_helper
background  layer_01  layer_02  border_subtle_01  border_interactive
support_success  support_error  support_warning  support_info
button_primary  button_primary_hover  button_primary_active
button_secondary  button_secondary_hover  button_secondary_active
button_tertiary  button_tertiary_hover  button_tertiary_active
button_danger_primary  button_danger_hover  button_danger_active
button_danger_secondary  button_disabled  button_separator
focus  icon_primary  icon_secondary  icon_on_color  icon_disabled
overlay  shadow  skeleton_background
```

Extra tokens beyond the required set are allowed and ignored. The full contract is published by `Themer.getContract()`.

Re-theming builds a new system. A system is never mutated in place.

## Token Contract

A component system requires its tokens from the Superloom token contract and declares the subset it requires and the subset it supports as exported data. `createSystem` calls `Themer.validateContract` with both lists: missing required tokens are one `TypeError` naming them all; unsupported provided tokens are one warning naming them all. No component source contains a color literal, reads a token by a name outside the contract, or falls back from one token to another; CI gates G24, G27, G28, and G29 enforce this. A hardcoded fallback would make an incomplete theme look complete while substituting the library's own design decisions; the correct behavior is to refuse to build so the theme author sees the gap.

Signature `createSystem(shared_libs, config, built, breakpoint)`; `shared_libs.Themer` required; `built` is `Themer.buildTheme(...)` output; breakpoints `sm md lg xlg max` from `breakpoint.*`; utility families: `background_<name>`, `font_<name>`, `border_color_<name>`, `br_radius_<name>`, `border_w_<side>_width_<name>`, `p_<dir>_spacing_<name>`, `m_<dir>_spacing_<name>`, `type_<name>`, `flex_<name>`, `align_<name>`, `justify_<name>`, `focus_ring`; prop vocabulary: `kind` (`primary` `secondary` `tertiary` `danger` `ghost`), `size` (`sm` `md` `lg`), `color` (font color token), `background` (background color token), `radius` (radius token), `spacing` (spacing token); required and supported lists in `data/token-contract.js`.

## Component Registry

<!-- BEGIN GENERATED: component-list -->
| Component | Role | Platform |
|---|---|---|
| `AILabel` | composite | both |
| `AILabelActions` | molecule | both |
| `AILabelContent` | molecule | both |
| `AISkeletonIcon` | molecule | both |
| `AISkeletonPlaceholder` | molecule | both |
| `AISkeletonText` | molecule | both |
| `AcceptTerms` | composite | both |
| `Accordion` | composite | both |
| `AccordionItem` | molecule | both |
| `ActionSheet` | composite | split |
| `ActionableNotification` | molecule | both |
| `AspectRatio` | atom | both |
| `BadgeIndicator` | atom | both |
| `BottomNavigationBar` | molecule | both |
| `BottomSafeAreaColorOverride` | molecule | native-primary |
| `BottomToolbar` | molecule | both |
| `BottomToolbarPrimaryAction` | molecule | both |
| `Breadcrumb` | composite | both |
| `BreadcrumbItem` | molecule | both |
| `Button` | atom | both |
| `ButtonSet` | molecule | both |
| `Callout` | molecule | both |
| `Checkbox` | atom | both |
| `CheckboxGroup` | composite | both |
| `ClickableTile` | molecule | both |
| `CodeSnippet` | molecule | split |
| `Column` | molecule | both |
| `ColumnHang` | molecule | both |
| `ComboBox` | composite | both |
| `ComboButton` | composite | both |
| `ComposedModal` | composite | both |
| `ContainedList` | molecule | both |
| `ContainedListItem` | molecule | both |
| `Content` | molecule | both |
| `ContentSwitcher` | composite | both |
| `ControlledPasswordInput` | molecule | both |
| `Copy` | molecule | both |
| `CopyButton` | molecule | split |
| `DataTable` | molecule | both |
| `DataTableCell` | molecule | both |
| `DataTableHeader` | molecule | both |
| `DataTableHeaderSelected` | molecule | both |
| `DataTableRow` | composite | both |
| `DateInput` | composite | both |
| `DatePicker` | composite | both |
| `DatePickerInput` | molecule | both |
| `DefinitionTooltip` | molecule | both |
| `DismissibleTag` | molecule | both |
| `DocumentViewer` | molecule | split |
| `Dropdown` | molecule | both |
| `ErrorBoundary` | provider | both |
| `ErrorBoundaryContext` | molecule | both |
| `ErrorState` | molecule | both |
| `ExpandableSearch` | molecule | both |
| `ExpandableTile` | molecule | both |
| `FeatureFlags` | provider | both |
| `FileUploader` | composite | split |
| `FileUploaderButton` | molecule | split |
| `FileUploaderDropContainer` | molecule | split |
| `FileUploaderItem` | molecule | split |
| `Filename` | molecule | both |
| `FilterableMultiSelect` | composite | both |
| `FlexGrid` | molecule | both |
| `FluidForm` | provider | both |
| `Form` | molecule | both |
| `FormContext` | molecule | both |
| `FormGroup` | composite | both |
| `FormItem` | molecule | both |
| `FormLabel` | molecule | both |
| `GlobalTheme` | molecule | both |
| `GrantPermission` | molecule | native-primary |
| `Grid` | molecule | both |
| `GridSettings` | molecule | both |
| `HStack` | molecule | both |
| `Header` | composite | both |
| `HeaderContainer` | molecule | both |
| `HeaderGlobalAction` | molecule | both |
| `HeaderGlobalBar` | molecule | both |
| `HeaderMenu` | molecule | both |
| `HeaderMenuButton` | molecule | both |
| `HeaderMenuItem` | molecule | both |
| `HeaderName` | molecule | both |
| `HeaderNavigation` | molecule | both |
| `HeaderPanel` | molecule | both |
| `HeaderSideNavItems` | molecule | both |
| `Heading` | atom | both |
| `Icon` | atom | both |
| `IconButton` | molecule | both |
| `IconIndicator` | atom | both |
| `IconSwitch` | molecule | both |
| `IconTab` | molecule | both |
| `IdPrefix` | provider | both |
| `Image` | atom | both |
| `InlineLink` | atom | both |
| `InlineLoading` | molecule | both |
| `InlineNotification` | molecule | both |
| `LandingView` | molecule | both |
| `Layer` | provider | both |
| `Link` | atom | both |
| `List` | molecule | both |
| `ListItem` | molecule | both |
| `LiveRegionProvider` | provider | both |
| `Loading` | atom | both |
| `Menu` | composite | both |
| `MenuButton` | composite | both |
| `MenuItem` | molecule | both |
| `MenuItemDivider` | molecule | both |
| `MenuItemGroup` | molecule | both |
| `MenuItemRadioGroup` | composite | both |
| `MenuItemSelectable` | molecule | both |
| `Modal` | molecule | both |
| `ModalBody` | molecule | both |
| `ModalFooter` | molecule | both |
| `ModalHeader` | molecule | both |
| `MultiSelect` | composite | both |
| `NavigationList` | molecule | both |
| `NavigationListItem` | molecule | both |
| `Notification` | molecule | both |
| `NotificationActionButton` | molecule | both |
| `NotificationButton` | molecule | both |
| `NumberInput` | molecule | both |
| `OperationalTag` | molecule | both |
| `OrderedList` | molecule | both |
| `OverflowMenu` | composite | both |
| `OverflowMenuItem` | molecule | both |
| `Overlay` | provider | split |
| `Pagination` | composite | both |
| `PaginationNav` | molecule | both |
| `PasswordInput` | molecule | both |
| `Popover` | molecule | both |
| `PopoverContent` | molecule | both |
| `PrefixContext` | molecule | both |
| `ProgressBar` | atom | both |
| `ProgressIndicator` | composite | both |
| `ProgressStep` | molecule | both |
| `RadioButton` | atom | both |
| `RadioButtonGroup` | composite | both |
| `RadioTile` | molecule | both |
| `Row` | molecule | both |
| `SafeAreaWrapper` | molecule | native-primary |
| `Search` | molecule | both |
| `Section` | molecule | both |
| `Select` | composite | both |
| `SelectItem` | molecule | both |
| `SelectItemGroup` | molecule | both |
| `SelectableTag` | molecule | both |
| `SelectableTile` | molecule | both |
| `ShapeIndicator` | atom | both |
| `SideNav` | molecule | both |
| `SideNavDetails` | molecule | both |
| `SideNavDivider` | molecule | both |
| `SideNavFooter` | molecule | both |
| `SideNavHeader` | molecule | both |
| `SideNavIcon` | molecule | both |
| `SideNavItem` | molecule | both |
| `SideNavItems` | molecule | both |
| `SideNavLink` | molecule | both |
| `SideNavLinkText` | molecule | both |
| `SideNavMenu` | molecule | both |
| `SideNavMenuItem` | molecule | both |
| `SideNavSwitcher` | molecule | both |
| `SidePanel` | composite | both |
| `Skeleton` | atom | both |
| `SkeletonIcon` | molecule | both |
| `SkeletonPlaceholder` | molecule | both |
| `SkeletonText` | molecule | both |
| `SkipToContent` | molecule | web-primary |
| `Slider` | atom | both |
| `Stack` | molecule | both |
| `StaticNotification` | molecule | both |
| `StructuredListBody` | molecule | both |
| `StructuredListCell` | molecule | both |
| `StructuredListHead` | molecule | both |
| `StructuredListInput` | molecule | both |
| `StructuredListRow` | molecule | both |
| `StructuredListWrapper` | molecule | both |
| `Switch` | molecule | both |
| `Switcher` | molecule | both |
| `SwitcherDivider` | molecule | both |
| `SwitcherItem` | molecule | both |
| `Tab` | molecule | both |
| `TabContent` | molecule | both |
| `TabList` | molecule | both |
| `TabListVertical` | molecule | both |
| `TabPanel` | molecule | both |
| `TabPanels` | molecule | both |
| `Table` | molecule | both |
| `TableActionList` | molecule | both |
| `TableBatchAction` | molecule | both |
| `TableBatchActions` | molecule | both |
| `TableBody` | molecule | both |
| `TableCell` | molecule | both |
| `TableContainer` | molecule | both |
| `TableDecoratorRow` | molecule | both |
| `TableExpandHeader` | molecule | both |
| `TableExpandRow` | molecule | both |
| `TableExpandedRow` | molecule | both |
| `TableHead` | molecule | both |
| `TableHeader` | molecule | both |
| `TableRow` | molecule | both |
| `TableSelectAll` | molecule | both |
| `TableSelectRow` | molecule | both |
| `TableSlugRow` | molecule | both |
| `TableToolbar` | molecule | both |
| `TableToolbarAction` | molecule | both |
| `TableToolbarContent` | molecule | both |
| `TableToolbarMenu` | molecule | both |
| `TableToolbarSearch` | molecule | both |
| `Tabs` | composite | both |
| `TabsVertical` | composite | both |
| `Tag` | atom | both |
| `Text` | atom | both |
| `TextArea` | atom | both |
| `TextInput` | atom | both |
| `Theme` | provider | both |
| `ThemeContext` | molecule | both |
| `Tile` | molecule | both |
| `TileAboveTheFoldContent` | molecule | both |
| `TileBelowTheFoldContent` | molecule | both |
| `TileGroup` | molecule | both |
| `TimePicker` | composite | both |
| `TimePickerSelect` | molecule | both |
| `ToastNotification` | molecule | both |
| `Toggle` | atom | both |
| `Toggletip` | molecule | both |
| `ToggletipActions` | molecule | both |
| `ToggletipButton` | molecule | both |
| `ToggletipContent` | molecule | both |
| `ToggletipLabel` | composite | both |
| `Tooltip` | molecule | both |
| `TopNavigationBar` | molecule | both |
| `TopNavigationBarLogin` | molecule | both |
| `TreeNode` | molecule | both |
| `TreeView` | composite | both |
| `TruncatedText` | molecule | both |
| `UiPanel` | molecule | both |
| `UiPanelItem` | molecule | both |
| `UnorderedList` | molecule | both |
| `UserAvatar` | molecule | both |
| `VStack` | molecule | both |
| `View` | atom | both |
| `ViewWrapper` | molecule | native-primary |
| `WebHeader` | molecule | both |
<!-- END GENERATED: component-list -->

| Variants | `variant.ButtonPrimaryOutlined` |
| Freeform | `freeform.RawBox` |
| Providers (8) | `provider.Overlay`, `provider.LiveRegionProvider`, `provider.Layer`, `provider.Theme`, `provider.FeatureFlags`, `provider.IdPrefix`, `provider.FluidForm`, `provider.ErrorBoundary` |

## Component Shapes

| Shape | Marker | Focus Management |
|---|---|---|
| S1 Presentational | No interaction state | None |
| S2 Interactive | Pressable with state | None |
| S3 Overlay | Modal/Dropdown with focus trap | `useFocusTrap` hook: trap (boolean), restore, Escape/back, outside-press. `aria-modal` on the overlay container |

## Failure Model

**Boot-time misconfiguration throws `TypeError`.** Theme validation, config validation, and injection validation all throw at construction time.

**Render-time prop errors warn and fall back deterministically.** Unknown token props trigger `Lib.Debug.warn` and fall back to the default token. No render-time throw.

Message format: `rnw-components: <field> <expected-shape>`

## Mechanisms

Eight shared mechanisms in `component/`, used across all components:

| Mechanism | File | Purpose |
|---|---|---|
| M1 a11y | `a11y.js` | Translates semantic state to `aria-*` props. Only module allowed to emit accessibility state props |
| M2 usePressKeys | `usePressKeys.js` | Enter/Space activation per role. Fixes RNW Space no-op for non-button roles |
| M3 useRovingTabIndex | `useRovingTabIndex.js` | Roving tab index for composite widgets (Tabs, Menu, etc.) |
| M4 OverlayHost | `OverlayHost.js` | Overlay stacking provider with z-index management |
| M5 useAnchoredPosition | `useAnchoredPosition.js` | Position calculation for anchored overlays (Popover, Menu, etc.) |
| M6 LiveRegionProvider | `LiveRegionProvider.js` | Screen reader announcements via `aria-live` regions |
| M7 createCompoundContext | `createCompoundContext.js` | Context factory for compound components. Throws outside Provider |
| M8 useControllableState | `useControllableState.js` | Controlled/uncontrolled state hook for form components |

## Naming Rule

| Surface | Case |
|---|---|
| Contract token names | `lowercase_with_underscores` (`color.interactive`, `spacing.spacing_05`) |
| Utility class names | `lowercase_with_underscores` (`type_body01`, `background_interactive`) |
| Component prop tokens | `lowercase` (`typeSet: 'body01'`, `color: 'text_primary'`) |
| Breakpoint keys | `lowercase` (`sm`, `md`, `lg`, `xlg`, `max`) |

## Testing

```bash
cd _test && npm install && npm test
```

Pure Node. No container, no emulator, no network. Uses `react-test-renderer` with a stub `react-native` module (intercepted via `Module._resolveFilename`).

## Gotchas

- **React must be injected, not imported.** Two copies of React break hooks; the library closes over `Lib.React` everywhere
- **`react-native` is imported directly.** Unlike `react`, RN is a single-instance peer with no hook contract
- **Freeform components receive `Lib` but NOT `Style` or `Registry`.** They cannot read tokens or compose atoms
- **`useBreakpoint` is a hook.** It must be called inside a React component; it uses `useState` and `useEffect`
- **Re-theming builds a new system.** Call `createSystem` again and re-register; callers swap the reference
- **A provider factory takes arguments positionally** from `addProviders`, in the order `Lib, CONFIG, ERRORS, Parts, Registry, Style`. A provider may declare a shorter list, but it must be a **prefix** of that order. Gate G22 enforces this
- **`checkRegistry` reports missing siblings.** A component that renders a sibling reads it from the registry at render time, so call this after registering and fail at boot instead of at render
- **`Themer` is a required injection.** `shared_libs.Themer` must be the `helper-themer` engine; `createSystem` calls `Themer.getContract()` for validation and the host calls `Themer.buildTheme(...)` to produce the `built` argument
- **Breakpoints live in the contract.** The Themer contract owns `breakpoint.sm` through `breakpoint.max`; they are layout boundaries, not design tokens. The default breakpoint is `'sm'`
