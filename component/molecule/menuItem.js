// Info: MenuItem molecule [S2 interactive]. A menu item with role="menuitem".
// Uses A11y for aria-* state and PressKeys for keyboard activation.
//   label       -> string
//   onPress     -> function
//   disabled    -> boolean
//   icon        -> string (optional leading icon)
//   shortcut    -> string (optional shortcut hint)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the MenuItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The MenuItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const MenuItem = function MenuItem (props) {


    const {
      label, onPress, disabled, icon, shortcut, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'menuitem',
      onActivate: onPress,
      disabled: !!disabled
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: disabled ? null : onPress,
        disabled: !!disabled,
        accessibilityRole: 'menuitem',
        accessibilityLabel: label,
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      icon
        ? React.createElement(Registry.Icon, {
          name: icon,
          typeSet: 'label01',
          color: 'text_secondary',
          style: Style.utilities['m_e_spacing_03']
        })
        : null,
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: disabled ? 'text_disabled' : 'text_primary',
        style: { flex: 1 }
      }, label),
      shortcut
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary'
        }, shortcut)
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _MenuItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return MenuItem;

}/////////////////////////// Component Factory END /////////////////////////////
