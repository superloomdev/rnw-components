// Info: MenuItemDivider molecule [S1 presentational]. A horizontal separator
// within a menu. Uses role="separator". No mechanisms needed.
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the MenuItemDivider molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The MenuItemDivider component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const MenuItemDivider = function MenuItemDivider (props) {


    const { style, ...rest } = props;

    const React = Lib.React;

    return React.createElement(RNView, Object.assign({
      accessibilityRole: 'separator',
      style: [
        {
          height: 1,
          backgroundColor: Style.tokens.Color.border_subtle_01,
          marginVertical: 4
        },
        style
      ]
    }, rest));
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _MenuItemDivider = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return MenuItemDivider;

}/////////////////////////// Component Factory END /////////////////////////////
