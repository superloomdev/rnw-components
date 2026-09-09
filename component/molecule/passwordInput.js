// Info: PasswordInput molecule [S2 interactive]. A TextInput with a show/hide
// password toggle button. Uses A11y for aria-* state and M8
// (useControllableState) for controlled/uncontrolled value.
//   value         -> string (controlled)
//   defaultValue  -> string (uncontrolled)
//   onChange      -> callback receiving the text value
//   placeholder   -> string
//   disabled      -> boolean
//   invalid       -> boolean


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the PasswordInput molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The PasswordInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const PasswordInput = function PasswordInput (props) {


    const {
      value, defaultValue, onChange, placeholder, disabled, invalid, style,
      accessibilityLabel,
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

    // Show/hide password toggle state (always uncontrolled)
    const showState = React.useState(false);
    const showPassword = showState[0];
    const setShowPassword = showState[1];

    const isDisabled = !!disabled;
    const isInvalid = !!invalid;

    return React.createElement(
      RNView,
      {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          isInvalid
            ? { ...Style.utilities['border_color_support_error'] }
            : null,
          isDisabled
            ? { ...Style.utilities['background_layer_01'] }
            : Style.utilities['background_layer_02'],
          style
        ]
      },
      // Password text input
      React.createElement(
        Registry.TextInput,
        Object.assign({
          value: resolvedValue,
          onChangeText: setValue,
          placeholder: placeholder,
          isDisabled: isDisabled,
          isInvalid: isInvalid,
          secureTextEntry: !showPassword,
          accessibilityRole: 'textbox',
          accessibilityLabel: accessibilityLabel,
          style: { flex: 1 }
        }, rest)
      ),
      // Show/hide toggle button
      React.createElement(
        Pressable,
        {
          onPress: function () {
            setShowPassword(!showPassword);
          },
          disabled: isDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: showPassword ? 'Hide password' : 'Show password',
          style: Style.utilities['m_s_spacing_01']
        },
        React.createElement(Registry.Icon, {
          name: showPassword ? 'eye-off' : 'eye',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _PasswordInput = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return PasswordInput;

}/////////////////////////// Component Factory END /////////////////////////////
