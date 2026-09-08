// Info: StructuredListWrapper molecule [S1]. A simple structured list container.
// Uses role="table" for screen reader semantics. Renders children in a
// vertical column layout with border styling.
//   children    -> structured list row elements
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the StructuredListWrapper molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The StructuredListWrapper component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const StructuredListWrapper = function StructuredListWrapper (props) {


    const {
      children, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'table',
        style: [
          Style.utilities['flex_col'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['br_radius_08'],
          { overflow: 'hidden' },
          style
        ]
      }, rest),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _StructuredListWrapper = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return StructuredListWrapper;

}/////////////////////////// Component Factory END /////////////////////////////
