// Info: IconButton molecule [S2 interactive]. A button with only an icon.
// Uses A11y for aria-* state and AnchoredPosition when used
// as an anchor for overlays. Composes Icon atom.
//   name        -> string (icon glyph name)
//   onPress     -> function
//   disabled    -> boolean
//   size        -> string (icon size token, default 'md')
//   color       -> string (icon color token)
//   label       -> string (accessibility label, required)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the IconButton molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The IconButton component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const IconButton = function IconButton (props) {


    const {
      name, onPress, disabled, size, color, label, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: disabled ? null : onPress,
        disabled: !!disabled,
        accessibilityRole: 'button',
        accessibilityLabel: label,
        style: [
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['br_radius_08'],
          style
        ]
      }, ariaProps, rest),
      React.createElement(Registry.Icon, {
        name: name,
        size: size || 'md',
        color: color || 'text_primary'
      })
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _IconButton = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return IconButton;

}/////////////////////////// Component Factory END /////////////////////////////
