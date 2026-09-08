// Info: ControlledPasswordInput molecule [S2 interactive]. A password input
// with a show/hide toggle. Composes Registry.PasswordInput and Registry.Button
// for the toggle. Uses A11y for aria-* state and ControllableState
// for controlled/uncontrolled value.
//   value       -> string (controlled)
//   onChange    -> callback receiving the text value
//   placeholder -> string
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ControlledPasswordInput molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ControlledPasswordInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ControlledPasswordInput = function ControlledPasswordInput (props) {


    const {
      value, onChange, placeholder, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Show/hide password toggle state (always uncontrolled)
    const showState = React.useState(false);
    const showPassword = showState[0];
    const setShowPassword = showState[1];

    const isDisabled = !!disabled;

    return React.createElement(
      RNView,
      {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          style
        ]
      },
      // Password input via Registry.PasswordInput
      React.createElement(
        Registry.PasswordInput,
        Object.assign({
          value: value,
          onChange: onChange,
          placeholder: placeholder,
          disabled: isDisabled,
          secureTextEntry: !showPassword,
          accessibilityRole: 'textbox',
          style: { flex: 1 }
        }, rest)
      ),
      // Show/hide toggle button via Registry.Button
      React.createElement(
        Registry.Button,
        {
          kind: 'ghost',
          onPress: function () {
            setShowPassword(!showPassword);
          },
          disabled: isDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: showPassword ? 'Hide password' : 'Show password',
          style: Style.utilities['m_s_spacing_01']
        },
        showPassword ? 'Hide' : 'Show'
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ControlledPasswordInput = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ControlledPasswordInput;

}/////////////////////////// Component Factory END /////////////////////////////
