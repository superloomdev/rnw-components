// Info: NumberInput molecule [S2 interactive]. A TextInput with increment and
// decrement buttons. Uses Platform.select for accessibilityRole: 'spinbutton'
// on web, 'adjustable' on native. Uses A11y for aria-* state and value,
// PressKeys for keyboard activation, ControllableState for
// controlled/uncontrolled value.
//   value         -> number (controlled)
//   defaultValue  -> number (uncontrolled)
//   onChange      -> callback receiving the next number
//   min           -> number
//   max           -> number
//   step          -> number (default 1)
//   disabled      -> boolean
//   invalid       -> boolean


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the NumberInput molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The NumberInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  // a11y is used for aria-* value props on the spinbutton role

  // Role: 'spinbutton' on web, 'adjustable' on native
  const spinRole = Platform.select({
    web: 'spinbutton',
    default: 'adjustable'
  });

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const NumberInput = function NumberInput (props) {


    const {
      value, defaultValue, onChange, min, max, step, disabled, invalid, style,
      accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;

    // Controlled/uncontrolled state
    const state = Parts.ControllableState({
      value: value,
      defaultValue: Lib.Utils.isNumber(defaultValue) ? defaultValue : 0,
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    const isDisabled = !!disabled;
    const isInvalid = !!invalid;
    const stepVal = Lib.Utils.isNumber(step) ? step : 1;
    const minVal = Lib.Utils.isNumber(min) ? min : null;
    const maxVal = Lib.Utils.isNumber(max) ? max : null;

    // Clamp a value to min/max
    const clamp = function (val) {
      let result = val;
      if (minVal !== null && result < minVal) {
        result = minVal;
      }
      if (maxVal !== null && result > maxVal) {
        result = maxVal;
      }
      return result;
    };

    // Increment handler
    const handleIncrement = function () {
      if (isDisabled) {
        return;
      }
      setValue(clamp(resolvedValue + stepVal));
    };

    // Decrement handler
    const handleDecrement = function () {
      if (isDisabled) {
        return;
      }
      setValue(clamp(resolvedValue - stepVal));
    };

    // Build aria value props through the a11y translator (state is handled by TextInput)
    const ariaValueProps = Parts.A11y.value({
      min: minVal,
      max: maxVal,
      now: resolvedValue
    });

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
      // Decrement button
      React.createElement(
        Pressable,
        {
          onPress: handleDecrement,
          disabled: isDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: 'Decrement',
          style: [Style.utilities['p_h_spacing_03'], Style.utilities['p_v_spacing_01']]
        },
        React.createElement(Registry.Text, {
          typeSet: 'body02',
          color: isDisabled ? 'text_disabled' : 'text_primary',
          weight: 'bold'
        }, '-')
      ),
      // Text input
      React.createElement(
        Registry.TextInput,
        Object.assign({
          value: String(resolvedValue),
          onChangeText: function (text) {
            const parsed = Parts.Units.parseNumber(text);
            if (parsed !== null) {
              setValue(clamp(parsed));
            }
          },
          isDisabled: isDisabled,
          isInvalid: isInvalid,
          keyboardType: 'numeric',
          accessibilityRole: spinRole,
          accessibilityLabel: accessibilityLabel,
          style: { flex: 1, textAlign: 'center' }
        }, ariaValueProps, rest)
      ),
      // Increment button
      React.createElement(
        Pressable,
        {
          onPress: handleIncrement,
          disabled: isDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: 'Increment',
          style: [Style.utilities['p_h_spacing_03'], Style.utilities['p_v_spacing_01']]
        },
        React.createElement(Registry.Text, {
          typeSet: 'body02',
          color: isDisabled ? 'text_disabled' : 'text_primary',
          weight: 'bold'
        }, '+')
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _NumberInput = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return NumberInput;

}/////////////////////////// Component Factory END /////////////////////////////
