// Info: NotificationActionButton molecule [S2 interactive]. An action button
// in a notification. Uses role="button" for screen reader semantics. Uses M1
// (a11y) for aria-* state and PressKeys for keyboard activation.
//   text        -> string (button label)
//   onPress     -> function (press handler)
//   kind        -> string (button kind, optional)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the NotificationActionButton molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The NotificationActionButton component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const NotificationActionButton = function NotificationActionButton (props) {


    const {
      text, onPress, kind, style,
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
        accessibilityLabel: text
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['br_radius_08'],
          {
            backgroundColor: kind === 'primary'
              ? Style.utilities['background_interactive'].backgroundColor
              : 'transparent',
            borderWidth: kind === 'primary' ? 0 : 1,
            ...Style.utilities['border_color_border_subtle_01']
          },
          style
        ]
      }, rest),
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: kind === 'primary' ? 'text_on_color' : 'text_primary',
        weight: 'medium'
      }, text)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _NotificationActionButton = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return NotificationActionButton;

}/////////////////////////// Component Factory END /////////////////////////////
