// Info: ProgressBar atom [S1 presentational]. A determinate or
// indeterminate progress bar. Determinate shows a filled portion based on
// `value` (0 to 1); indeterminate shows an animated bar when `value` is null.
// Uses aria-valuenow / aria-valuemin / aria-valuemax for screen reader
// state announcement.
//   value       -> 0 to 1 for determinate, null for indeterminate
//   color       -> color.* token name for the fill (default interactive)
//   trackColor  -> color.* token name for the track (default layer_02)
//   height      -> bar height in points (default 4)


// Imports
import { View as RNView, Animated } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ProgressBar atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The ProgressBar component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ProgressBar = function ProgressBar (props) {

    // Destructure props
    const { value, color, trackColor, height, style, ...rest } = props;

    // Resolve colors from token names through the utilities (strict proxy guards)
    const fillColor = Style.utilities['background_' + (color || 'interactive')].backgroundColor;
    const trackFillColor = Style.utilities['background_' + (trackColor || 'layer_02')].backgroundColor;

    // Validate layout dimension (D21 item 2)
    if (!Lib.Utils.isNullOrUndefined(height) && !Parts.Units.isLength(height)) {
      throw new TypeError('INVALID_LENGTH: ' + ERRORS.INVALID_LENGTH.message + ': ProgressBar.height = ' + String(height));
    }

    // Resolve height
    const barHeight = Lib.Utils.isNullOrUndefined(height) ? 4 : height;

    // Build aria value props through the a11y translator
    const ariaProps = Parts.A11y.value({
      min: 0,
      max: 1,
      now: Lib.Utils.isNumber(value) ? Parts.Units.clamp(value, 0, 1) : undefined
    });

    // Indeterminate mode: animated bar
    const React = Lib.React;
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    // Start the indeterminate animation when value is null
    React.useEffect(function () {

      if (Lib.Utils.isNumber(value)) {
        return;
      }

      // Loop the animation for indeterminate mode
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: Style.tokens.Motion.duration_slow_02,
          useNativeDriver: false
        })
      );

      animation.start();

      // Cleanup: stop the animation on unmount
      return function () {
        animation.stop();
      };

    }, [value]);

    // Determinate mode: static fill width
    if (Lib.Utils.isNumber(value)) {
      const clampedValue = Parts.Units.clamp(value, 0, 1);
      const fillPercent = Parts.Units.round(clampedValue * 100);

      return Lib.React.createElement(
        RNView,
        Object.assign({
          accessibilityRole: 'progressbar',
          style: [
            { backgroundColor: trackFillColor, height: barHeight, borderRadius: barHeight / 2, overflow: 'hidden' },
            style
          ]
        }, ariaProps, rest),
        Lib.React.createElement(RNView, {
          style: {
            width: fillPercent + '%',
            height: barHeight,
            backgroundColor: fillColor,
            borderRadius: barHeight / 2
          }
        })
      );

    }

    // Indeterminate mode: animated sliding bar
    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-1, 1],
      extrapolate: 'extend'
    });

    return Lib.React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'progressbar',
        style: [
          { backgroundColor: trackFillColor, height: barHeight, borderRadius: barHeight / 2, overflow: 'hidden' },
          style
        ]
      }, ariaProps, rest),
      Lib.React.createElement(Animated.View, {
        style: {
          width: '40%',
          height: barHeight,
          backgroundColor: fillColor,
          borderRadius: barHeight / 2,
          transform: [{ translateX: translateX }]
        }
      })
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ProgressBar = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ProgressBar;

}/////////////////////////// Component Factory END /////////////////////////////
