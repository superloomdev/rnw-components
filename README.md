# rnw-components

The standard Superloom component system for React Native Web. Component anatomy and behavior follow the IBM Carbon Design System v11; every color, size, font, and structure knob is a token of the Superloom token contract.

## Overview

This module provides a themed component registry for React Native Web applications. It consumes a built theme from the Superloom Themer engine and produces a set of atoms, molecules, variants, and freeform components that all drive their visuals from tokens. The library ships no color of its own: a theme supplies all 38 required color tokens or
`createSystem` refuses to build, naming every absent one. That keeps the component set free
of any single design language - the same components render IBM Carbon or anything else,
depending entirely on the theme handed in.

`createSystem` is the only entry point: it builds the themed infrastructure without instantiating any component, and the caller registers the components it needs. A consumer using five components ships five factories, not all 245. Re-theming at runtime builds a new system; a system is never mutated in place.

## Installation

```bash
npm install @superloomdev/rnw-components
```

Peer dependencies: `react`, `react-native`, `helper-utils`, `helper-debug`, `helper-themer`, `helper-device`. The Themer engine is injected via `shared_libs.Themer`; the host calls `Themer.buildTheme(...)` and passes the result to `createSystem`.

## Quick Start

```javascript
import { createSystem, View, Text, Button } from '@superloomdev/rnw-components';
import Themer from 'helper-themer';
import Utils from 'helper-utils';
import Debug from 'helper-debug';
import Device from 'helper-device';

// Build the theme through the Themer engine
const built = Themer.buildTheme(template, layers, 'native');

// Build the system, then register only the components this screen uses
const system = createSystem({
  Utils: Utils,
  Debug: Debug,
  React: React,
  Device: Device,
  Themer: Themer,
  Icons: Icons
}, {}, built, 'sm');

system.addComponents({ View, Text, Button });

const Component = system.Component;
const Style = system.Style;

// Use components
const MyScreen = function () {
  return React.createElement(Component.View, { background: 'background', p_a_spacing_05: true },
    React.createElement(Component.Text, { typeSet: 'heading03', weight: 'bold' }, 'Hello'),
    React.createElement(Component.Button, {
      kind: 'primary',
      onPress: function () { /* ... */ }
    }, React.createElement(Component.Text, { color: 'text_on_color' }, 'Submit'))
  );
};
```

## Component Roster

<!-- BEGIN GENERATED: count-summary -->
- **Total components:** 243
- **Both web and native:** 229 (94%)
- **Split (platform-specific):** 9
- **Web primary:** 1
- **Native primary:** 4
- **Excluded (cannot exist in RN):** 0
- **Providers:** 8
- **Flat components:** 235
<!-- END GENERATED: count-summary -->

<!-- BEGIN GENERATED: component-table -->
| Component | Tier | Platform | Source |
|---|---|---|---|
| `AILabel` | composite | Both web and native | non-carbon |
| `AILabelActions` | molecule | Both web and native | non-carbon |
| `AILabelContent` | molecule | Both web and native | non-carbon |
| `AISkeletonIcon` | molecule | Both web and native | non-carbon |
| `AISkeletonPlaceholder` | molecule | Both web and native | non-carbon |
| `AISkeletonText` | molecule | Both web and native | non-carbon |
| `AcceptTerms` | composite | Both web and native | non-carbon |
| `Accordion` | composite | Both web and native | non-carbon |
| `AccordionItem` | molecule | Both web and native | non-carbon |
| `ActionSheet` | composite | Split (web and native differ) | non-carbon |
| `ActionableNotification` | molecule | Both web and native | non-carbon |
| `AspectRatio` | atom | Both web and native | non-carbon |
| `BadgeIndicator` | atom | Both web and native | unexported |
| `BottomNavigationBar` | molecule | Both web and native | non-carbon |
| `BottomSafeAreaColorOverride` | molecule | Native primary (degrades on web) | non-carbon |
| `BottomToolbar` | molecule | Both web and native | non-carbon |
| `BottomToolbarPrimaryAction` | molecule | Both web and native | non-carbon |
| `Breadcrumb` | composite | Both web and native | non-carbon |
| `BreadcrumbItem` | molecule | Both web and native | non-carbon |
| `Button` | atom | Both web and native | non-carbon |
| `ButtonSet` | molecule | Both web and native | non-carbon |
| `Callout` | molecule | Both web and native | non-carbon |
| `Checkbox` | atom | Both web and native | non-carbon |
| `CheckboxGroup` | composite | Both web and native | non-carbon |
| `ClickableTile` | molecule | Both web and native | non-carbon |
| `CodeSnippet` | molecule | Split (web and native differ) | non-carbon |
| `Column` | molecule | Both web and native | non-carbon |
| `ColumnHang` | molecule | Both web and native | non-carbon |
| `ComboBox` | composite | Both web and native | non-carbon |
| `ComboButton` | composite | Both web and native | non-carbon |
| `ComposedModal` | composite | Both web and native | non-carbon |
| `ContainedList` | molecule | Both web and native | non-carbon |
| `ContainedListItem` | molecule | Both web and native | non-carbon |
| `Content` | molecule | Both web and native | non-carbon |
| `ContentSwitcher` | composite | Both web and native | non-carbon |
| `ControlledPasswordInput` | molecule | Both web and native | non-carbon |
| `Copy` | molecule | Both web and native | non-carbon |
| `CopyButton` | molecule | Split (web and native differ) | non-carbon |
| `DataTable` | molecule | Both web and native | non-carbon |
| `DataTableCell` | molecule | Both web and native | non-carbon |
| `DataTableHeader` | molecule | Both web and native | non-carbon |
| `DataTableHeaderSelected` | molecule | Both web and native | non-carbon |
| `DataTableRow` | composite | Both web and native | non-carbon |
| `DateInput` | composite | Both web and native | non-carbon |
| `DatePicker` | composite | Both web and native | non-carbon |
| `DatePickerInput` | molecule | Both web and native | non-carbon |
| `DefinitionTooltip` | molecule | Both web and native | non-carbon |
| `DismissibleTag` | molecule | Both web and native | non-carbon |
| `DocumentViewer` | molecule | Split (web and native differ) | non-carbon |
| `Dropdown` | molecule | Both web and native | non-carbon |
| `ErrorBoundary` | provider | Both web and native | non-carbon |
| `ErrorBoundaryContext` | molecule | Both web and native | non-carbon |
| `ErrorState` | molecule | Both web and native | non-carbon |
| `ExpandableSearch` | molecule | Both web and native | non-carbon |
| `ExpandableTile` | molecule | Both web and native | non-carbon |
| `FeatureFlags` | provider | Both web and native | unexported |
| `FileUploader` | composite | Split (web and native differ) | non-carbon |
| `FileUploaderButton` | molecule | Split (web and native differ) | non-carbon |
| `FileUploaderDropContainer` | molecule | Split (web and native differ) | non-carbon |
| `FileUploaderItem` | molecule | Split (web and native differ) | non-carbon |
| `Filename` | molecule | Both web and native | non-carbon |
| `FilterableMultiSelect` | composite | Both web and native | non-carbon |
| `FlexGrid` | molecule | Both web and native | non-carbon |
| `FluidForm` | provider | Both web and native | non-carbon |
| `Form` | molecule | Both web and native | non-carbon |
| `FormContext` | molecule | Both web and native | non-carbon |
| `FormGroup` | composite | Both web and native | non-carbon |
| `FormItem` | molecule | Both web and native | non-carbon |
| `FormLabel` | molecule | Both web and native | non-carbon |
| `GlobalTheme` | molecule | Both web and native | non-carbon |
| `GrantPermission` | molecule | Native primary (degrades on web) | non-carbon |
| `Grid` | molecule | Both web and native | non-carbon |
| `GridSettings` | molecule | Both web and native | non-carbon |
| `HStack` | molecule | Both web and native | non-carbon |
| `Header` | composite | Both web and native | non-carbon |
| `HeaderContainer` | molecule | Both web and native | non-carbon |
| `HeaderGlobalAction` | molecule | Both web and native | non-carbon |
| `HeaderGlobalBar` | molecule | Both web and native | non-carbon |
| `HeaderMenu` | molecule | Both web and native | non-carbon |
| `HeaderMenuButton` | molecule | Both web and native | non-carbon |
| `HeaderMenuItem` | molecule | Both web and native | non-carbon |
| `HeaderName` | molecule | Both web and native | non-carbon |
| `HeaderNavigation` | molecule | Both web and native | non-carbon |
| `HeaderPanel` | molecule | Both web and native | non-carbon |
| `HeaderSideNavItems` | molecule | Both web and native | non-carbon |
| `Heading` | atom | Both web and native | non-carbon |
| `Icon` | atom | Both web and native | substrate |
| `IconButton` | molecule | Both web and native | non-carbon |
| `IconIndicator` | atom | Both web and native | unexported |
| `IconSwitch` | molecule | Both web and native | non-carbon |
| `IconTab` | molecule | Both web and native | non-carbon |
| `IdPrefix` | provider | Both web and native | non-carbon |
| `Image` | atom | Both web and native | substrate |
| `InlineLink` | atom | Both web and native | non-carbon |
| `InlineLoading` | molecule | Both web and native | non-carbon |
| `InlineNotification` | molecule | Both web and native | non-carbon |
| `LandingView` | molecule | Both web and native | non-carbon |
| `Layer` | provider | Both web and native | non-carbon |
| `Link` | atom | Both web and native | non-carbon |
| `List` | molecule | Both web and native | non-carbon |
| `ListItem` | molecule | Both web and native | non-carbon |
| `LiveRegionProvider` | provider | Both web and native | infrastructure |
| `Loading` | atom | Both web and native | non-carbon |
| `Menu` | composite | Both web and native | non-carbon |
| `MenuButton` | composite | Both web and native | non-carbon |
| `MenuItem` | molecule | Both web and native | non-carbon |
| `MenuItemDivider` | molecule | Both web and native | non-carbon |
| `MenuItemGroup` | molecule | Both web and native | non-carbon |
| `MenuItemRadioGroup` | composite | Both web and native | non-carbon |
| `MenuItemSelectable` | molecule | Both web and native | non-carbon |
| `Modal` | molecule | Both web and native | non-carbon |
| `ModalBody` | molecule | Both web and native | non-carbon |
| `ModalFooter` | molecule | Both web and native | non-carbon |
| `ModalHeader` | molecule | Both web and native | non-carbon |
| `MultiSelect` | composite | Both web and native | non-carbon |
| `NavigationList` | molecule | Both web and native | non-carbon |
| `NavigationListItem` | molecule | Both web and native | non-carbon |
| `Notification` | molecule | Both web and native | non-carbon |
| `NotificationActionButton` | molecule | Both web and native | non-carbon |
| `NotificationButton` | molecule | Both web and native | non-carbon |
| `NumberInput` | molecule | Both web and native | non-carbon |
| `OperationalTag` | molecule | Both web and native | non-carbon |
| `OrderedList` | molecule | Both web and native | non-carbon |
| `OverflowMenu` | composite | Both web and native | non-carbon |
| `OverflowMenuItem` | molecule | Both web and native | non-carbon |
| `Overlay` | provider | Split (web and native differ) | non-carbon |
| `Pagination` | composite | Both web and native | non-carbon |
| `PaginationNav` | molecule | Both web and native | non-carbon |
| `PasswordInput` | molecule | Both web and native | non-carbon |
| `Popover` | molecule | Both web and native | non-carbon |
| `PopoverContent` | molecule | Both web and native | non-carbon |
| `PrefixContext` | molecule | Both web and native | non-carbon |
| `ProgressBar` | atom | Both web and native | non-carbon |
| `ProgressIndicator` | composite | Both web and native | non-carbon |
| `ProgressStep` | molecule | Both web and native | non-carbon |
| `RadioButton` | atom | Both web and native | non-carbon |
| `RadioButtonGroup` | composite | Both web and native | non-carbon |
| `RadioTile` | molecule | Both web and native | non-carbon |
| `Row` | molecule | Both web and native | non-carbon |
| `SafeAreaWrapper` | molecule | Native primary (degrades on web) | non-carbon |
| `Search` | molecule | Both web and native | non-carbon |
| `Section` | molecule | Both web and native | non-carbon |
| `Select` | composite | Both web and native | non-carbon |
| `SelectItem` | molecule | Both web and native | non-carbon |
| `SelectItemGroup` | molecule | Both web and native | non-carbon |
| `SelectableTag` | molecule | Both web and native | non-carbon |
| `SelectableTile` | molecule | Both web and native | non-carbon |
| `ShapeIndicator` | atom | Both web and native | unexported |
| `SideNav` | molecule | Both web and native | non-carbon |
| `SideNavDetails` | molecule | Both web and native | non-carbon |
| `SideNavDivider` | molecule | Both web and native | non-carbon |
| `SideNavFooter` | molecule | Both web and native | non-carbon |
| `SideNavHeader` | molecule | Both web and native | non-carbon |
| `SideNavIcon` | molecule | Both web and native | non-carbon |
| `SideNavItem` | molecule | Both web and native | non-carbon |
| `SideNavItems` | molecule | Both web and native | non-carbon |
| `SideNavLink` | molecule | Both web and native | non-carbon |
| `SideNavLinkText` | molecule | Both web and native | non-carbon |
| `SideNavMenu` | molecule | Both web and native | non-carbon |
| `SideNavMenuItem` | molecule | Both web and native | non-carbon |
| `SideNavSwitcher` | molecule | Both web and native | non-carbon |
| `SidePanel` | composite | Both web and native | unexported |
| `Skeleton` | atom | Both web and native | collapse |
| `SkeletonIcon` | molecule | Both web and native | non-carbon |
| `SkeletonPlaceholder` | molecule | Both web and native | non-carbon |
| `SkeletonText` | molecule | Both web and native | non-carbon |
| `SkipToContent` | molecule | Web primary (null on native) | non-carbon |
| `Slider` | atom | Both web and native | non-carbon |
| `Stack` | molecule | Both web and native | non-carbon |
| `StaticNotification` | molecule | Both web and native | non-carbon |
| `StructuredListBody` | molecule | Both web and native | non-carbon |
| `StructuredListCell` | molecule | Both web and native | non-carbon |
| `StructuredListHead` | molecule | Both web and native | non-carbon |
| `StructuredListInput` | molecule | Both web and native | non-carbon |
| `StructuredListRow` | molecule | Both web and native | non-carbon |
| `StructuredListWrapper` | molecule | Both web and native | non-carbon |
| `Switch` | molecule | Both web and native | non-carbon |
| `Switcher` | molecule | Both web and native | non-carbon |
| `SwitcherDivider` | molecule | Both web and native | non-carbon |
| `SwitcherItem` | molecule | Both web and native | non-carbon |
| `Tab` | molecule | Both web and native | non-carbon |
| `TabContent` | molecule | Both web and native | non-carbon |
| `TabList` | molecule | Both web and native | non-carbon |
| `TabListVertical` | molecule | Both web and native | non-carbon |
| `TabPanel` | molecule | Both web and native | non-carbon |
| `TabPanels` | molecule | Both web and native | non-carbon |
| `Table` | molecule | Both web and native | non-carbon |
| `TableActionList` | molecule | Both web and native | non-carbon |
| `TableBatchAction` | molecule | Both web and native | non-carbon |
| `TableBatchActions` | molecule | Both web and native | non-carbon |
| `TableBody` | molecule | Both web and native | non-carbon |
| `TableCell` | molecule | Both web and native | non-carbon |
| `TableContainer` | molecule | Both web and native | non-carbon |
| `TableDecoratorRow` | molecule | Both web and native | non-carbon |
| `TableExpandHeader` | molecule | Both web and native | non-carbon |
| `TableExpandRow` | molecule | Both web and native | non-carbon |
| `TableExpandedRow` | molecule | Both web and native | non-carbon |
| `TableHead` | molecule | Both web and native | non-carbon |
| `TableHeader` | molecule | Both web and native | non-carbon |
| `TableRow` | molecule | Both web and native | non-carbon |
| `TableSelectAll` | molecule | Both web and native | non-carbon |
| `TableSelectRow` | molecule | Both web and native | non-carbon |
| `TableSlugRow` | molecule | Both web and native | non-carbon |
| `TableToolbar` | molecule | Both web and native | non-carbon |
| `TableToolbarAction` | molecule | Both web and native | non-carbon |
| `TableToolbarContent` | molecule | Both web and native | non-carbon |
| `TableToolbarMenu` | molecule | Both web and native | non-carbon |
| `TableToolbarSearch` | molecule | Both web and native | non-carbon |
| `Tabs` | composite | Both web and native | non-carbon |
| `TabsVertical` | composite | Both web and native | non-carbon |
| `Tag` | atom | Both web and native | non-carbon |
| `Text` | atom | Both web and native | non-carbon |
| `TextArea` | atom | Both web and native | non-carbon |
| `TextInput` | atom | Both web and native | non-carbon |
| `Theme` | provider | Both web and native | non-carbon |
| `ThemeContext` | molecule | Both web and native | non-carbon |
| `Tile` | molecule | Both web and native | non-carbon |
| `TileAboveTheFoldContent` | molecule | Both web and native | non-carbon |
| `TileBelowTheFoldContent` | molecule | Both web and native | non-carbon |
| `TileGroup` | molecule | Both web and native | non-carbon |
| `TimePicker` | composite | Both web and native | non-carbon |
| `TimePickerSelect` | molecule | Both web and native | non-carbon |
| `ToastNotification` | molecule | Both web and native | non-carbon |
| `Toggle` | atom | Both web and native | non-carbon |
| `Toggletip` | molecule | Both web and native | non-carbon |
| `ToggletipActions` | molecule | Both web and native | non-carbon |
| `ToggletipButton` | molecule | Both web and native | non-carbon |
| `ToggletipContent` | molecule | Both web and native | non-carbon |
| `ToggletipLabel` | composite | Both web and native | non-carbon |
| `Tooltip` | molecule | Both web and native | non-carbon |
| `TopNavigationBar` | molecule | Both web and native | non-carbon |
| `TopNavigationBarLogin` | molecule | Both web and native | non-carbon |
| `TreeNode` | molecule | Both web and native | non-carbon |
| `TreeView` | composite | Both web and native | non-carbon |
| `TruncatedText` | molecule | Both web and native | unexported |
| `UiPanel` | molecule | Both web and native | non-carbon |
| `UiPanelItem` | molecule | Both web and native | non-carbon |
| `UnorderedList` | molecule | Both web and native | non-carbon |
| `UserAvatar` | molecule | Both web and native | unexported |
| `VStack` | molecule | Both web and native | non-carbon |
| `View` | atom | Both web and native | substrate |
| `ViewWrapper` | molecule | Native primary (degrades on web) | non-carbon |
| `WebHeader` | molecule | Both web and native | non-carbon |
<!-- END GENERATED: component-table -->

### Variants

| Variant | Description |
|---|---|
| `variant.ButtonPrimaryOutlined` | Primary button with outlined style |

### Freeform

| Freeform | Description |
|---|---|
| `freeform.RawBox` | Raw box with no token mapping |

### Providers (8)

| Provider | Description |
|---|---|
| `provider.Overlay` | Overlay layer stack for portals and modals |
| `provider.LiveRegionProvider` | Screen reader announcement regions; mount once at app root |
| `provider.Layer` | Elevation level context (0-2) for nested surface tokens |
| `provider.Theme` | Runtime theme override for subtrees |
| `provider.FeatureFlags` | Feature flag context for conditional rendering |
| `provider.IdPrefix` | ID prefix context for unique element id generation |
| `provider.FluidForm` | Marks a form as fluid (label inside field) |
| `provider.ErrorBoundary` | Catches render errors; class component (no hook equivalent) |

## Platform Support

See [docs/platform-support.md](docs/platform-support.md) for the full platform support document, including all 15 exceptions and the safe area explanation.

## Carbon Parity

See [docs/carbon-parity.md](docs/carbon-parity.md) for what we ship and what Carbon has that we deliberately do not.

## API

See [docs/api.md](docs/api.md) for full signatures and [docs/configuration.md](docs/configuration.md) for config keys.

## Testing

```bash
cd _test && npm install && npm test
```

Pure Node. No container, no emulator, no network.

## License

MIT
