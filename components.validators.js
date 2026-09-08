// Info: Validators for rnw-components.
//
// Receives Lib and ERRORS by injection from the loader.
// Never self-requires the error catalog or data files.
// Boot-time validation throws TypeError; render-time validation is
// handled inside component factories via Lib.Debug.warn + fallback.

// Color tokens the component set cannot render without. The list is the union
// of the tokens components read directly and the tokens commonStyles.js turns
// into utility classes. A theme missing any of them produces either a crash or
// a silently broken utility class, so absence fails at boot instead.
const REQUIRED_COLOR_TOKENS = Object.freeze([
  'APP_PRIMARY', 'APP_PRIMARY_HOVERED', 'APP_PRIMARY_PRESSED',
  'APP_PRIMARY_DISABLED', 'APP_PRIMARY_SUBTLE',
  'TEXT_PRIMARY', 'TEXT_SECONDARY', 'TEXT_MUTED', 'TEXT_DISABLED',
  'TEXT_ON_PRIMARY',
  'BACKGROUND_PRIMARY', 'BACKGROUND_SECONDARY', 'SURFACE', 'BORDER',
  'STATUS_SUCCESS', 'STATUS_SUCCESS_SUBTLE',
  'STATUS_DANGER', 'STATUS_DANGER_SUBTLE',
  'STATUS_WARNING', 'STATUS_WARNING_SUBTLE',
  'STATUS_INFO', 'STATUS_INFO_SUBTLE',
  'BUTTON_PRIMARY', 'BUTTON_PRIMARY_HOVER', 'BUTTON_PRIMARY_ACTIVE',
  'BUTTON_SECONDARY', 'BUTTON_SECONDARY_HOVER', 'BUTTON_SECONDARY_ACTIVE',
  'BUTTON_TERTIARY', 'BUTTON_TERTIARY_HOVER', 'BUTTON_TERTIARY_ACTIVE',
  'BUTTON_DANGER_PRIMARY', 'BUTTON_DANGER_HOVER', 'BUTTON_DANGER_ACTIVE',
  'BUTTON_DANGER_SECONDARY', 'BUTTON_DISABLED', 'BUTTON_SEPARATOR'
]);


export default function (Lib, ERRORS) {

  // Build the validators object with boot-time validation methods
  const Validators = {

    /********************************************************************
    Validate the merged config object. Throws TypeError on any
    misconfiguration so the module fails at startup, not at call time.

    @param {Object} CONFIG - Merged config for this instance
    @return {void}
    *********************************************************************/
    validateConfig: function (CONFIG) {

      // DEFAULT_FONT_SIZE must be a non-empty string
      if (!Lib.Utils.isString(CONFIG.DEFAULT_FONT_SIZE)) {
        throw new TypeError('rnw-components: DEFAULT_FONT_SIZE must be a string');
      }

      // DEFAULT_FONT_COLOR must be a non-empty string
      if (!Lib.Utils.isString(CONFIG.DEFAULT_FONT_COLOR)) {
        throw new TypeError('rnw-components: DEFAULT_FONT_COLOR must be a string');
      }

      // DEFAULT_FONT_WEIGHT must be a non-empty string
      if (!Lib.Utils.isString(CONFIG.DEFAULT_FONT_WEIGHT)) {
        throw new TypeError('rnw-components: DEFAULT_FONT_WEIGHT must be a string');
      }

      // MIN_HIT_TARGET must be a positive number
      if (!Lib.Utils.isNumber(CONFIG.MIN_HIT_TARGET) || CONFIG.MIN_HIT_TARGET <= 0) {
        throw new TypeError('rnw-components: MIN_HIT_TARGET must be a positive number');
      }

      // BREAKPOINT_ORDER must be a non-empty array of strings
      if (!Array.isArray(CONFIG.BREAKPOINT_ORDER) || Lib.Utils.isEmptyArray(CONFIG.BREAKPOINT_ORDER)) {
        throw new TypeError('rnw-components: BREAKPOINT_ORDER must be a non-empty array');
      }

    },


    /********************************************************************
    Validate the injected shared_libs container. Throws TypeError when
    a required injection is missing.

    @param {Object} shared_libs - The shared library container
    @return {void}
    *********************************************************************/
    validateInjections: function (shared_libs) {

      // React is required - two copies break hooks
      if (Lib.Utils.isNullOrUndefined(shared_libs.React)) {
        throw new TypeError('rnw-components: shared_libs.React is required (the react module)');
      }

      // Utils is required
      if (Lib.Utils.isNullOrUndefined(shared_libs.Utils)) {
        throw new TypeError('rnw-components: shared_libs.Utils is required');
      }

      // Debug is required for render-time warnings
      if (Lib.Utils.isNullOrUndefined(shared_libs.Debug)) {
        throw new TypeError('rnw-components: shared_libs.Debug is required');
      }

      // Device is required for viewport and breakpoint resolution
      if (Lib.Utils.isNullOrUndefined(shared_libs.Device)) {
        throw new TypeError('rnw-components: shared_libs.Device is required (js-rnw-helper-device)');
      }

    },


    /********************************************************************
    Validate a theme contract at build time. Throws TypeError when the
    theme is malformed or missing a required token group. This is a
    boot-time check, so it throws normally.

    @param {Object} theme - The theme contract { Color, Dimension, Font, Breakpoint }
    @return {void}
    *********************************************************************/
    validateTheme: function (theme) {

      // Theme must be an object
      if (!Lib.Utils.isObject(theme)) {
        throw new TypeError('rnw-components: theme must be an object');
      }

      // Color group is required
      if (!Lib.Utils.isObject(theme.Color)) {
        throw new TypeError('rnw-components: theme.Color must be an object');
      }

      // Every required Color token must be a non-empty string. Collect the
      // whole missing set before throwing so one boot reports every gap
      // rather than one per run.
      const missingColors = [];

      for (let c = 0; c < REQUIRED_COLOR_TOKENS.length; c++) {
        const colorKey = REQUIRED_COLOR_TOKENS[c];

        if (!Lib.Utils.isString(theme.Color[colorKey]) || Lib.Utils.isEmptyString(theme.Color[colorKey])) {
          missingColors.push(colorKey);
        }

      }

      // Report the complete missing set in one throw
      if (!Lib.Utils.isEmptyArray(missingColors)) {
        throw new TypeError(
          'rnw-components: theme.Color is missing required token(s): ' +
          missingColors.join(', ') + '. ' + ERRORS.THEME_MISSING_COLOR_TOKEN.type
        );
      }

      // Dimension group is required
      if (!Lib.Utils.isObject(theme.Dimension)) {
        throw new TypeError('rnw-components: theme.Dimension must be an object');
      }

      // Dimension.fontSize is required
      if (!Lib.Utils.isObject(theme.Dimension.fontSize)) {
        throw new TypeError('rnw-components: theme.Dimension.fontSize must be an object');
      }

      // Dimension.space is required
      if (!Lib.Utils.isObject(theme.Dimension.space)) {
        throw new TypeError('rnw-components: theme.Dimension.space must be an object');
      }

      // Dimension.radius is required
      if (!Lib.Utils.isObject(theme.Dimension.radius)) {
        throw new TypeError('rnw-components: theme.Dimension.radius must be an object');
      }

      // Font group is required
      if (!Lib.Utils.isObject(theme.Font)) {
        throw new TypeError('rnw-components: theme.Font must be an object');
      }

      // Font.family is required
      if (!Lib.Utils.isObject(theme.Font.family)) {
        throw new TypeError('rnw-components: theme.Font.family must be an object');
      }

      // Font.weight is required
      if (!Lib.Utils.isObject(theme.Font.weight)) {
        throw new TypeError('rnw-components: theme.Font.weight must be an object');
      }

      // Breakpoint group is required
      if (!Lib.Utils.isObject(theme.Breakpoint)) {
        throw new TypeError('rnw-components: theme.Breakpoint must be an object');
      }

      // TypeSet group is optional but must be an object when present
      if (theme.TypeSet !== undefined && !Lib.Utils.isObject(theme.TypeSet)) {
        throw new TypeError('rnw-components: theme.TypeSet must be an object');
      }

      // Shadow group is optional but must be an object when present
      if (theme.Shadow !== undefined && !Lib.Utils.isObject(theme.Shadow)) {
        throw new TypeError('rnw-components: theme.Shadow must be an object');
      }

      // Motion group is optional but must be an object when present
      if (theme.Motion !== undefined && !Lib.Utils.isObject(theme.Motion)) {
        throw new TypeError('rnw-components: theme.Motion must be an object');
      }

      // Layer group is optional but must be an object when present
      if (theme.Layer !== undefined && !Lib.Utils.isObject(theme.Layer)) {
        throw new TypeError('rnw-components: theme.Layer must be an object');
      }

      // Value-level validation: dimension values must be finite numbers
      // Catches the web projection (rem/em strings) being fed to RNW components
      const UNIT_PATTERN = /(?:rem|em|%|vh|vw|px|pt)$/;
      const dimensionGroups = ['fontSize', 'space', 'radius'];

      // Iterate each dimension group to validate its token values
      for (let g = 0; g < dimensionGroups.length; g++) {
        const groupName = dimensionGroups[g];
        const group = theme.Dimension[groupName];

        if (!Lib.Utils.isObject(group)) {
          continue;
        }

        const keys = Object.keys(group);

        for (let k = 0; k < keys.length; k++) {
          const tokenKey = keys[k];
          const value = group[tokenKey];

          // Reject unit-suffixed strings (web projection leak)
          if (Lib.Utils.isString(value) && UNIT_PATTERN.test(value)) {
            throw new TypeError(
              'rnw-components: theme.Dimension.' + groupName + '.' + tokenKey +
              ' is "' + value + '" (unit-suffixed string). ' +
              'Pass the native projection, not the web projection. ' +
              ERRORS.THEME_VALUE_UNIT_STRING.type
            );
          }

          // Reject NaN and non-finite numbers
          if (!Lib.Utils.isNumber(value)) {
            throw new TypeError(
              'rnw-components: theme.Dimension.' + groupName + '.' + tokenKey +
              ' must be a finite number, got ' + typeof value + '. ' +
              ERRORS.THEME_VALUE_NOT_FINITE.type
            );
          }

        }

      }

    }


  };

  // Return the validators singleton for this instance
  return Validators;

}
