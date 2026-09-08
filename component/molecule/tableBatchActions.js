// Info: TableBatchActions molecule [S1]. A horizontal toolbar container for action
// buttons, typically used above data tables for batch operations. Uses
// role="toolbar" for screen reader semantics.
//   children    -> action button elements
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableBatchActions molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableBatchActions component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableBatchActions = function TableBatchActions (props) {


    const {
      children, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'toolbar',
        style: [
          Style.utilities['background_layer_01'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['justify_between'],
          style
        ]
      }, rest),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableBatchActions = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableBatchActions;

}/////////////////////////// Component Factory END /////////////////////////////
