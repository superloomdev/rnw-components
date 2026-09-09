// Info: Loading atom [S1 presentational]. An indeterminate loading indicator
// with role="progressbar" and aria-busy. Uses A11y for aria-* state and
// useAnnounce for screen reader announcements.
//   label       -> string (announced to screen readers)
//   size        -> 'sm' | 'md' | 'lg' (default 'md'); a CSS unit string is rejected
//   style       -> custom style overrides


// Imports
import { View as RNView, ActivityIndicator } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Loading atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Loading component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Loading = function Loading (props) {

    const {
      label, size, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Validate size (D21 item 2): a token or number; a CSS unit string is rejected
    if (!Lib.Utils.isNullOrUndefined(size) && Lib.Utils.isString(size) && /^[0-9]/.test(size)) {
      throw new TypeError('INVALID_LENGTH: ' + ERRORS.INVALID_LENGTH.message + ': Loading.size = ' + String(size));
    }

    // Map size token to ActivityIndicator size
    const aiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'small';

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      busy: true
    });

    // Build aria value props for indeterminate progressbar
    const ariaValueProps = Parts.A11y.value({
      min: 0,
      max: 100,
      now: null
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'progressbar',
        accessibilityLabel: label || 'Loading',
        style: [Style.utilities['flex_row'], Style.utilities['align_center'], Style.utilities['justify_center'], style]
      }, ariaProps, ariaValueProps, rest),
      React.createElement(ActivityIndicator, {
        size: aiSize,
        color: Style.tokens.Color.interactive
      })
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Loading = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Loading;

}/////////////////////////// Component Factory END /////////////////////////////
