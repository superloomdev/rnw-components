// Info: OverflowMenuItem molecule [S2 interactive]. A single item in an
// overflow menu. Uses role="menuitem" for screen reader semantics. Uses M1
// (a11y) for aria-* state and PressKeys for keyboard activation.
//   text        -> string (item label)
//   onPress     -> function (press handler)
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the OverflowMenuItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The OverflowMenuItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const OverflowMenuItem = function OverflowMenuItem (props) {


    const {
      text, onPress, disabled, style,
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
        accessibilityLabel: text
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, rest),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: disabled ? 'text_disabled' : 'text_primary',
        style: { flex: 1 }
      }, text)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _OverflowMenuItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return OverflowMenuItem;

}/////////////////////////// Component Factory END /////////////////////////////
