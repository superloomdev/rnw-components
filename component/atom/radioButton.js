// Info: RadioButton atom [S2 interactive]. A Pressable with role="radio"
// that sets checked state on press. Uses a11y for aria-* state and
// PressKeys for Space activation.
//   checked    -> boolean
//   onChange   -> callback receiving the next boolean (always true)
//   disabled   -> boolean
//   label      -> string (rendered as Text child)


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the RadioButton atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The RadioButton component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const RadioButton = function RadioButton (props) {

    const {
      checked, onChange, disabled, label, style,
      accessibilityLabel, ...rest
    } = props;

    const React = Lib.React;

    // Radio buttons always set to true on press,
    const handlePress = function () {
      if (disabled) {
        return;
      }
      if (Lib.Utils.isFunction(onChange)) {
        onChange(true);
      }
    };

    // Build aria state props through the a11y translator,
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      checked: !!checked
    });

    // Build keyboard activation props (Space activates radio role)
    const pressKeysProps = Parts.PressKeys({
      role: 'radio',
      onActivate: handlePress,
      disabled: !!disabled
    });

    // Resolve the radio circle style,
    const interactiveColor = Style.tokens.Color.interactive;
    const borderInteractiveColor = Style.tokens.Color.border_interactive;
    const iconDisabledColor = Style.tokens.Color.icon_disabled;
    const borderSubtleColor = Style.tokens.Color.border_subtle_01;

    const circleBase = {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center'
    };

    const circleStyle = checked
      ? {
        borderColor: disabled
          ? (iconDisabledColor)
          : (borderInteractiveColor)
      }
      : {
        borderColor: disabled
          ? (iconDisabledColor)
          : (borderSubtleColor)
      };

    // Inner dot for checked state,
    let innerDot = null;

    if (checked) {
      innerDot = React.createElement(RNView, {
        style: {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: disabled
            ? (iconDisabledColor)
            : (interactiveColor)
        }
      });
    }

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        disabled: !!disabled,
        accessibilityRole: 'radio',
        accessibilityLabel: accessibilityLabel || label,
        style: [Style.utilities['flex_row'], Style.utilities['align_center'], style]
      }, ariaProps, pressKeysProps, rest),
      React.createElement(RNView, { style: [circleBase, circleStyle, Style.utilities['m_e_spacing_01']] }, innerDot),
      label ? React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: disabled ? 'text_disabled' : 'text_primary'
      }, label) : null
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _RadioButton = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return RadioButton;

}/////////////////////////// Component Factory END /////////////////////////////
