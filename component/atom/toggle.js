// Info: Toggle atom [S2 interactive]. Wraps react-native Switch with token
// consumption for the track and thumb colors. Passes accessibilityRole="switch"
// and uses aria-checked for screen reader state announcement. Uses
// PressKeys for Space activation on web where the switch role needs it.
//   value         -> boolean, whether the toggle is on
//   onValueChange -> callback when the value changes
//   disabled      -> boolean, whether the toggle is non-interactive


// Imports
import { Switch as RNSwitch } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Toggle atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Toggle component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Toggle = function Toggle (props) {

    // Destructure props
    const {
      value, onValueChange, disabled, style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;

    // Handle keyboard activation for the switch role
    const handleActivate = function () {
      if (disabled) {
        return;
      }
      if (Lib.Utils.isFunction(onValueChange)) {
        onValueChange(!value);
      }
    };

    // Build keyboard activation props (Space activates switch role)
    const pressKeysProps = Parts.PressKeys({
      role: 'switch',
      onActivate: handleActivate,
      disabled: !!disabled
    });

    // Resolve colors from tokens
    const colorMap = Style.tokens.Color;

    // Use Carbon-specific tokens when available, fall back to legacy tokens
    const trackOnColor = colorMap.interactive || colorMap.APP_PRIMARY;
    const trackOffColor = colorMap.border_subtle_01 || colorMap.BACKGROUND_SECONDARY;

    // Thumb color: white or surface
    const thumbColor = colorMap.background || colorMap.BACKGROUND_PRIMARY;

    // Disabled colors are dimmed
    const disabledTrackColor = colorMap.border_subtle_01 || colorMap.BACKGROUND_SECONDARY;
    const disabledThumbColor = colorMap.icon_disabled || colorMap.TEXT_DISABLED;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      checked: !!value
    });

    // Resolve the current thumb color for both active and inactive states.
    // RNW's Switch uses activeThumbColor when value is true and thumbColor
    // when value is false; omitting activeThumbColor lets the RNW default
    // (a Material teal) show through.
    const resolvedThumbColor = disabled ? disabledThumbColor : thumbColor;

    return React.createElement(
      RNSwitch,
      Object.assign({
        value: !!value,
        onValueChange: disabled ? null : onValueChange,
        disabled: !!disabled,
        trackColor: { true: disabled ? disabledTrackColor : trackOnColor, false: disabled ? disabledTrackColor : trackOffColor },
        thumbColor: resolvedThumbColor,
        activeThumbColor: resolvedThumbColor,
        accessibilityRole: 'switch',
        accessibilityLabel: accessibilityLabel,
        style: style
      }, ariaProps, pressKeysProps, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Toggle = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Toggle;

}/////////////////////////// Component Factory END /////////////////////////////
