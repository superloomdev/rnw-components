// Info: ModalFooter molecule [S1 presentational]. Footer section of a
// ComposedModal, typically holding action buttons. Composes View atom.
//   children    -> footer content (usually buttons)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ModalFooter molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ModalFooter component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ModalFooter = function ModalFooter (props) {


    const { children, style, ...rest } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        style: [
          Style.utilities['p_h_spacing_06'],
          Style.utilities['p_v_spacing_05'],
          Style.utilities['flex_row'],
          Style.utilities['justify_end'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          { borderTopWidth: 1 },
          style
        ]
      }, rest),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ModalFooter = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ModalFooter;

}/////////////////////////// Component Factory END /////////////////////////////
