// Info: Theme fixtures for rnw-components tests.
//
// Provides the fixed-value control theme and the Poppins real-family theme.
// The themer-driven matrix is removed; tests use the fixed control theme.

// The fixed-value control theme. Deterministic, integer-only values.
export function createTestTheme () {

  return {
    Color: {
      APP_PRIMARY: '#0f62fe',
      APP_PRIMARY_HOVERED: '#0353e9',
      APP_PRIMARY_PRESSED: '#0043d9',
      APP_PRIMARY_DISABLED: '#a6c8ff',
      APP_PRIMARY_SUBTLE: '#edf5ff',
      TEXT_PRIMARY: '#161616',
      TEXT_SECONDARY: '#525252',
      TEXT_MUTED: '#6f6f6f',
      TEXT_DISABLED: '#a8a8a8',
      TEXT_ON_PRIMARY: '#ffffff',
      BACKGROUND_PRIMARY: '#ffffff',
      BACKGROUND_SECONDARY: '#f4f4f4',
      SURFACE: '#ffffff',
      BORDER: '#e0e0e0',
      BORDER_STRONG: '#8d8d8d',
      BORDER_SUBTLE: '#e0e0e0',
      STATUS_SUCCESS: '#0e6027',
      STATUS_SUCCESS_SUBTLE: '#e8f5e9',
      STATUS_DANGER: '#da1e28',
      STATUS_DANGER_SUBTLE: '#fff1f1',
      STATUS_WARNING: '#8e6a00',
      STATUS_WARNING_SUBTLE: '#fcf4d6',
      STATUS_INFO: '#0043ce',
      STATUS_INFO_SUBTLE: '#edf5ff',
      BUTTON_PRIMARY: '#0f62fe',
      BUTTON_PRIMARY_HOVER: '#0353e9',
      BUTTON_PRIMARY_ACTIVE: '#0043d9',
      BUTTON_SECONDARY: '#393939',
      BUTTON_SECONDARY_HOVER: '#4c4c4c',
      BUTTON_SECONDARY_ACTIVE: '#636363',
      BUTTON_TERTIARY: '#0f62fe',
      BUTTON_TERTIARY_HOVER: '#0353e9',
      BUTTON_TERTIARY_ACTIVE: '#0043d9',
      BUTTON_DANGER_PRIMARY: '#da1e28',
      BUTTON_DANGER_HOVER: '#b0191f',
      BUTTON_DANGER_ACTIVE: '#8a1116',
      BUTTON_DANGER_SECONDARY: '#da1e28',
      BUTTON_DISABLED: '#c6c6c6',
      BUTTON_SEPARATOR: '#e0e0e0'
    },
    Dimension: {
      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
      space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
      radius: { sm: 4, md: 8, lg: 12, xl: 16, pill: 999 },
      lineHeightRatio: 1.4
    },
    Font: {
      family: { primary: 'System', secondary: 'System' },
      weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    },
    Breakpoint: {
      base: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  };

}


// Real-family theme for exercising the native per-weight-face path.
// Uses Poppins family names to prove that Typeface.isSynthesizing returns
// false and fontWeight is omitted from the style fragment.
export function createRealFamilyTheme () {

  return {
    Color: {
      APP_PRIMARY: '#0f62fe',
      APP_PRIMARY_HOVERED: '#0353e9',
      APP_PRIMARY_PRESSED: '#0043d9',
      APP_PRIMARY_DISABLED: '#a6c8ff',
      APP_PRIMARY_SUBTLE: '#edf5ff',
      TEXT_PRIMARY: '#161616',
      TEXT_SECONDARY: '#525252',
      TEXT_MUTED: '#6f6f6f',
      TEXT_DISABLED: '#a8a8a8',
      TEXT_ON_PRIMARY: '#ffffff',
      BACKGROUND_PRIMARY: '#ffffff',
      BACKGROUND_SECONDARY: '#f4f4f4',
      SURFACE: '#ffffff',
      BORDER: '#e0e0e0',
      BORDER_STRONG: '#8d8d8d',
      BORDER_SUBTLE: '#e0e0e0',
      STATUS_SUCCESS: '#0e6027',
      STATUS_SUCCESS_SUBTLE: '#e8f5e9',
      STATUS_DANGER: '#da1e28',
      STATUS_DANGER_SUBTLE: '#fff1f1',
      STATUS_WARNING: '#8e6a00',
      STATUS_WARNING_SUBTLE: '#fcf4d6',
      STATUS_INFO: '#0043ce',
      STATUS_INFO_SUBTLE: '#edf5ff',
      BUTTON_PRIMARY: '#0f62fe',
      BUTTON_PRIMARY_HOVER: '#0353e9',
      BUTTON_PRIMARY_ACTIVE: '#0043d9',
      BUTTON_SECONDARY: '#393939',
      BUTTON_SECONDARY_HOVER: '#4c4c4c',
      BUTTON_SECONDARY_ACTIVE: '#636363',
      BUTTON_TERTIARY: '#0f62fe',
      BUTTON_TERTIARY_HOVER: '#0353e9',
      BUTTON_TERTIARY_ACTIVE: '#0043d9',
      BUTTON_DANGER_PRIMARY: '#da1e28',
      BUTTON_DANGER_HOVER: '#b0191f',
      BUTTON_DANGER_ACTIVE: '#8a1116',
      BUTTON_DANGER_SECONDARY: '#da1e28',
      BUTTON_DISABLED: '#c6c6c6',
      BUTTON_SEPARATOR: '#e0e0e0'
    },
    Dimension: {
      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
      space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
      radius: { sm: 4, md: 8, lg: 12, xl: 16, pill: 999 },
      lineHeightRatio: 1.4
    },
    Font: {
      family: { primary: 'Poppins_400Regular', secondary: 'Poppins_600SemiBold' },
      weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    },
    Breakpoint: {
      base: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  };

}


// Spec-faithful IBM Carbon. Square corners (Carbon's signature), Carbon Blue 60
// as the interactive color, Carbon's grey ramp, and IBM Plex Sans. Only `pill`
// keeps a radius: Carbon v11 tags are genuinely pill-shaped, so squaring them
// would be less faithful, not more.
export function createCarbonTheme () {

  return {
    Color: {
      APP_PRIMARY: '#0f62fe',
      APP_PRIMARY_HOVERED: '#0353e9',
      APP_PRIMARY_PRESSED: '#002d9c',
      APP_PRIMARY_DISABLED: '#c6c6c6',
      APP_PRIMARY_SUBTLE: '#edf5ff',
      TEXT_PRIMARY: '#161616',
      TEXT_SECONDARY: '#525252',
      TEXT_MUTED: '#6f6f6f',
      TEXT_DISABLED: '#c6c6c6',
      TEXT_ON_PRIMARY: '#ffffff',
      BACKGROUND_PRIMARY: '#ffffff',
      BACKGROUND_SECONDARY: '#f4f4f4',
      SURFACE: '#ffffff',
      BORDER: '#e0e0e0',
      STATUS_SUCCESS: '#198038',
      STATUS_SUCCESS_SUBTLE: '#defbe6',
      STATUS_DANGER: '#da1e28',
      STATUS_DANGER_SUBTLE: '#fff1f1',
      STATUS_WARNING: '#f1c21b',
      STATUS_WARNING_SUBTLE: '#fcf4d6',
      STATUS_INFO: '#0043ce',
      STATUS_INFO_SUBTLE: '#edf5ff',
      BUTTON_PRIMARY: '#0f62fe',
      BUTTON_PRIMARY_HOVER: '#0353e9',
      BUTTON_PRIMARY_ACTIVE: '#002d9c',
      BUTTON_SECONDARY: '#393939',
      BUTTON_SECONDARY_HOVER: '#4c4c4c',
      BUTTON_SECONDARY_ACTIVE: '#636363',
      BUTTON_TERTIARY: '#0f62fe',
      BUTTON_TERTIARY_HOVER: '#0353e9',
      BUTTON_TERTIARY_ACTIVE: '#002d9c',
      BUTTON_DANGER_PRIMARY: '#da1e28',
      BUTTON_DANGER_HOVER: '#b0191f',
      BUTTON_DANGER_ACTIVE: '#8a1116',
      BUTTON_DANGER_SECONDARY: '#da1e28',
      BUTTON_DISABLED: '#c6c6c6',
      BUTTON_SEPARATOR: '#e0e0e0'
    },
    Dimension: {
      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
      space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
      radius: { none: 0, sm: 0, md: 0, lg: 0, pill: 999 },
      lineHeightRatio: 1.4
    },
    Font: {
      family: { primary: 'IBM Plex Sans', secondary: 'IBM Plex Sans' },
      weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    },
    Breakpoint: { base: 0, sm: 480, md: 768, lg: 1024, xl: 1280 }
  };

}


// A deliberately un-Carbon theme. Every value differs from createCarbonTheme so
// a test can prove the component set carries no baked-in design language: if
// output is identical under both, something is hardcoded.
export function createContrastTheme () {

  return {
    Color: {
      APP_PRIMARY: '#7c3aed',
      APP_PRIMARY_HOVERED: '#6d28d9',
      APP_PRIMARY_PRESSED: '#5b21b6',
      APP_PRIMARY_DISABLED: '#ddd6fe',
      APP_PRIMARY_SUBTLE: '#f5f3ff',
      TEXT_PRIMARY: '#1c1917',
      TEXT_SECONDARY: '#57534e',
      TEXT_MUTED: '#78716c',
      TEXT_DISABLED: '#d6d3d1',
      TEXT_ON_PRIMARY: '#fffbeb',
      BACKGROUND_PRIMARY: '#fffbeb',
      BACKGROUND_SECONDARY: '#fef3c7',
      SURFACE: '#fffbeb',
      BORDER: '#d6d3d1',
      STATUS_SUCCESS: '#4d7c0f',
      STATUS_SUCCESS_SUBTLE: '#ecfccb',
      STATUS_DANGER: '#b91c1c',
      STATUS_DANGER_SUBTLE: '#fee2e2',
      STATUS_WARNING: '#c2410c',
      STATUS_WARNING_SUBTLE: '#ffedd5',
      STATUS_INFO: '#1d4ed8',
      STATUS_INFO_SUBTLE: '#dbeafe',
      BUTTON_PRIMARY: '#7c3aed',
      BUTTON_PRIMARY_HOVER: '#6d28d9',
      BUTTON_PRIMARY_ACTIVE: '#5b21b6',
      BUTTON_SECONDARY: '#292524',
      BUTTON_SECONDARY_HOVER: '#44403c',
      BUTTON_SECONDARY_ACTIVE: '#57534e',
      BUTTON_TERTIARY: '#7c3aed',
      BUTTON_TERTIARY_HOVER: '#6d28d9',
      BUTTON_TERTIARY_ACTIVE: '#5b21b6',
      BUTTON_DANGER_PRIMARY: '#b91c1c',
      BUTTON_DANGER_HOVER: '#991b1b',
      BUTTON_DANGER_ACTIVE: '#7f1d1d',
      BUTTON_DANGER_SECONDARY: '#b91c1c',
      BUTTON_DISABLED: '#d6d3d1',
      BUTTON_SEPARATOR: '#d6d3d1'
    },
    Dimension: {
      fontSize: { xs: 11, sm: 13, md: 15, lg: 19, xl: 23, xxl: 29 },
      space: { xs: 3, sm: 6, md: 10, lg: 14, xl: 22, xxl: 30 },
      radius: { none: 0, sm: 6, md: 10, lg: 18, pill: 999 },
      lineHeightRatio: 1.6
    },
    Font: {
      family: { primary: 'Georgia', secondary: 'Georgia' },
      weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    },
    Breakpoint: { base: 0, sm: 480, md: 768, lg: 1024, xl: 1280 }
  };

}


// A theme missing exactly two required Color tokens, for proving the gate.
// Returns the token names it removed so a test can assert the throw names them.
export function createIncompleteTheme () {

  const theme = createCarbonTheme();
  const removed = ['APP_PRIMARY', 'STATUS_INFO_SUBTLE'];

  for (let i = 0; i < removed.length; i++) {
    delete theme.Color[removed[i]];
  }

  return { theme: theme, removed: removed };

}
