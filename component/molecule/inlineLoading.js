// Info: InlineLoading molecule [S1 presentational]. A small inline loading
// indicator with optional status text. Uses A11y and useAnnounce.
//   status      -> 'active' | 'inactive' | 'error' (default 'active')
//   label       -> string (loading text, default 'Loading...')
//   style       -> custom style overrides


// Imports
import { View as RNView, ActivityIndicator } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the InlineLoading molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The InlineLoading component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const InlineLoading = function InlineLoading (props) {


    const {
      status, label, style,
      ...rest
    } = props;

    const React = Lib.React;
    const st = status || 'active';

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      busy: st === 'active'
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'progressbar',
        accessibilityLabel: label || 'Loading',
        style: [Style.utilities['flex_row'], Style.utilities['align_center'], style]
      }, ariaProps, rest),
      st === 'active'
        ? React.createElement(ActivityIndicator, {
          size: 'small',
          color: Style.tokens.Color.interactive,
          style: Style.utilities['m_e_spacing_01']
        })
        : null,
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: st === 'error' ? 'support_error' : 'text_secondary'
      }, label || (st === 'active' ? 'Loading...' : st === 'error' ? 'Error' : 'Loaded'))
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _InlineLoading = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return InlineLoading;

}/////////////////////////// Component Factory END /////////////////////////////
