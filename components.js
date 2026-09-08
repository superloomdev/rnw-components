// Info: Carbon-informed component library for the RNW pipeline.
//
// Class I standalone module. Atoms and molecules over the themer, with
// theme-driven responsiveness and a real accessibility contract. React
// is injected as Lib.React; react-native is a direct peer dependency
// and imported normally. Platform and viewport are treated differently:
// Platform is a constant read from react-native; viewport is a live
// subscription from the injected Lib.Device (js-rnw-helper-device).
//
// Provides: createSystem, buildThemeContract, TOKENS, and 245 named component
// factories.
//
// createSystem is the only entry point. It builds the shared infrastructure -
// validated container, mechanism parts, per-breakpoint utility styles, and an
// empty registry - without instantiating any component. The caller imports the
// component factories it needs and registers them, so a bundler drops every
// factory the caller never imported. Re-theming builds a new system; a system
// is never mutated in place.
//
// Compatibility: React Native Web (web, iOS, Android). Requires the RNW
// runtime. Node.js for testing with injected stubs.


// Imports
import DEFAULT_CONFIG from './components.config.js';
import ERRORS from './components.errors.js';
import createValidators from './components.validators.js';
import STYLE_CONTRACT from './data/style-contract.js';
import COMPONENT_DEPS from './data/component-deps.js';

// Parts
import partsA11y from './parts/a11y.js';
import partsPressKeys from './parts/press-keys.js';
import partsRovingTabIndex from './parts/roving-tab-index.js';
import partsControllableState from './parts/controllable-state.js';
import partsAnchoredPosition from './parts/anchored-position.js';
import partsFocusTrap from './parts/focus-trap.js';
import partsOverlay from './parts/overlay.js';
import partsCompoundContext from './parts/compound-context.js';
import partsUnits from './parts/units.js';
import partsTypeface from './parts/typeface.js';
import partsDirection from './parts/direction.js';
import partsFilter from './parts/filter.js';

// Utilities
import generateStyles from './component/commonStyles.js';


/////////////////////////// createSystem START /////////////////////////////////

/********************************************************************
Build a themed component system. This is the module's only entry
point.

The system carries the validated dependency container, the mechanism
parts, the per-breakpoint utility styles, and an empty registry. No
component is instantiated until the caller registers it, so a bundler
drops every factory the caller never imported.

Register through the four registrars, each matching one registry
namespace. Import the factories by name from this package, or import
the whole roster from '@superloomdev/rnw-components/all'.

Re-theming builds a new system; a system is never mutated in place.

@param {Object} shared_libs - Lib container; requires React, Utils,
                              Debug, Device; optional Icons, Font
@param {Object} config      - Overrides merged over defaults
@param {Object} theme       - Theme contract { Color, Dimension, Font, Breakpoint }
@param {String} breakpoint  - Active breakpoint key (default 'base')

@return {Object} - { addComponents, addVariants, addFreeforms, addProviders,
                     checkRegistry, useBreakpoint, make, Component, Style,
                     Parts, Lib, CONFIG, ERRORS, breakpoint }
*********************************************************************/
export function createSystem (shared_libs, config, theme, breakpoint) {

  // Build the validated Lib, CONFIG, and Validators set for this system
  const context = buildContext(shared_libs, config);

  // Build the mechanism parts, utility styles, registry, and make helper
  const infra = buildInfrastructure(
    context.Lib,
    context.CONFIG,
    ERRORS,
    context.Validators,
    theme,
    breakpoint
  );

  // Assert a registration map is an object of factories before using it
  const assertFactoryMap = function (factory_map, caller) {

    // Reject a missing or non-object argument as programmer error
    if (!context.Lib.Utils.isObject(factory_map)) {
      throw new TypeError(caller + ' requires an object of registry key to factory');
    }

    // Reject any entry that is not a factory function
    const names = Object.keys(factory_map);

    // Check every entry so a built component cannot be passed by mistake
    for (let i = 0; i < names.length; i++) {

      // A non-function entry means the caller passed something already built
      if (!context.Lib.Utils.isFunction(factory_map[names[i]])) {
        throw new TypeError(caller + ' entry "' + names[i] + '" is not a component factory');
      }

    }

    // Return the validated key list so the caller does not re-derive it
    return names;

  };

  // Return the system surface the caller registers components through
  return {

    make: infra.make,

    /********************************************************************
    Register flat components at Component.[name]. Keys become registry
    keys, so ES shorthand keeps names typo-proof: a misspelled name
    fails at import time, not at render time.

    @param {Object} factory_map - Registry key to component factory

    @return {Object} - The shared Component registry
    *********************************************************************/
    addComponents: function (factory_map) {

      // Validate the map and collect its registry keys
      const names = assertFactoryMap(factory_map, 'addComponents');

      // Instantiate and register each factory under its map key
      for (let i = 0; i < names.length; i++) {
        infra.Component[names[i]] = infra.make(factory_map[names[i]]);
      }

      // Return the registry so the caller can chain or destructure
      return infra.Component;

    },

    /********************************************************************
    Register structured exceptions at Component.variant.[name]. A
    variant is a preset of a canonical component and takes the same
    injection set.

    @param {Object} factory_map - Registry key to variant factory

    @return {Object} - The variant namespace
    *********************************************************************/
    addVariants: function (factory_map) {

      // Validate the map and collect its registry keys
      const names = assertFactoryMap(factory_map, 'addVariants');

      // Create the variant namespace on first use
      if (!context.Lib.Utils.isObject(infra.Component.variant)) {
        infra.Component.variant = {};
      }

      // Instantiate and register each variant under its map key
      for (let i = 0; i < names.length; i++) {
        infra.Component.variant[names[i]] = infra.make(factory_map[names[i]]);
      }

      // Return the namespace so the caller can chain or destructure
      return infra.Component.variant;

    },

    /********************************************************************
    Register unstructured exceptions at Component.freeform.[name].
    Freeform factories receive Lib only. They cannot read tokens or
    compose siblings, they take raw styles, and they do not re-theme.

    @param {Object} factory_map - Registry key to freeform factory

    @return {Object} - The freeform namespace
    *********************************************************************/
    addFreeforms: function (factory_map) {

      // Validate the map and collect its registry keys
      const names = assertFactoryMap(factory_map, 'addFreeforms');

      // Create the freeform namespace on first use
      if (!context.Lib.Utils.isObject(infra.Component.freeform)) {
        infra.Component.freeform = {};
      }

      // Instantiate each freeform with Lib alone - the deliberate narrow set
      for (let i = 0; i < names.length; i++) {
        infra.Component.freeform[names[i]] = factory_map[names[i]](context.Lib);
      }

      // Return the namespace so the caller can chain or destructure
      return infra.Component.freeform;

    },

    /********************************************************************
    Register context providers at Component.provider.[name]. A provider
    factory returns a module whose single component key equals its
    registry key, so the map key drives both the call and the slot.

    @param {Object} factory_map - Registry key to provider factory

    @return {Object} - The provider namespace
    *********************************************************************/
    addProviders: function (factory_map) {

      // Validate the map and collect its registry keys
      const names = assertFactoryMap(factory_map, 'addProviders');

      // Create the provider namespace on first use
      if (!context.Lib.Utils.isObject(infra.Component.provider)) {
        infra.Component.provider = {};
      }

      // Instantiate each provider against the canonical injection order
      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const provider_module = factory_map[name](
          context.Lib,
          context.CONFIG,
          ERRORS,
          infra.Parts,
          infra.Component,
          infra.Style
        );

        // A provider that does not expose its own name is not a provider
        if (!context.Lib.Utils.isFunction(provider_module[name])) {
          throw new TypeError('Provider factory did not return a "' + name + '" component');
        }

        infra.Component.provider[name] = provider_module[name];

      }

      // Return the namespace so the caller can chain or destructure
      return infra.Component.provider;

    },

    /********************************************************************
    Report which render-time dependencies are missing from the registry.
    A component that renders a sibling reads it from the shared registry
    at render time, so an unregistered sibling fails only when that
    branch renders. This surfaces the gap at boot instead.

    @return {Object} - { complete, missing } where missing maps a
                       registered component to its absent dependencies
    *********************************************************************/
    checkRegistry: function () {

      // Compare every registered component against the generated manifest
      const registered = Object.keys(infra.Component);
      const missing = {};

      // Walk each registered component and collect absent dependencies
      for (let i = 0; i < registered.length; i++) {
        const name = registered[i];
        const required = COMPONENT_DEPS[name];

        // Skip components that declare no render-time dependencies
        if (!required) {
          continue;
        }

        // Collect the dependencies that were never registered
        const absent = required.filter(function (dep) {
          return !infra.Component[dep];
        });

        // Record only components with at least one absent dependency
        if (!context.Lib.Utils.isEmptyArray(absent)) {
          missing[name] = absent;
        }

      }

      // Report completeness alongside the gap detail
      return {
        complete: context.Lib.Utils.isEmptyObject(missing),
        missing: missing
      };

    },

    /********************************************************************
    React hook that resolves the active breakpoint from the injected
    Device helper. Seeds from Device.getViewport() and subscribes to
    viewport changes, unsubscribing on unmount.

    The system carries every breakpoint's utility set in
    Style.allBreakpoints, so a caller switches presentation on the
    returned key without building a second system.

    @param {Object} theme_contract - Theme contract with a Breakpoint group

    @return {String} - Active breakpoint key ('base', 'sm', 'md', 'lg', 'xl')
    *********************************************************************/
    useBreakpoint: function (theme_contract) {

      // Resolve the active breakpoint from a viewport width
      const resolveBreakpoint = function (width) {

        // Walk the breakpoint order in descending width to find the match
        const order = context.CONFIG.BREAKPOINT_ORDER;
        let active = 'base';

        // Check each breakpoint in descending width order
        for (let i = order.length - 1; i >= 0; i--) {
          const bpKey = order[i];
          const bpWidth = theme_contract.Breakpoint[bpKey];

          if (context.Lib.Utils.isNumber(bpWidth) && width >= bpWidth) {
            active = bpKey;
            break;
          }

        }

        // Return the matched breakpoint key
        return active;

      };

      // Read the current viewport
      const viewportResult = context.Lib.Device.getViewport();
      const initialWidth = viewportResult.success ? viewportResult.width : 0;

      // State holds the active breakpoint key
      const React = context.Lib.React;
      const breakpointState = React.useState(resolveBreakpoint(initialWidth));
      const currentBreakpoint = breakpointState[0];
      const setBreakpoint = breakpointState[1];

      // Subscribe to viewport changes
      React.useEffect(function () {

        // Subscribe to viewport changes from the Device helper
        const subResult = context.Lib.Device.onViewportChange(function (dims) {

          // Resolve the new breakpoint and update state if it changed
          const next = resolveBreakpoint(dims.width);

          // Update state only when the breakpoint actually changes
          if (next !== currentBreakpoint) {
            setBreakpoint(next);
          }

        });

        // Return the cleanup function to unsubscribe on unmount
        return function () {

          // Unsubscribe only if the subscription succeeded
          if (subResult.success && context.Lib.Utils.isFunction(subResult.unsubscribe)) {
            subResult.unsubscribe();
          }

        };

      }, [currentBreakpoint]);

      // Return the current breakpoint key
      return currentBreakpoint;

    },

    Component: infra.Component,
    Style: infra.Style,
    Parts: infra.Parts,
    Lib: context.Lib,
    CONFIG: context.CONFIG,
    ERRORS: ERRORS,
    breakpoint: infra.breakpoint

  };

}/////////////////////////// createSystem END ///////////////////////////////////



/////////////////////////// Theme Contract START ///////////////////////////////

// Reshape the themer's flat emitted token map into the nested
// { Color, Dimension, Font, Breakpoint } structure the components consume.
// Pure function; re-exported so a caller bridges a theme without a system.
export { default as buildThemeContract } from './components.theme-contract.js';

/////////////////////////// Theme Contract END /////////////////////////////////



/////////////////////////// Token Constants START //////////////////////////////

// The valid token sets, so an application references a constant instead of a
// string literal. This shrinks the error surface for render-time prop
// validation.
export const TOKENS = Object.freeze({
  fontSize: Object.freeze(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  fontColor: Object.freeze(['text_primary', 'text_secondary', 'text_muted', 'text_disabled',
    'text_on_primary', 'app_primary', 'status_success', 'status_danger', 'status_warning',
    'status_info']),
  fontWeight: Object.freeze(['regular', 'medium', 'semibold', 'bold']),
  space: Object.freeze(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  radius: Object.freeze(['sm', 'md', 'lg', 'xl', 'pill']),
  background: Object.freeze([
    'button_primary', 'button_primary_hover', 'button_primary_active',
    'button_secondary', 'button_secondary_hover', 'button_secondary_active',
    'button_tertiary', 'button_tertiary_hover', 'button_tertiary_active',
    'button_danger_primary', 'button_danger_hover', 'button_danger_active',
    'button_danger_secondary', 'button_disabled', 'button_separator'
  ])
});

/////////////////////////// Token Constants END ////////////////////////////////


/////////////////////////// Named Component Exports START /////////////////////

// Generated by .github/ci-scripts/generate-exports.js from the registration
// block in build(). Do not hand edit; the G21 gate fails on any diff.
// Named exports let a bundler drop every factory the caller never imports.

// ~~~~~~~~~~ Atoms, molecules, and composites ~~~~~~~~~~
export { default as AILabel } from './component/composite/aILabel.js';
export { default as AILabelActions } from './component/molecule/aILabelActions.js';
export { default as AILabelContent } from './component/molecule/aILabelContent.js';
export { default as AISkeletonIcon } from './component/molecule/aISkeletonIcon.js';
export { default as AISkeletonPlaceholder } from './component/molecule/aISkeletonPlaceholder.js';
export { default as AISkeletonText } from './component/molecule/aISkeletonText.js';
export { default as AcceptTerms } from './component/composite/acceptTerms.js';
export { default as Accordion } from './component/composite/accordion.js';
export { default as AccordionItem } from './component/molecule/accordionItem.js';
export { default as ActionSheet } from './component/composite/actionSheet.js';
export { default as ActionableNotification } from './component/molecule/actionableNotification.js';
export { default as AspectRatio } from './component/atom/aspectRatio.js';
export { default as BadgeIndicator } from './component/atom/badgeIndicator.js';
export { default as BottomNavigationBar } from './component/molecule/bottomNavigationBar.js';
export { default as BottomSafeAreaColorOverride } from './component/molecule/bottomSafeAreaColorOverride.js';
export { default as BottomToolbar } from './component/molecule/bottomToolbar.js';
export { default as BottomToolbarPrimaryAction } from './component/molecule/bottomToolbarPrimaryAction.js';
export { default as Breadcrumb } from './component/composite/breadcrumb.js';
export { default as BreadcrumbItem } from './component/molecule/breadcrumbItem.js';
export { default as Button } from './component/atom/button.js';
export { default as ButtonSet } from './component/molecule/buttonSet.js';
export { default as Callout } from './component/molecule/callout.js';
export { default as Checkbox } from './component/atom/checkbox.js';
export { default as CheckboxGroup } from './component/composite/checkboxGroup.js';
export { default as ClickableTile } from './component/molecule/clickableTile.js';
export { default as CodeSnippet } from './component/molecule/codeSnippet.js';
export { default as Column } from './component/molecule/column.js';
export { default as ColumnHang } from './component/molecule/columnHang.js';
export { default as ComboBox } from './component/composite/comboBox.js';
export { default as ComboButton } from './component/composite/comboButton.js';
export { default as ComposedModal } from './component/composite/composedModal.js';
export { default as ContainedList } from './component/molecule/containedList.js';
export { default as ContainedListItem } from './component/molecule/containedListItem.js';
export { default as Content } from './component/molecule/content.js';
export { default as ContentSwitcher } from './component/composite/contentSwitcher.js';
export { default as ControlledPasswordInput } from './component/molecule/controlledPasswordInput.js';
export { default as Copy } from './component/molecule/copy.js';
export { default as CopyButton } from './component/molecule/copyButton.js';
export { default as DataTable } from './component/molecule/dataTable.js';
export { default as DataTableCell } from './component/molecule/dataTableCell.js';
export { default as DataTableHeader } from './component/molecule/dataTableHeader.js';
export { default as DataTableHeaderSelected } from './component/molecule/dataTableHeaderSelected.js';
export { default as DataTableRow } from './component/composite/dataTableRow.js';
export { default as DateInput } from './component/composite/dateInput.js';
export { default as DatePicker } from './component/composite/datePicker.js';
export { default as DatePickerInput } from './component/molecule/datePickerInput.js';
export { default as DefinitionTooltip } from './component/molecule/definitionTooltip.js';
export { default as DismissibleTag } from './component/molecule/dismissibleTag.js';
export { default as DocumentViewer } from './component/molecule/documentViewer.js';
export { default as Dropdown } from './component/molecule/dropdown.js';
export { default as ErrorBoundaryContext } from './component/molecule/errorBoundaryContext.js';
export { default as ErrorState } from './component/molecule/errorState.js';
export { default as ExpandableSearch } from './component/molecule/expandableSearch.js';
export { default as ExpandableTile } from './component/molecule/expandableTile.js';
export { default as FileUploader } from './component/composite/fileUploader.js';
export { default as FileUploaderButton } from './component/molecule/fileUploaderButton.js';
export { default as FileUploaderDropContainer } from './component/molecule/fileUploaderDropContainer.js';
export { default as FileUploaderItem } from './component/molecule/fileUploaderItem.js';
export { default as Filename } from './component/molecule/filename.js';
export { default as FilterableMultiSelect } from './component/composite/filterableMultiSelect.js';
export { default as FlexGrid } from './component/molecule/flexGrid.js';
export { default as Form } from './component/molecule/form.js';
export { default as FormContext } from './component/molecule/formContext.js';
export { default as FormGroup } from './component/composite/formGroup.js';
export { default as FormItem } from './component/molecule/formItem.js';
export { default as FormLabel } from './component/molecule/formLabel.js';
export { default as GlobalTheme } from './component/molecule/globalTheme.js';
export { default as GrantPermission } from './component/molecule/grantPermission.js';
export { default as Grid } from './component/molecule/grid.js';
export { default as GridSettings } from './component/molecule/gridSettings.js';
export { default as HStack } from './component/molecule/hStack.js';
export { default as Header } from './component/composite/header.js';
export { default as HeaderContainer } from './component/molecule/headerContainer.js';
export { default as HeaderGlobalAction } from './component/molecule/headerGlobalAction.js';
export { default as HeaderGlobalBar } from './component/molecule/headerGlobalBar.js';
export { default as HeaderMenu } from './component/molecule/headerMenu.js';
export { default as HeaderMenuButton } from './component/molecule/headerMenuButton.js';
export { default as HeaderMenuItem } from './component/molecule/headerMenuItem.js';
export { default as HeaderName } from './component/molecule/headerName.js';
export { default as HeaderNavigation } from './component/molecule/headerNavigation.js';
export { default as HeaderPanel } from './component/molecule/headerPanel.js';
export { default as HeaderSideNavItems } from './component/molecule/headerSideNavItems.js';
export { default as Heading } from './component/atom/heading.js';
export { default as Icon } from './component/atom/icon.js';
export { default as IconButton } from './component/molecule/iconButton.js';
export { default as IconIndicator } from './component/atom/iconIndicator.js';
export { default as IconSwitch } from './component/molecule/iconSwitch.js';
export { default as IconTab } from './component/molecule/iconTab.js';
export { default as Image } from './component/atom/image.js';
export { default as InlineLink } from './component/atom/inlineLink.js';
export { default as InlineLoading } from './component/molecule/inlineLoading.js';
export { default as InlineNotification } from './component/molecule/inlineNotification.js';
export { default as LandingView } from './component/molecule/landingView.js';
export { default as Link } from './component/atom/link.js';
export { default as List } from './component/molecule/list.js';
export { default as ListItem } from './component/molecule/listItem.js';
export { default as Loading } from './component/atom/loading.js';
export { default as Menu } from './component/composite/menu.js';
export { default as MenuButton } from './component/composite/menuButton.js';
export { default as MenuItem } from './component/molecule/menuItem.js';
export { default as MenuItemDivider } from './component/molecule/menuItemDivider.js';
export { default as MenuItemGroup } from './component/molecule/menuItemGroup.js';
export { default as MenuItemRadioGroup } from './component/composite/menuItemRadioGroup.js';
export { default as MenuItemSelectable } from './component/molecule/menuItemSelectable.js';
export { default as Modal } from './component/molecule/modal.js';
export { default as ModalBody } from './component/molecule/modalBody.js';
export { default as ModalFooter } from './component/molecule/modalFooter.js';
export { default as ModalHeader } from './component/molecule/modalHeader.js';
export { default as MultiSelect } from './component/composite/multiSelect.js';
export { default as NavigationList } from './component/molecule/navigationList.js';
export { default as NavigationListItem } from './component/molecule/navigationListItem.js';
export { default as Notification } from './component/molecule/notification.js';
export { default as NotificationActionButton } from './component/molecule/notificationActionButton.js';
export { default as NotificationButton } from './component/molecule/notificationButton.js';
export { default as NumberInput } from './component/molecule/numberInput.js';
export { default as OperationalTag } from './component/molecule/operationalTag.js';
export { default as OrderedList } from './component/molecule/orderedList.js';
export { default as OverflowMenu } from './component/composite/overflowMenu.js';
export { default as OverflowMenuItem } from './component/molecule/overflowMenuItem.js';
export { default as Pagination } from './component/composite/pagination.js';
export { default as PaginationNav } from './component/molecule/paginationNav.js';
export { default as PasswordInput } from './component/molecule/passwordInput.js';
export { default as Popover } from './component/molecule/popover.js';
export { default as PopoverContent } from './component/molecule/popoverContent.js';
export { default as PrefixContext } from './component/molecule/prefixContext.js';
export { default as ProgressBar } from './component/atom/progressBar.js';
export { default as ProgressIndicator } from './component/composite/progressIndicator.js';
export { default as ProgressStep } from './component/molecule/progressStep.js';
export { default as RadioButton } from './component/atom/radioButton.js';
export { default as RadioButtonGroup } from './component/composite/radioButtonGroup.js';
export { default as RadioTile } from './component/molecule/radioTile.js';
export { default as Row } from './component/molecule/row.js';
export { default as SafeAreaWrapper } from './component/molecule/safeAreaWrapper.js';
export { default as Search } from './component/molecule/search.js';
export { default as Section } from './component/molecule/section.js';
export { default as Select } from './component/composite/select.js';
export { default as SelectItem } from './component/molecule/selectItem.js';
export { default as SelectItemGroup } from './component/molecule/selectItemGroup.js';
export { default as SelectableTag } from './component/molecule/selectableTag.js';
export { default as SelectableTile } from './component/molecule/selectableTile.js';
export { default as ShapeIndicator } from './component/atom/shapeIndicator.js';
export { default as SideNav } from './component/molecule/sideNav.js';
export { default as SideNavDetails } from './component/molecule/sideNavDetails.js';
export { default as SideNavDivider } from './component/molecule/sideNavDivider.js';
export { default as SideNavFooter } from './component/molecule/sideNavFooter.js';
export { default as SideNavHeader } from './component/molecule/sideNavHeader.js';
export { default as SideNavIcon } from './component/molecule/sideNavIcon.js';
export { default as SideNavItem } from './component/molecule/sideNavItem.js';
export { default as SideNavItems } from './component/molecule/sideNavItems.js';
export { default as SideNavLink } from './component/molecule/sideNavLink.js';
export { default as SideNavLinkText } from './component/molecule/sideNavLinkText.js';
export { default as SideNavMenu } from './component/molecule/sideNavMenu.js';
export { default as SideNavMenuItem } from './component/molecule/sideNavMenuItem.js';
export { default as SideNavSwitcher } from './component/molecule/sideNavSwitcher.js';
export { default as SidePanel } from './component/composite/sidePanel.js';
export { default as Skeleton } from './component/atom/skeleton.js';
export { default as SkeletonIcon } from './component/molecule/skeletonIcon.js';
export { default as SkeletonPlaceholder } from './component/molecule/skeletonPlaceholder.js';
export { default as SkeletonText } from './component/molecule/skeletonText.js';
export { default as SkipToContent } from './component/molecule/skipToContent.js';
export { default as Slider } from './component/atom/slider.js';
export { default as Stack } from './component/molecule/stack.js';
export { default as StaticNotification } from './component/molecule/staticNotification.js';
export { default as StructuredListBody } from './component/molecule/structuredListBody.js';
export { default as StructuredListCell } from './component/molecule/structuredListCell.js';
export { default as StructuredListHead } from './component/molecule/structuredListHead.js';
export { default as StructuredListInput } from './component/molecule/structuredListInput.js';
export { default as StructuredListRow } from './component/molecule/structuredListRow.js';
export { default as StructuredListWrapper } from './component/molecule/structuredListWrapper.js';
export { default as Switch } from './component/molecule/switch.js';
export { default as Switcher } from './component/molecule/switcher.js';
export { default as SwitcherDivider } from './component/molecule/switcherDivider.js';
export { default as SwitcherItem } from './component/molecule/switcherItem.js';
export { default as Tab } from './component/molecule/tab.js';
export { default as TabContent } from './component/molecule/tabContent.js';
export { default as TabList } from './component/molecule/tabList.js';
export { default as TabListVertical } from './component/molecule/tabListVertical.js';
export { default as TabPanel } from './component/molecule/tabPanel.js';
export { default as TabPanels } from './component/molecule/tabPanels.js';
export { default as Table } from './component/molecule/table.js';
export { default as TableActionList } from './component/molecule/tableActionList.js';
export { default as TableBatchAction } from './component/molecule/tableBatchAction.js';
export { default as TableBatchActions } from './component/molecule/tableBatchActions.js';
export { default as TableBody } from './component/molecule/tableBody.js';
export { default as TableCell } from './component/molecule/tableCell.js';
export { default as TableContainer } from './component/molecule/tableContainer.js';
export { default as TableDecoratorRow } from './component/molecule/tableDecoratorRow.js';
export { default as TableExpandHeader } from './component/molecule/tableExpandHeader.js';
export { default as TableExpandRow } from './component/molecule/tableExpandRow.js';
export { default as TableExpandedRow } from './component/molecule/tableExpandedRow.js';
export { default as TableHead } from './component/molecule/tableHead.js';
export { default as TableHeader } from './component/molecule/tableHeader.js';
export { default as TableRow } from './component/molecule/tableRow.js';
export { default as TableSelectAll } from './component/molecule/tableSelectAll.js';
export { default as TableSelectRow } from './component/molecule/tableSelectRow.js';
export { default as TableSlugRow } from './component/molecule/tableSlugRow.js';
export { default as TableToolbar } from './component/molecule/tableToolbar.js';
export { default as TableToolbarAction } from './component/molecule/tableToolbarAction.js';
export { default as TableToolbarContent } from './component/molecule/tableToolbarContent.js';
export { default as TableToolbarMenu } from './component/molecule/tableToolbarMenu.js';
export { default as TableToolbarSearch } from './component/molecule/tableToolbarSearch.js';
export { default as Tabs } from './component/composite/tabs.js';
export { default as TabsVertical } from './component/composite/tabsVertical.js';
export { default as Tag } from './component/atom/tag.js';
export { default as Text } from './component/atom/text.js';
export { default as TextArea } from './component/atom/textArea.js';
export { default as TextInput } from './component/atom/textInput.js';
export { default as ThemeContext } from './component/molecule/themeContext.js';
export { default as Tile } from './component/molecule/tile.js';
export { default as TileAboveTheFoldContent } from './component/molecule/tileAboveTheFoldContent.js';
export { default as TileBelowTheFoldContent } from './component/molecule/tileBelowTheFoldContent.js';
export { default as TileGroup } from './component/molecule/tileGroup.js';
export { default as TimePicker } from './component/composite/timePicker.js';
export { default as TimePickerSelect } from './component/molecule/timePickerSelect.js';
export { default as ToastNotification } from './component/molecule/toastNotification.js';
export { default as Toggle } from './component/atom/toggle.js';
export { default as Toggletip } from './component/molecule/toggletip.js';
export { default as ToggletipActions } from './component/molecule/toggletipActions.js';
export { default as ToggletipButton } from './component/molecule/toggletipButton.js';
export { default as ToggletipContent } from './component/molecule/toggletipContent.js';
export { default as ToggletipLabel } from './component/composite/toggletipLabel.js';
export { default as Tooltip } from './component/molecule/tooltip.js';
export { default as TopNavigationBar } from './component/molecule/topNavigationBar.js';
export { default as TopNavigationBarLogin } from './component/molecule/topNavigationBarLogin.js';
export { default as TreeNode } from './component/molecule/treeNode.js';
export { default as TreeView } from './component/composite/treeView.js';
export { default as TruncatedText } from './component/molecule/truncatedText.js';
export { default as UiPanel } from './component/molecule/uiPanel.js';
export { default as UiPanelItem } from './component/molecule/uiPanelItem.js';
export { default as UnorderedList } from './component/molecule/unorderedList.js';
export { default as UserAvatar } from './component/molecule/userAvatar.js';
export { default as VStack } from './component/molecule/vStack.js';
export { default as View } from './component/atom/view.js';
export { default as ViewWrapper } from './component/molecule/viewWrapper.js';
export { default as WebHeader } from './component/molecule/webHeader.js';

// ~~~~~~~~~~ Variants ~~~~~~~~~~
export { default as ButtonPrimaryOutlined } from './component/variant/buttonPrimaryOutlined.js';

// ~~~~~~~~~~ Freeform ~~~~~~~~~~
export { default as RawBox } from './component/freeform/rawBox.js';

// ~~~~~~~~~~ Providers ~~~~~~~~~~
export { default as ErrorBoundary } from './component/provider/errorBoundary.js';
export { default as FeatureFlags } from './component/provider/featureFlags.js';
export { default as FluidForm } from './component/provider/fluidForm.js';
export { default as IdPrefix } from './component/provider/idPrefix.js';
export { default as Layer } from './component/provider/layer.js';
export { default as LiveRegionProvider } from './component/provider/liveRegionProvider.js';
export { default as Overlay } from './component/provider/overlay.js';
export { default as Theme } from './component/provider/theme.js';

/////////////////////////// Named Component Exports END ///////////////////////


/////////////////////////// Private Functions START ////////////////////////////

/********************************************************************
Build the validated dependency container and merged config for one
system. Kept separate from createSystem so the validation sequence
reads as one unit and every guard is visible in one place.

@param {Object} shared_libs - Lib container from the caller
@param {Object} config      - Overrides merged over defaults

@return {Object} - { Lib, CONFIG, Validators }
*********************************************************************/
const buildContext = function (shared_libs, config) {

  // Dependencies for this instance - by reference from the shared container
  const Lib = {
    Utils: shared_libs.Utils,
    Debug: shared_libs.Debug,
    React: shared_libs.React,
    Device: shared_libs.Device,
    Icons: shared_libs.Icons,
    Font: shared_libs.Font || null
  };

  // Merge overrides over defaults
  const CONFIG = Object.assign(
    {},
    DEFAULT_CONFIG,
    config || {}
  );

  // Load the validators singleton and inject Lib + ERRORS
  const Validators = createValidators(Lib, ERRORS);

  // Validate config - throws on misconfiguration
  Validators.validateConfig(CONFIG);

  // Validate required injections - throws on missing dependency
  Validators.validateInjections(shared_libs);

  // Return the validated context the system is built on
  return { Lib: Lib, CONFIG: CONFIG, Validators: Validators };

};


/********************************************************************
Build the mechanism parts, the per-breakpoint utility styles, the
empty component registry, and the make helper. This is everything a
system needs before a single component is registered.

@param {Object} Lib        - Dependency container
@param {Object} CONFIG     - Merged configuration
@param {Object} ERRORS     - Frozen error catalog
@param {Object} Validators - Validators singleton
@param {Object} theme      - Theme contract
@param {String} breakpoint - Active breakpoint key (default 'base')

@return {Object} - { make, Component, Style, Parts, breakpoint }
*********************************************************************/
const buildInfrastructure = function (Lib, CONFIG, ERRORS, Validators, theme, breakpoint) {

  // Validate the theme contract at boot time - throws on malformed theme
  Validators.validateTheme(theme);

  // Resolve the active breakpoint, defaulting to 'base'
  const activeBreakpoint = breakpoint || 'base';

  // Mechanism parts - built once per instance, injected into every component
  // factory. Parts are internal; they are never exported through the public
  // interface. See module-structure.md, Parts Pattern.
  const partsConfig = Object.assign({}, CONFIG, { STYLE_CONTRACT: STYLE_CONTRACT });

  // Instantiate each mechanism part with the shared injection set
  const Parts = {
    A11y:             partsA11y(Lib, partsConfig, ERRORS),
    PressKeys:        partsPressKeys(Lib, partsConfig, ERRORS),
    RovingTabIndex:   partsRovingTabIndex(Lib, partsConfig, ERRORS),
    ControllableState: partsControllableState(Lib, partsConfig, ERRORS),
    AnchoredPosition: partsAnchoredPosition(Lib, partsConfig, ERRORS),
    FocusTrap:        partsFocusTrap(Lib, partsConfig, ERRORS),
    Overlay:          partsOverlay(Lib, partsConfig, ERRORS),
    CompoundContext:  partsCompoundContext(Lib, partsConfig, ERRORS),
    Units:            partsUnits(Lib, partsConfig, ERRORS),
    Typeface:         partsTypeface(Lib, partsConfig, ERRORS),
    Direction:        partsDirection(Lib, partsConfig, ERRORS),
    Filter:           partsFilter(Lib, partsConfig, ERRORS)
  };

  // Generate utility styles for every breakpoint, memoized by key
  const allStyles = {};
  const breakpointKeys = Object.keys(theme.Breakpoint);

  // Generate the utility set for each breakpoint
  for (let i = 0; i < breakpointKeys.length; i++) {
    const bpKey = breakpointKeys[i];

    // Skip non-numeric breakpoint entries
    if (!Lib.Utils.isNumber(theme.Breakpoint[bpKey])) {
      continue;
    }

    // Generate and cache the utility set for this breakpoint
    allStyles[bpKey] = generateStyles(theme, bpKey, Parts);

  }

  // Resolve the active breakpoint's utility set, wrapping it in strict mode so
  // a component naming an undeclared utility fails loudly instead of rendering
  // unstyled. Lenient mode returns the plain object, so there is no Proxy cost.
  const activeStyles = allStyles[activeBreakpoint] || allStyles['base'];
  const utilities = CONFIG.STRICT_TOKENS
    ? new Proxy(activeStyles, {
      get: function (target, key) {

        // Reject an unknown string key; symbol keys are React and JS internals
        if (Lib.Utils.isString(key) && !(key in target)) {
          throw new TypeError('rnw-components: unknown utility "' + key + '"');
        }

        // Return the resolved utility for a declared key
        return target[key];

      }
    })
    : activeStyles;

  // Build the Style slot consumed by every component factory
  const Style = {
    utilities: utilities,
    tokens: theme,
    breakpoint: activeBreakpoint,
    allBreakpoints: allStyles
  };

  // The shared component registry (molecules close over this object)
  const Component = {};

  // Helper: instantiate a factory with the full injection set
  // Lib is first, matching every other Superloom module
  const make = function (factory) {
    return factory(Lib, CONFIG, ERRORS, Parts, Component, Style);
  };

  // Return the infrastructure the registrars build the registry against
  return {
    make: make,
    Component: Component,
    Style: Style,
    Parts: Parts,
    breakpoint: activeBreakpoint
  };

};

/////////////////////////// Private Functions END //////////////////////////////

