// Info: Slider atom [S2 interactive]. A custom range slider built from View
// and Pressable. React Native removed Slider from core in 0.62 and
// react-native-web does not export it, so the atom uses primitives instead.
// Uses A11y for aria-* state and value, PressKeys for keyboard.
//   value       -> number (controlled)
//   defaultValue-> number (uncontrolled)
//   min         -> number (default 0)
//   max         -> number (default 100)
//   step        -> number (default 1)
//   onChange    -> callback receiving the next number
//   disabled    -> boolean
//   hideTextInput -> boolean (default true; when false, shows a paired NumberInput)


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Slider atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Slider component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // Role: 'slider' on web, 'adjustable' on native
  const sliderRole = Platform.select({
    web: 'slider',
    default: 'adjustable'
  });

  // Track and thumb dimensions
  const TRACK_HEIGHT = 4;
  const THUMB_SIZE = 20;
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Slider = function Slider (props) {

    const {
      value, defaultValue, min, max, step, onChange, disabled, hideTextInput,
      style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;

    // Controlled/uncontrolled state
    const state = Parts.ControllableState({
      value: value,
      defaultValue: Lib.Utils.isNumber(defaultValue) ? defaultValue : (min || 0),
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    const isDisabled = !!disabled;
    const minVal = Lib.Utils.isNumber(min) ? min : 0;
    const maxVal = Lib.Utils.isNumber(max) ? max : 100;
    const stepVal = Lib.Utils.isNumber(step) ? step : 1;

    // Resolve track and thumb colors
    const activeColor = isDisabled
      ? Style.utilities['background_icon_disabled'].backgroundColor
      : Style.utilities['background_interactive'].backgroundColor;
    const inactiveColor = Style.utilities['background_border_subtle_01'].backgroundColor;

    // Build aria state and value props through the a11y translator
    const ariaStateProps = Parts.A11y.state({
      disabled: isDisabled
    });

    // Clamp and round the display value
    const clampedValue = Parts.Units.clamp(resolvedValue, minVal, maxVal);
    const displayText = Parts.Units.round(clampedValue) + '';

    const ariaValueProps = Parts.A11y.value({
      min: minVal,
      max: maxVal,
      now: clampedValue,
      text: displayText
    });

    // Calculate the fill percentage
    const range = maxVal - minVal;
    const fillPercent = range > 0 ? ((clampedValue - minVal) / range) * 100 : 0;

    // Step the value by stepVal on press of left/right track halves
    const onDecrease = function () {
      if (isDisabled) {
        return;
      }
      const next = Parts.Units.clamp(clampedValue - stepVal, minVal, maxVal);
      setValue(next);
    };

    const onIncrease = function () {
      if (isDisabled) {
        return;
      }
      const next = Parts.Units.clamp(clampedValue + stepVal, minVal, maxVal);
      setValue(next);
    };

    // When hideTextInput is false, render a paired number input next to the slider.
    const showTextInput = hideTextInput === false;

    // Build the custom slider from primitives
    const sliderElement = React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: sliderRole,
        accessibilityLabel: accessibilityLabel,
        style: [
          {
            height: THUMB_SIZE + 8,
            justifyContent: 'center',
            position: 'relative'
          },
          style
        ]
      }, ariaStateProps, ariaValueProps, rest),

      // Track background (inactive)
      React.createElement(RNView, {
        style: {
          height: TRACK_HEIGHT,
          backgroundColor: inactiveColor,
          borderRadius: TRACK_HEIGHT / 2,
          width: '100%'
        }
      }),

      // Track fill (active)
      React.createElement(RNView, {
        style: {
          position: 'absolute',
          height: TRACK_HEIGHT,
          backgroundColor: activeColor,
          borderRadius: TRACK_HEIGHT / 2,
          width: fillPercent + '%',
          top: (THUMB_SIZE + 8 - TRACK_HEIGHT) / 2
        }
      }),

      // Thumb indicator
      React.createElement(RNView, {
        style: {
          position: 'absolute',
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_SIZE / 2,
          backgroundColor: activeColor,
          top: 4,
          left: fillPercent + '%'
        }
      }),

      // Left-side pressable (decrease)
      React.createElement(Pressable, {
        onPress: onDecrease,
        disabled: isDisabled,
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '50%'
        },
        accessibilityLabel: 'decrease'
      }),

      // Right-side pressable (increase)
      React.createElement(Pressable, {
        onPress: onIncrease,
        disabled: isDisabled,
        style: {
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '50%'
        },
        accessibilityLabel: 'increase'
      })
    );

    if (!showTextInput) {
      return sliderElement;
    }

    // Render slider + paired text input in a row
    return React.createElement(
      RNView,
      { style: [Style.utilities['flex_row'], Style.utilities['align_center']] },
      React.createElement(RNView, { style: { flex: 1 } }, sliderElement),
      React.createElement(
        Registry.TextInput,
        {
          value: displayText,
          onChangeText: function (text) {
            const num = Number(text);
            if (Lib.Utils.isNumber(num)) {
              setValue(Parts.Units.clamp(num, minVal, maxVal));
            }
          },
          keyboardType: 'numeric',
          accessibilityLabel: accessibilityLabel ? accessibilityLabel + ' value' : undefined,
          style: { width: 60 }
        }
      )
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Slider = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Slider;

}/////////////////////////// Component Factory END /////////////////////////////
