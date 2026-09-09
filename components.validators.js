// Info: Validators for rnw-components.
//
// Receives Lib and ERRORS by injection from the loader.
// Never self-requires the error catalog or data files.
// Boot-time validation throws TypeError; render-time validation is
// handled inside component factories via Lib.Debug.warn + fallback.

// Unit-suffix pattern for rejecting web projection leaks into native props
const UNIT_PATTERN = /(?:rem|em|%|vh|vw|px|pt)$/;


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

      // DEFAULT_TYPE_SET must be a non-empty string
      if (!Lib.Utils.isString(CONFIG.DEFAULT_TYPE_SET)) {
        throw new TypeError('rnw-components: DEFAULT_TYPE_SET must be a string');
      }

      // DEFAULT_FONT_COLOR must be a non-empty string
      if (!Lib.Utils.isString(CONFIG.DEFAULT_FONT_COLOR)) {
        throw new TypeError('rnw-components: DEFAULT_FONT_COLOR must be a string');
      }

      // DEFAULT_FONT_FAMILY must be a non-empty string
      if (!Lib.Utils.isString(CONFIG.DEFAULT_FONT_FAMILY)) {
        throw new TypeError('rnw-components: DEFAULT_FONT_FAMILY must be a string');
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
        throw new TypeError(ERRORS.REACT_NOT_INJECTED.message);
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
        throw new TypeError(ERRORS.DEVICE_NOT_INJECTED.message);
      }

      // Themer is required for contract validation and theme building
      if (Lib.Utils.isNullOrUndefined(shared_libs.Themer)) {
        throw new TypeError(ERRORS.THEMER_UNAVAILABLE.message);
      }

    },


    /********************************************************************
    Validate a built theme at build time. Throws TypeError when the
    built object is malformed or missing required tokens. This is a
    boot-time check, so it throws normally.

    @param {Object} built - The Themer.buildTheme() result with a flat
                            tokens map
    @param {Object} Themer - The Themer engine (for validateContract)
    @param {Object} contractInfo - { REQUIRED_TOKENS, SUPPORTED_TOKENS }
    @return {void}
    *********************************************************************/
    validateBuilt: function (built, Themer, contractInfo) {

      // The built result must be an object
      if (!Lib.Utils.isObject(built)) {
        throw new TypeError('rnw-components: built theme must be an object');
      }

      // The tokens map must be a plain object
      if (!Lib.Utils.isObject(built.tokens)) {
        throw new TypeError(ERRORS.THEME_MISSING_TOKENS.message);
      }

      // Validate the contract through the Themer engine
      const result = Themer.validateContract(built, {
        required: contractInfo.REQUIRED_TOKENS,
        supported: contractInfo.SUPPORTED_TOKENS
      });

      // Filter to structural errors only (missing required tokens).
      // CONTRACT_INVALID_VALUE is skipped because validateContract checks
      // raw contract values, but built.tokens contains platform-projected
      // values (e.g. type sets emitted as {fontSize,lineHeight,...} instead
      // of {type_set:true,font_size,...}). Value validation already ran
      // inside buildTheme before projection.
      // CONTRACT_UNKNOWN_TOKEN is collected separately for a warning,
      // not a throw: a theme may carry extra tokens the component system
      // does not know about, and those are ignored, not fatal.
      const structuralErrors = [];
      const unknownTokens = [];
      if (!Lib.Utils.isEmptyArray(result.errors)) {
        for (let i = 0; i < result.errors.length; i++) {
          if (result.errors[i].code === 'CONTRACT_INVALID_VALUE') {
            continue;
          }
          if (result.errors[i].code === 'CONTRACT_UNKNOWN_TOKEN') {
            unknownTokens.push(result.errors[i].token);
            continue;
          }
          structuralErrors.push(result.errors[i]);
        }
      }

      // Collect all structural errors and throw once with the full list
      if (!Lib.Utils.isEmptyArray(structuralErrors)) {

        // Group error tokens by their error code
        const byCode = {};
        for (let i = 0; i < structuralErrors.length; i++) {
          const err = structuralErrors[i];
          if (!byCode[err.code]) {
            byCode[err.code] = [];
          }
          byCode[err.code].push(err.token);
        }

        // Build the message listing every token grouped by code
        const parts = [];
        const codes = Object.keys(byCode);
        for (let c = 0; c < codes.length; c++) {
          parts.push(codes[c] + ': ' + byCode[codes[c]].join(', '));
        }

        throw new TypeError(
          ERRORS.THEME_MISSING_TOKENS.message + ': ' + parts.join('; ')
        );
      }

      // Warn once for unsupported tokens (not errors, just warnings).
      // Unknown tokens (not in the contract) are sorted and warned together.
      if (!Lib.Utils.isEmptyArray(unknownTokens)) {
        unknownTokens.sort();
        Lib.Debug.warn('rnw-components: unsupported tokens ignored', { tokens: unknownTokens });
      }
      if (!Lib.Utils.isEmptyArray(result.warnings)) {
        const tokens = result.warnings.map(function (w) {
          return w.token;
        });
        Lib.Debug.warn('rnw-components: unsupported tokens ignored', { tokens: tokens });
      }

      // Defense in depth: reject unit-suffixed strings in number-typed groups.
      // The Themer contract already enforces this, but this catches a
      // third-party theme that bypasses the engine.
      const tokenNames = Object.keys(built.tokens);
      for (let t = 0; t < tokenNames.length; t++) {
        const name = tokenNames[t];
        const value = built.tokens[name];

        // Only check number-typed groups: spacing, shape, border, focus, size
        if (name.indexOf('spacing.') === 0 ||
            name.indexOf('shape.') === 0 ||
            name.indexOf('border.') === 0 ||
            name.indexOf('focus.') === 0 ||
            name.indexOf('size.') === 0) {

          // Reject unit-suffixed strings (web projection leak)
          if (Lib.Utils.isString(value) && UNIT_PATTERN.test(value)) {
            throw new TypeError(
              'rnw-components: token "' + name + '" is "' + value +
              '" (unit-suffixed string). ' + ERRORS.THEME_VALUE_UNIT_STRING.message
            );
          }
        }
      }

    }


  };

  // Return the validators singleton for this instance
  return Validators;

}
