// Info: HeaderMenuButton molecule [S2 interactive]. A menu toggle button
// for the Header composite with role="button". Uses A11y for
// aria-expanded when active, and PressKeys for keyboard activation.
//   onPress     -> function (press handler)
//   label       -> string (button label)
//   isActive    -> boolean, whether the menu is currently open
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the HeaderMenuButton molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The HeaderMenuButton component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const HeaderMenuButton = function HeaderMenuButton (props) {


    const {
      onPress, label, isActive, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Handle press
    const handlePress = function () {
      if (Lib.Utils.isFunction(onPress)) {
        onPress();
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      expanded: !!isActive
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        accessibilityRole: 'button',
        accessibilityLabel: label || 'Menu',
        style: [
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['br_radius_04'],
          {
            backgroundColor: isActive
              ? (Style.tokens.Color.layer_01)
              : 'transparent'
          },
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'text_primary'
      }, '\u2630')
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _HeaderMenuButton = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return HeaderMenuButton;

}/////////////////////////// Component Factory END /////////////////////////////
