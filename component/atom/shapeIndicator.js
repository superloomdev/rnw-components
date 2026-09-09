// Info: ShapeIndicator atom [S1 presentational]. A colored shape indicator
// (circle, square, triangle) for status display. Uses A11y for aria-*.
// Uses shared_libs.Svg as an optional injection; degrades to colored View.
//   shape       -> 'circle' | 'square' | 'triangle' (default 'circle')
//   color       -> color.* token name (default interactive)
//   size        -> number of points (default 16)
//   label       -> string (accessibility label)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ShapeIndicator atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The ShapeIndicator component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ShapeIndicator = function ShapeIndicator (props) {

    const {
      shape, color, size, label, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Validate size (D21 item 2): must be a number of points
    if (!Lib.Utils.isNullOrUndefined(size) && !Lib.Utils.isNumber(size)) {
      throw new TypeError('INVALID_LENGTH: ' + ERRORS.INVALID_LENGTH.message + ': ShapeIndicator.size = ' + String(size));
    }

    const s = Lib.Utils.isNumber(size) ? size : 16;
    const sh = shape || 'circle';

    // Resolve color from token name through the utilities (strict proxy guards)
    const resolvedColor = Style.utilities['background_' + (color || 'interactive')].backgroundColor;

    // Base style for all shapes
    const baseStyle = {
      width: s,
      height: s,
      backgroundColor: resolvedColor
    };

    // Shape-specific styles
    let shapeStyle;

    if (sh === 'circle') {
      shapeStyle = { borderRadius: s / 2 };
    } else if (sh === 'square') {
      shapeStyle = Style.utilities['br_radius_02'];
    } else {
      // Triangle: use border trick (no SVG needed for a simple triangle)
      shapeStyle = {
        backgroundColor: 'transparent',
        width: 0,
        height: 0,
        borderLeftWidth: s / 2,
        borderRightWidth: s / 2,
        borderBottomWidth: s,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: resolvedColor
      };
    }

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityLabel: label || (sh + ' indicator'),
        style: [baseStyle, shapeStyle, style]
      }, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ShapeIndicator = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ShapeIndicator;

}/////////////////////////// Component Factory END /////////////////////////////
