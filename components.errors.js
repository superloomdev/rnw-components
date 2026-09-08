// Info: Error catalog for rnw-components.
//
// Frozen on export. Injected into validators and the public interface.
// Boot-time misconfiguration throws TypeError; render-time prop errors
// warn and fall back deterministically.

export default Object.freeze({

  THEME_INVALID: {
    type: 'rnw-components/theme-invalid',
    message: 'Theme contract is malformed. Required groups: Color, Dimension, Font, Breakpoint'
  },

  THEME_MISSING_TOKEN_GROUP: {
    type: 'rnw-components/theme-missing-token-group',
    message: 'Theme contract is missing a required token group'
  },

  THEME_MISSING_TOKENS: {
    type: 'rnw-components/theme-missing-tokens',
    message: 'Theme is missing required tokens'
  },

  THEME_UNSUPPORTED_TOKENS: {
    type: 'rnw-components/theme-unsupported-tokens',
    message: 'Theme contains unsupported tokens'
  },

  THEMER_UNAVAILABLE: {
    type: 'rnw-components/themer-unavailable',
    message: 'Themer engine is not injected. Provide shared_libs.Themer'
  },

  REACT_NOT_INJECTED: {
    type: 'rnw-components/react-not-injected',
    message: 'React is not injected. Provide shared_libs.React (the react module)'
  },

  DEVICE_NOT_INJECTED: {
    type: 'rnw-components/device-not-injected',
    message: 'Device helper is not injected. Provide shared_libs.Device (js-rnw-helper-device)'
  },

  ICONS_NOT_INJECTED: {
    type: 'rnw-components/icons-not-injected',
    message: 'Icon source is not injected. Provide shared_libs.Icons with a Glyph component'
  },

  THEME_MISSING_COLOR_TOKEN: {
    type: 'rnw-components/theme-missing-color-token',
    message: 'Theme contract is missing a required Color token'
  },

  THEME_VALUE_NOT_FINITE: {
    type: 'rnw-components/theme-value-not-finite',
    message: 'Theme dimension value must be a finite number'
  },

  THEME_VALUE_UNIT_STRING: {
    type: 'rnw-components/theme-value-unit-string',
    message: 'Theme dimension value contains a CSS unit suffix. Pass the native projection instead of the web projection'
  }

});
