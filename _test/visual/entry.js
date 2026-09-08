// Info: Single entry point for esbuild. Bundles everything into one ESM file.
// Exports React, ReactDOM, and the component registry builder.
// Hint-props for interactive components are inlined here (the package no
// longer ships a shared hint-props file; each consumer owns its own).
//
// This entry is a real subset consumer: it imports the sixteen interactive
// components by name plus the three siblings they resolve at render time, so
// the L3 bundle proves in a browser that a tree-shaken registry renders.
// checkRegistry() asserts the sibling set is complete before the first render.

import React from 'react';
import * as ReactDOM from 'react-dom/client';
import UtilsFactory from 'helper-utils';
import DebugFactory from 'helper-debug';
import {
  createSystem,
  // The sixteen interactive components the gallery renders
  Button, IconButton, Toggle, Checkbox, RadioButton,
  Switch, Link, InlineLink, Tab, AccordionItem,
  Slider, CopyButton, MenuItem, SelectItem,
  ClickableTile, SelectableTile,
  // Siblings the sixteen resolve from the registry at render time
  Icon, Text, TextInput
} from 'rnw-components';

const noop = function () {};

// Components excluded: Tooltip/DefinitionTooltip require React element children
const INTERACTIVE = [
  'Button', 'IconButton', 'Toggle', 'Checkbox', 'RadioButton',
  'Switch', 'Link', 'InlineLink', 'Tab', 'AccordionItem',
  'Slider', 'CopyButton',
  'MenuItem', 'SelectItem', 'ClickableTile', 'SelectableTile'
];

// Minimal render-hint props for the interactive subset. Each entry provides
// the prop set that lets a component render non-empty output without throwing.
const HINT_PROPS = {
  Button: { children: 'Button', onPress: noop },
  IconButton: { name: 'add', onPress: noop },
  Toggle: { value: true, onValueChange: noop },
  Checkbox: { checked: true, onChange: noop },
  RadioButton: { checked: true, onChange: noop },
  Switch: { label: 'Switch', selected: true, onPress: noop },
  Link: { children: 'Link', onPress: noop },
  InlineLink: { title: 'Inline link', onPress: noop },
  Tab: { label: 'Tab', onPress: noop },
  AccordionItem: { title: 'Item', children: 'Body' },
  Slider: { value: 50, onChange: noop },
  CopyButton: { text: 'copied text', onCopy: noop },
  MenuItem: { label: 'Menu item', onPress: noop },
  SelectItem: { text: 'Option', value: 'opt1' },
  ClickableTile: { title: 'Clickable tile', onPress: noop },
  SelectableTile: { title: 'Selectable tile' }
};

// Carbon is square by specification; the contrast theme is rounded and warm.
// Both are declared here rather than imported so the bundle stays standalone.
const THEME_RADIUS = { carbon: 0, contrast: 10 };
const THEME_PRIMARY = { carbon: '#0f62fe', contrast: '#7c3aed' };

function buildRegistry(themeName) {
  const Utils = UtilsFactory();
  const Debug = DebugFactory({ Utils: Utils });
  const Device = {
    getPlatform: function () { return { success: true, platform: 'web', error: null }; },
    getViewport: function () { return { success: true, width: 1280, height: 800, error: null }; },
    onViewportChange: function () { return { success: true, unsubscribe: function () {}, error: null }; }
  };
  const Icons = {
    Glyph: function (props) {
      return React.createElement('span', { 'data-icon': props.name, 'aria-hidden': 'true' }, props.name);
    }
  };

  const theme = {
    Color: {
      APP_PRIMARY: THEME_PRIMARY[themeName || 'carbon'], APP_PRIMARY_HOVERED: '#0353e9',
      APP_PRIMARY_PRESSED: '#0043d9', APP_PRIMARY_DISABLED: '#a6c8ff',
      APP_PRIMARY_SUBTLE: '#edf5ff', TEXT_PRIMARY: '#161616',
      TEXT_SECONDARY: '#525252', TEXT_MUTED: '#8d8d8d',
      TEXT_DISABLED: '#c6c6c6',
      TEXT_ON_PRIMARY: '#ffffff', BACKGROUND_PRIMARY: '#ffffff',
      BACKGROUND_SECONDARY: '#f4f4f4', SURFACE: '#ffffff',
      BORDER: '#e0e0e0', STATUS_SUCCESS: '#198038',
      STATUS_SUCCESS_SUBTLE: '#e8f5e9', STATUS_DANGER: '#da1e28',
      STATUS_DANGER_SUBTLE: '#fff1f1', STATUS_WARNING: '#f1c21b',
      STATUS_WARNING_SUBTLE: '#fcf4d6', STATUS_INFO: '#0043ce',
      STATUS_INFO_SUBTLE: '#edf5ff',
      BUTTON_PRIMARY: '#0f62fe', BUTTON_PRIMARY_HOVER: '#0353e9',
      BUTTON_PRIMARY_ACTIVE: '#0043d9', BUTTON_SECONDARY: '#393939',
      BUTTON_SECONDARY_HOVER: '#4c4c4c', BUTTON_SECONDARY_ACTIVE: '#636363',
      BUTTON_TERTIARY: '#0f62fe', BUTTON_TERTIARY_HOVER: '#0353e9',
      BUTTON_TERTIARY_ACTIVE: '#0043d9', BUTTON_DANGER_PRIMARY: '#da1e28',
      BUTTON_DANGER_HOVER: '#b0191f', BUTTON_DANGER_ACTIVE: '#8a1116',
      BUTTON_DANGER_SECONDARY: '#da1e28', BUTTON_DISABLED: '#c6c6c6',
      BUTTON_SEPARATOR: '#e0e0e0'
    },
    Dimension: {
      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
      space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
      radius: (function () {
        const r = THEME_RADIUS[themeName || 'carbon'];
        return { none: 0, sm: r, md: r, lg: r, xl: r, pill: 999 };
      })(),
      lineHeightRatio: 1.4
    },
    Font: {
      family: { primary: 'system-ui', secondary: 'system-ui' },
      weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    },
    Breakpoint: { base: 0, sm: 480, md: 768, lg: 1024, xl: 1280 }
  };

  const system = createSystem({
    Utils: Utils, Debug: Debug, React: React, Device: Device, Icons: Icons
  }, {}, theme, 'base');

  // Register the interactive set plus the siblings it renders
  system.addComponents({
    Button: Button, IconButton: IconButton, Toggle: Toggle, Checkbox: Checkbox,
    RadioButton: RadioButton, Switch: Switch, Link: Link, InlineLink: InlineLink,
    Tab: Tab, AccordionItem: AccordionItem, Slider: Slider, CopyButton: CopyButton,
    MenuItem: MenuItem, SelectItem: SelectItem, ClickableTile: ClickableTile,
    SelectableTile: SelectableTile,
    Icon: Icon, Text: Text, TextInput: TextInput
  });

  // A missing sibling would surface as a render-time mystery, so fail at boot
  const check = system.checkRegistry();

  if (!check.complete) {
    throw new Error('Incomplete registry: ' + JSON.stringify(check.missing));
  }

  return { C: system.Component, ALL_NAMES: Object.keys(system.Component) };
}

// Error Boundary class
class SafeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error: error };
  }
  render() {
    if (this.state.error) {
      return React.createElement('span', {
        'data-error': this.state.error.message,
        style: { fontSize: 11, color: '#da1e28' }
      }, this.props.name + ': ' + this.state.error.message);
    }
    return this.props.children;
  }
}

export { React, ReactDOM, SafeBoundary, buildRegistry, HINT_PROPS, INTERACTIVE };
export default { React, ReactDOM, SafeBoundary, buildRegistry, HINT_PROPS, INTERACTIVE };
