// Info: StructuredListInput molecule [S2 interactive]. A radio/checkbox
// input in a structured list. Uses role="radio" for screen reader
// semantics. Uses A11y for aria-* state and PressKeys for
// keyboard activation.
//   name        -> string (radio group name)
//   value       -> string (input value)
//   checked     -> boolean (whether this input is selected)
//   onChange    -> function (called with the value)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the StructuredListInput molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The StructuredListInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const StructuredListInput = function StructuredListInput (props) {


    const {
      name, value, checked, onChange, style,
      ...rest
    } = props;

    const React = Lib.React;
    const isChecked = !!checked;

    // Handle selection
    const handlePress = function () {
      if (Lib.Utils.isFunction(onChange)) {
        onChange(value);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      checked: isChecked
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'radio',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        accessibilityRole: 'radio',
        accessibilityLabel: name || value
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['justify_center'],
          {
            width: 20,
            height: 20,
            ...Style.utilities['br_radius_max'],
            ...Style.utilities['border_w_width_02'],
            ...(isChecked
              ? Style.utilities['border_color_interactive']
              : Style.utilities['border_color_border_subtle_01'])
          },
          style
        ]
      }, rest),
      isChecked
        ? React.createElement(RNView, {
          style: {
            width: 8,
            height: 8,
            ...Style.utilities['br_radius_04'],
            ...Style.utilities['background_interactive']
          }
        })
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _StructuredListInput = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return StructuredListInput;

}/////////////////////////// Component Factory END /////////////////////////////
