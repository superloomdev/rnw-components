// Info: TableContainer molecule [S1]. A max-width wrapper that centers content.
// Uses role="group" for screen reader semantics. Constrains children to
// a configurable maximum width.
//   children    -> content elements
//   maxWidth    -> maximum width in pixels (default 1200)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableContainer molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableContainer component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableContainer = function TableContainer (props) {


    const {
      children, maxWidth, style,
      ...rest
    } = props;

    const React = Lib.React;
    const maxW = Lib.Utils.isNumber(maxWidth) ? maxWidth : 1200;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'group',
        style: [
          {
            width: '100%',
            maxWidth: maxW,
            marginLeft: 'auto',
            marginRight: 'auto'
          },
          Style.utilities['p_h_spacing_05'],
          style
        ]
      }, rest),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableContainer = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableContainer;

}/////////////////////////// Component Factory END /////////////////////////////
