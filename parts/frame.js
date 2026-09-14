// Info: Frame owner mechanism part. Resolves the border, background, and
// radius style array for a field composite's wrapper from the textInput
// spec sheet. The wrapper owns the frame; the inner TextInput renders
// unframed. State precedence: disabled > invalid > focused > rest.
//
// Loader pattern: FACTORY part. Uniform parts signature.

/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils and Debug
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - Public Frame interface: { resolve, setStyle }
*********************************************************************/
import SPEC from '../data/component-spec.js';

export default function (shared_libs, config, errors) {

  const ERRORS = errors; // eslint-disable-line no-unused-vars

  // Style.utilities is built after Parts; setStyle() wires it in.
  const styleRef = { utilities: null };

  /********************************************************************
  Wire the built Style object so resolve() can look up utilities.

  @param {Object} style - { utilities, tokens, breakpoint }
  *********************************************************************/
  function setStyle (style) {

    styleRef.utilities = style.utilities;

  }

  /********************************************************************
  Resolve the frame style array for a field composite wrapper.

  @param {Object} opts - { mode, focused, invalid, disabled }
    mode     'underline' | 'outline' (from feedback.field token)
    focused  boolean
    invalid  boolean
    disabled boolean
  @return {Array} - Style utility objects for the wrapper frame
  @throws {TypeError} - If a derived utility key does not exist
  *********************************************************************/
  function resolve (opts) {

    const u = styleRef.utilities;
    if (!u) {
      throw new TypeError('Frame.resolve called before setStyle');
    }

    const sheet = SPEC.textInput;
    const mode = opts.mode || 'underline';
    const focused = !!opts.focused;
    const invalid = !!opts.invalid;
    const disabled = !!opts.disabled;

    // State precedence: disabled > invalid > focused > rest
    let state;
    if (disabled) {
      state = 'disabled';
    } else if (invalid) {
      state = 'invalid';
    } else if (focused) {
      state = 'focus';
    } else {
      state = 'rest';
    }

    const stateEntry = sheet.states[state];

    // Derive utility keys by stripping the 'color.' prefix
    const borderToken = stateEntry.border.replace(/^color\./, '');
    const backgroundToken = stateEntry.background.replace(/^color\./, '');
    const textToken = stateEntry.text.replace(/^color\./, '');

    const borderUtilityKey = 'border_color_' + borderToken;
    const backgroundUtilityKey = 'background_' + backgroundToken;
    const textUtilityKey = 'font_' + textToken;

    // Border side utility: underline = bottom only, outline = four sides
    const borderSideKey = mode === 'underline'
      ? 'border_w_b_width_01'
      : 'border_w_width_01';

    // Every utility key must exist; throw naming the key otherwise
    const borderSide = u[borderSideKey];
    if (!borderSide) {
      throw new TypeError('Frame.resolve: missing utility "' + borderSideKey + '"');
    }

    const borderColor = u[borderUtilityKey];
    if (!borderColor) {
      throw new TypeError('Frame.resolve: missing utility "' + borderUtilityKey + '"');
    }

    const background = u[backgroundUtilityKey];
    if (!background) {
      throw new TypeError('Frame.resolve: missing utility "' + backgroundUtilityKey + '"');
    }

    const textColor = u[textUtilityKey];
    if (!textColor) {
      throw new TypeError('Frame.resolve: missing utility "' + textUtilityKey + '"');
    }

    const radius = u['br_radius_00'];
    if (!radius) {
      throw new TypeError('Frame.resolve: missing utility "br_radius_00"');
    }

    return [
      radius,
      borderSide,
      borderColor,
      background,
      textColor
    ];

  }

  return Object.freeze({ resolve, setStyle });

}/////////////////////////// Module-Loader END /////////////////////////////////
