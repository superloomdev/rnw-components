// Info: IconSwitch molecule [S2 interactive]. A switch with an icon. Uses
// role="switch" for screen reader semantics. Uses A11y for aria-* state
// and PressKeys for keyboard activation.
//   icon        -> string (icon name)
//   checked     -> boolean (whether the switch is on)
//   onToggle    -> function (called with next boolean)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the IconSwitch molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The IconSwitch component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const IconSwitch = function IconSwitch (props) {


    const {
      icon, checked, onToggle, style,
      ...rest
    } = props;

    const React = Lib.React;
    const isChecked = !!checked;

    // Handle toggle
    const handlePress = function () {
      if (Lib.Utils.isFunction(onToggle)) {
        onToggle(!isChecked);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      checked: isChecked
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'switch',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        accessibilityRole: 'switch',
        accessibilityLabel: icon
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          {
            width: 48,
            height: 28,
            ...Style.utilities['br_radius_max'],
            ...(isChecked
              ? Style.utilities['background_interactive']
              : Style.utilities['background_layer_01']),
            padding: 2
          },
          style
        ]
      }, rest),
      icon
        ? React.createElement(Registry.Icon, {
          name: icon,
          typeSet: 'label01',
          color: isChecked ? 'text_on_color' : 'text_secondary'
        })
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _IconSwitch = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return IconSwitch;

}/////////////////////////// Component Factory END /////////////////////////////
