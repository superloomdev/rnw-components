// Info: Checkbox atom [S2 interactive]. A Pressable with role="checkbox"
// that toggles checked state. Supports 'mixed' for indeterminate.
// Uses a11y for aria-* state and PressKeys for Space activation.
//   checked       -> true | false | 'mixed'
//   onChange      -> callback receiving the next boolean
//   disabled      -> boolean
//   label         -> string (rendered as Text child)


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Checkbox atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Checkbox component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Checkbox = function Checkbox (props) {

    const {
      checked, onChange, disabled, label, style,
      accessibilityLabel, ...rest
    } = props;

    const React = Lib.React;

    // Handle toggle: 'mixed' and false both go to true, true goes to false,
    const handlePress = function () {
      if (disabled) {
        return;
      }
      if (Lib.Utils.isFunction(onChange)) {
        onChange(checked === true ? false : true);
      }
    };

    // Build aria state props through the a11y translator,
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      checked: checked
    });

    // Build keyboard activation props (Space activates checkbox role)
    const pressKeysProps = Parts.PressKeys({
      role: 'checkbox',
      onActivate: handlePress,
      disabled: !!disabled
    });

    // Resolve the checkbox box style based on checked state,
    const interactiveColor = Style.tokens.Color.interactive;
    const borderInteractiveColor = Style.tokens.Color.border_interactive;
    const iconDisabledColor = Style.tokens.Color.icon_disabled;
    const borderSubtleColor = Style.tokens.Color.border_subtle_01;

    const boxBase = {
      width: 20,
      height: 20,
      borderRadius: 2,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center'
    };

    let boxStyle;

    if (checked === 'mixed') {
      boxStyle = {
        backgroundColor: interactiveColor,
        borderColor: borderInteractiveColor
      };
    } else if (checked === true) {
      boxStyle = {
        backgroundColor: interactiveColor,
        borderColor: borderInteractiveColor
      };
    } else {
      boxStyle = {
        backgroundColor: 'transparent',
        borderColor: disabled
          ? (iconDisabledColor)
          : (borderSubtleColor)
      };
    }

    // Checkmark for checked state,
    let checkmark = null;

    if (checked === true) {
      checkmark = React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: 'text_on_color',
        weight: 'bold'
      }, '\u2713');
    } else if (checked === 'mixed') {
      checkmark = React.createElement(RNView, {
        style: {
          width: 10,
          height: 2,
          backgroundColor: Style.tokens.Color.text_on_color
        }
      });
    }

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        disabled: !!disabled,
        accessibilityRole: 'checkbox',
        accessibilityLabel: accessibilityLabel || label,
        style: [Style.utilities['flex_row'], Style.utilities['align_center'], style]
      }, ariaProps, pressKeysProps, rest),
      React.createElement(RNView, { style: [boxBase, boxStyle, Style.utilities['m_e_spacing_01']] }, checkmark),
      label ? React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: disabled ? 'text_disabled' : 'text_primary'
      }, label) : null
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Checkbox = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Checkbox;

}/////////////////////////// Component Factory END /////////////////////////////
