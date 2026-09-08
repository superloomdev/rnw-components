// Info: HeaderGlobalAction molecule [S2 interactive]. A global action button
// in the header. Uses role="button" for screen reader semantics. Uses M1
// (a11y) for aria-* state and PressKeys for keyboard activation.
//   icon        -> string (icon name)
//   onPress     -> function (press handler)
//   label       -> string (accessibility label)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the HeaderGlobalAction molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The HeaderGlobalAction component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const HeaderGlobalAction = function HeaderGlobalAction (props) {


    const {
      icon, onPress, label, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: onPress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: onPress,
        accessibilityRole: 'button',
        accessibilityLabel: label || icon
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['p_a_spacing_03'],
          Style.utilities['br_radius_04'],
          style
        ]
      }, rest),
      icon
        ? React.createElement(Registry.Icon, {
          name: icon,
          typeSet: 'body01',
          color: 'text_primary'
        })
        : React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary'
        }, label || '')
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _HeaderGlobalAction = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return HeaderGlobalAction;

}/////////////////////////// Component Factory END /////////////////////////////
