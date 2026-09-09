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
import ThemerFactory from 'helper-themer';
import carbonV11Profile from 'helper-themer-template-carbon';
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
// Both are built through the real Themer engine from the Carbon reference
// template, so the L3 bundle proves a browser render with the same contract
// the unit tests use. The contrast theme applies a purple brand layer over
// the Carbon white scheme to prove the components carry no baked-in color.
const CONTRAST_LAYER = {
  name: 'contrast',
  tokens: {
    'color.interactive': '#7c3aed',
    'color.button_primary': '#7c3aed',
    'color.button_primary_hover': '#6d28d9',
    'color.button_primary_active': '#5b21b6',
    'color.link_primary': '#7c3aed',
    'color.focus': '#7c3aed'
  }
};

function buildRegistry(themeName) {
  const Utils = UtilsFactory();
  const Debug = DebugFactory({ Utils: Utils });
  const Themer = ThemerFactory({ Utils: Utils, Debug: Debug });
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

  const isContrast = themeName === 'contrast';
  const layers = isContrast ? [CONTRAST_LAYER] : [];
  const built = Themer.buildTheme(carbonV11Profile.schemes.white, layers, 'native');

  const system = createSystem({
    Utils: Utils, Debug: Debug, React: React, Device: Device, Icons: Icons,
    Themer: Themer
  }, {}, built, 'sm');

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
