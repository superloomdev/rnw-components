// Info: TextInput atom [S2 interactive]. A themed single-line input.
// Border/radius/padding/font all come from tokens; focus swaps the border
// to the primary color (focus ring). Placeholder color uses a derived muted
// token. Passes accessibilityRole and aria-* for screen readers.
//
// The layer prop selects the field background (field_01, field_02,
// field_03) for the input's surface. When isInvalid is true, the border
// uses the support_error color. The typeSet prop applies a full
// type style to the input text.


// Imports
import { TextInput as RNTextInput } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TextInput atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The TextInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TextInput = function TextInput (props) {

    // Destructure props
    const {
      style, accessibilityLabel, isInvalid, isDisabled, layer, typeSet,
      onFocus, onBlur, ...rest
    } = props;

    const React = Lib.React;
    const [focused, setFocused] = React.useState(false);

    // Resolve field background: layer prop takes precedence, then surface fallback
    const fieldBgKey = layer ? 'background_' + layer : 'background_background';
    const fieldBg = Object.prototype.hasOwnProperty.call(Style.utilities, fieldBgKey)
      ? Style.utilities[fieldBgKey]
      : Style.utilities['background_layer_02'];

    // Resolve type style: typeSet takes precedence, then default type_body01
    const typeKey = typeSet ? 'type_' + typeSet : 'type_body01';
    const typeStyle = Object.prototype.hasOwnProperty.call(Style.utilities, typeKey)
      ? Style.utilities[typeKey]
      : Style.utilities['type_body01'];

    // Resolve border: invalid uses support_error, focused uses primary, else default
    let borderClasses;
    if (isInvalid) {
      const invalidBorderKey = 'border_color_support_error';
      borderClasses = Object.prototype.hasOwnProperty.call(Style.utilities, invalidBorderKey)
        ? [Object.assign({}, Style.utilities[invalidBorderKey], { borderWidth: 1 })]
        : [Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01']];
    } else if (focused) {
      borderClasses = [Style.utilities['border_w_width_01'], Style.utilities['border_color_interactive']];
    } else {
      borderClasses = [Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01']];
    }

    // Resolve base styles from tokens
    const base = [
      fieldBg,
      Style.utilities['br_radius_08'],
      Style.utilities['p_h_spacing_05'],
      Style.utilities['p_v_spacing_03'],
      typeStyle,
      Style.utilities['font_text_primary'],
      ...borderClasses
    ];

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!isDisabled,
      invalid: !!isInvalid
    });

    return Lib.React.createElement(
      RNTextInput,
      Object.assign({
        style: [...base, style],
        placeholderTextColor: Style.tokens.Color.text_secondary,
        editable: !isDisabled,
        accessibilityRole: 'textbox',
        accessibilityLabel: accessibilityLabel,
        onFocus: function (e) {

          setFocused(true);

          if (Lib.Utils.isFunction(onFocus)) {
            onFocus(e);
          }

        },
        onBlur: function (e) {

          setFocused(false);

          if (Lib.Utils.isFunction(onBlur)) {
            onBlur(e);
          }

        }
      }, ariaProps, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TextInput = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TextInput;

}/////////////////////////// Component Factory END /////////////////////////////
