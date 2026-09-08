// Info: MenuItemGroup molecule [S1 presentational]. A group of menu items with
// a label. Uses role="group" for screen reader semantics.
//   label       -> string (group label, optional)
//   children    -> menu item elements
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the MenuItemGroup molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The MenuItemGroup component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const MenuItemGroup = function MenuItemGroup (props) {


    const {
      label, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'group',
        style: style
      }, rest),
      label
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary',
          weight: 'medium',
          style: [
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_01']
          ]
        }, label)
        : null,
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _MenuItemGroup = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return MenuItemGroup;

}/////////////////////////// Component Factory END /////////////////////////////
