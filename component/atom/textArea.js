// Info: TextArea atom [S2 interactive]. A multiline text input that joins
// the frame contract (M-D2 = join). The wrapper View owns the frame through
// Parts.Frame.resolve; the inner TextInput is unframed and suppresses the
// browser outline. Uses a11y for aria-* state and ControllableState for
// controlled/uncontrolled value.
//   value         -> string (controlled)
//   defaultValue  -> string (uncontrolled)
//   onChange      -> callback receiving the text value
//   disabled      -> boolean
//   invalid       -> boolean
//   placeholder   -> string
//   rows          -> number (visual height in lines, default 4)


// Imports
import { View as RNView, TextInput as RNTextInput } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TextArea atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition, Frame, Spec }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The TextArea component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TextArea = function TextArea (props) {

    const {
      value, defaultValue, onChange, disabled, invalid, placeholder, rows,
      layer, typeSet,
      style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;

    // Controlled/uncontrolled state
    const state = Parts.ControllableState({
      value: value,
      defaultValue: defaultValue || '',
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    const isDisabled = !!disabled;
    const isInvalid = !!invalid;

    // Resolve the frame through the shared Frame resolver (M-D2 = join).
    // The wrapper View owns the frame; the inner TextInput is unframed.
    const sheet = Parts.Spec('textArea');
    const frameMode = (Style.tokens.Feedback && Style.tokens.Feedback.field) || 'underline';
    const frameStyles = Parts.Frame.resolve({
      sheet: 'textArea',
      mode: frameMode,
      focused: false,
      invalid: isInvalid,
      disabled: isDisabled
    });

    // Resolve field background: layer prop takes precedence, then disabled, then surface
    const fieldBgKey = layer ? 'background_' + layer : 'background_background';
    const fieldBg = isDisabled
      ? { ...Style.utilities['background_layer_01'] }
      : Style.utilities[fieldBgKey];

    // Resolve type style: typeSet takes precedence, then default type_body01
    const typeKey = typeSet ? 'type_' + typeSet : 'type_body01';
    const typeStyle = Style.utilities[typeKey];

    // Resolve padding from the spec token
    const paddingInline = Style.tokens[sheet.paddingInlineToken] || 16;

    // Wrapper frame styles (the wrapper owns the frame)
    const wrapperStyle = [
      Style.utilities['p_h_spacing_05'],
      Style.utilities['p_v_spacing_03'],
      ...frameStyles,
      fieldBg,
      {
        minHeight: (rows || 4) * 24
      }
    ];

    // Inner input styles (unframed, suppress browser outline)
    const inputStyle = [
      typeStyle,
      {
        paddingInline: paddingInline,
        outlineStyle: 'none',
        outlineWidth: 0,
        borderWidth: 0,
        borderRadius: 0,
        flex: 1,
        textAlignVertical: 'top',
        minHeight: (rows || 4) * 24
      }
    ];

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: isDisabled,
      invalid: isInvalid
    });

    return React.createElement(
      RNView,
      {
        style: [...wrapperStyle, style],
        accessibilityRole: 'group'
      },
      React.createElement(
        RNTextInput,
        Object.assign({
          value: resolvedValue,
          onChangeText: setValue,
          placeholder: placeholder,
          placeholderTextColor: Style.tokens.Color.text_secondary,
          editable: !isDisabled,
          multiline: true,
          numberOfLines: rows || 4,
          accessibilityRole: 'textbox',
          accessibilityLabel: accessibilityLabel,
          style: inputStyle
        }, ariaProps, rest)
      )
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TextArea = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TextArea;

}/////////////////////////// Component Factory END /////////////////////////////
