// Info: Numeric and unit normalization for rnw-components.
//
// Owns every numeric conversion the components need, so that no component
// calls Math.*, parseFloat, or parseInt directly. Every magic number the
// conversions depend on (rem base, rounding precision, which style props
// must be numeric) comes from data/style-contract.json by injection, so
// nothing is hardcoded in this file.
//
// Loader pattern: FACTORY part. The components package hands out independent
// instances per build() so two registries can hold different themes at once;
// module-scope state would let one instance's CONFIG leak into another.

/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils and Debug
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - Public Units interface
*********************************************************************/
export default function (shared_libs, config, errors) {

  // Dependencies for this part, by reference from the shared container
  const Lib = {
    Utils: shared_libs.Utils,
    Debug: shared_libs.Debug
  };

  // Intrinsic style contract; required once in components.js and injected here
  const DATA = config.STYLE_CONTRACT;

  // Frozen error catalog, held for parity with every other part
  const ERRORS = errors; // eslint-disable-line no-unused-vars

  // Compiled once per instance; the pattern ships as JSON data, not as code
  const UNIT_PATTERN = new RegExp(DATA.unit_suffix_pattern);

  // The style prop name for background images. React Native 0.86 exposes this
  // under the experimental name; the rename to 'backgroundImage' is a one-line
  // change here when the floor reaches 0.87 (D17).
  const BACKGROUND_IMAGE_PROP = 'experimental_backgroundImage';

  // Build the public interface from the injected dependencies
  return createInterface(Lib, DATA, UNIT_PATTERN, BACKGROUND_IMAGE_PROP);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Build the Units interface over one instance's injected dependencies.

@param {Object} Lib - Dependency container with Utils and Debug
@param {Object} DATA - Parsed data/style-contract.json
@param {RegExp} UNIT_PATTERN - Compiled unit-suffix matcher

@return {Object} - Public Units interface
*********************************************************************/
const createInterface = function (Lib, DATA, UNIT_PATTERN, BACKGROUND_IMAGE_PROP) {


  ///////////////////////////Public Functions START//////////////////////////////
  const Units = {
    // Public Units interface: numeric conversion and native contract enforcement

    // The style prop name for background images (D17). Experimental on 0.86,
    // renamed to 'backgroundImage' at the 0.87 floor.
    BACKGROUND_IMAGE_PROP: BACKGROUND_IMAGE_PROP,


    // ~~~~~~~~~~~~~~~~~~~~ Conversion ~~~~~~~~~~~~~~~~~~~~
    // Turn a raw token value into a number React Native can consume on every
    // platform. A well-formed native projection needs none of this; these exist
    // so a third-party theme cannot put a unit string into a style prop.

    /********************************************************************
    Convert a dimension value to a finite pixel number.

    @param {Number|String} value - Raw token value, e.g. 16 or '0.75rem'

    @return {Number|null} - Pixel number, or null when unconvertible
    *********************************************************************/
    toPx: function (value) {

      // Already numeric: the native projection path, and the common case
      if (Lib.Utils.isNumber(value)) {
        return value;
      }

      // Anything non-string has no unit to strip
      if (!Lib.Utils.isString(value)) {
        return null;
      }

      // Only rem converts without a layout context; em and % need one
      if (value.indexOf('rem') === -1) {
        return null;
      }

      // Scale by the contract's rem base and round to its stated precision
      const parsed = _Units.parseLeadingFloat(value);

      // A malformed string such as 'rem' yields nothing usable
      if (Lib.Utils.isNullOrUndefined(parsed)) {
        return null;
      }

      // Convert rem to pixels using the contract's base and precision
      return Lib.Utils.round(parsed * DATA.rem_base_px, DATA.decimal_precision);

    },


    /********************************************************************
    Derive a line height from a font size and a ratio.

    @param {Number} size - Font size in pixels
    @param {Number} ratio - Line-height ratio

    @return {Number|null} - Rounded line height, or null on bad input
    *********************************************************************/
    lineHeight: function (size, ratio) {

      // Returning null rather than NaN is what stops a bad token silently
      // reaching StyleSheet.create and falling back to a browser default
      if (!Lib.Utils.isNumber(size) || !Lib.Utils.isNumber(ratio)) {
        return null;
      }

      // Scale the font size by the ratio at the contract's precision
      return Lib.Utils.round(size * ratio, DATA.line_height_precision);

    },


    /********************************************************************
    Clamp a number between an inclusive minimum and maximum.

    @param {Number} value - Value to clamp
    @param {Number} min - Inclusive lower bound
    @param {Number} max - Inclusive upper bound

    @return {Number} - Clamped value
    *********************************************************************/
    clamp: function (value, min, max) {

      // Non-numeric input resolves to the lower bound so NaN never propagates
      if (!Lib.Utils.isNumber(value)) {
        return min;
      }

      // Order the comparisons so a min above max still returns a bound
      if (value < min) {
        return min;
      }

      // Value is within bounds or above max, so cap at max otherwise pass through
      return value > max ? max : value;

    },


    /********************************************************************
    Round a number to the nearest integer.

    @param {Number} value - Value to round

    @return {Number} - Rounded value, or 0 on non-numeric input
    *********************************************************************/
    round: function (value) {

      // Non-numeric input resolves to zero so NaN never propagates
      if (!Lib.Utils.isNumber(value)) {
        return 0;
      }

      // Delegate to the platform round now that input is confirmed numeric
      return Math.round(value);

    },


    /********************************************************************
    Round a number up to the nearest integer.

    @param {Number} value - Value to round up

    @return {Number} - Ceiling value, or 0 on non-numeric input
    *********************************************************************/
    ceil: function (value) {

      // Non-numeric input resolves to zero so NaN never propagates
      if (!Lib.Utils.isNumber(value)) {
        return 0;
      }

      // Delegate to the platform ceiling now that input is confirmed numeric
      return Math.ceil(value);

    },


    /********************************************************************
    Parse an integer from a string. Centralizes parseInt so
    components never call it directly.

    @param {String} value - String to parse
    @param {Number} [radix] - Radix (default 10)

    @return {Number|null} - Parsed integer, or null on failure
    *********************************************************************/
    parseInteger: function (value, radix) {

      // Centralized parseInt so no component calls it directly
      const parsed = parseInt(value, radix || 10);

      // Return null on failure so callers never receive NaN
      return Lib.Utils.isNumber(parsed) ? parsed : null;

    },


    /********************************************************************
    Parse a float from a string. Centralizes parseFloat so
    components never call it directly.

    @param {String} value - String to parse

    @return {Number|null} - Parsed float, or null on failure
    *********************************************************************/
    parseNumber: function (value) {

      // Centralized parseFloat so no component calls it directly
      const parsed = parseFloat(value);

      // Return null on failure so callers never receive NaN
      return Lib.Utils.isNumber(parsed) ? parsed : null;

    },


    // ~~~~~~~~~~~~~~~~~~~~ Native Contract ~~~~~~~~~~~~~~~~~~~~
    // The enforcement side of the same contract. React Native on iOS and
    // Android rejects unit strings for these props while web silently accepts
    // them, so the check has to be explicit rather than left to the platform.

    /********************************************************************
    Report whether a style prop and value pair is invalid on native.

    @param {String} prop - Style property name, e.g. 'padding'
    @param {*} value - Candidate style value

    @return {Boolean} - True when the pair would fail on iOS or Android
    *********************************************************************/
    isInvalidOnNative: function (prop, value) {

      // Color and layout-keyword props carry no numeric constraint
      if (!Lib.Utils.inArray(DATA.numeric_style_props, prop)) {
        return false;
      }

      // A unit-suffixed string renders on web and throws on native
      return Lib.Utils.isString(value) && UNIT_PATTERN.test(value);

    }

  };///////////////////////////Public Functions END//////////////////////////////



  ///////////////////////////Private Functions START////////////////////////////
  const _Units = {

    /********************************************************************
    Parse the leading float from a unit-suffixed string.

    @param {String} value - Unit-suffixed string, e.g. '0.75rem'

    @return {Number|null} - The parsed number, or null when absent
    *********************************************************************/
    parseLeadingFloat: function (value) {

      // Number.parseFloat is the one permitted use in the package; every
      // other module reaches this behavior through Units
      const parsed = Number.parseFloat(value);

      // isNumber rejects NaN, which is what parseFloat returns on failure
      return Lib.Utils.isNumber(parsed) ? parsed : null;

    }

  };///////////////////////////Private Functions END/////////////////////////////


  // Return the public Units interface
  return Units;

};/////////////////////////// createInterface END ///////////////////////////////
