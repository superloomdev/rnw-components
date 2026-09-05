// Info: Text atom [S1 presentational]. Maps typography props to generated
// utility classes:
//   typeSet -> type_<typeSet>     (body_01|heading_01|caption_01|...)
//   size    -> font_size_<size>   (xs|sm|md|lg|xl|xxl) [legacy, no type set]
//   color   -> font_<color>       (text_primary|text_secondary|app_primary|...)
//   weight  -> font_weight_<weight> (regular|medium|semibold|bold)
//
// When typeSet is provided, the full Carbon type style is applied (fontSize,
// lineHeight, letterSpacing, fontWeight, fontFamily) instead of collapsing
// to a size plus a global lineHeightRatio.


// Imports
import { Text as RNText, StyleSheet, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Text atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { Direction, Units, Typeface }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Text component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  // Pre-registered with RN's style engine once per system build.
  // Applies iOS writingDirection under RTL when the system direction resolves as right-to-left
  const StaticStyle = StyleSheet.create({
    rtlIOS: { writingDirection: 'rtl' }
  });

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Text = function Text (props) {

    // Destructure token props from pass-through props
    const { typeSet, size, color, weight, align, style, children, ...rest } = props;

    // Resolve token props to utility classes, falling back to defaults
    const classes = [];


    // ---- Type set (full Carbon type style) ----
    if (typeSet) {

      const typeKey = 'type_' + typeSet;
      const typeStyle = Style.utilities[typeKey];

      if (typeStyle) {
        classes.push(typeStyle);
      } else {
        Lib.Debug.warn('unknown type set token, falling back to size', { typeSet: typeSet });
      }

    }


    // ---- Font size (legacy, when no type set is specified) ----
    if (!typeSet) {
      const sizeKey = 'font_size_' + (size || CONFIG.DEFAULT_FONT_SIZE);
      let sizeStyle = Style.utilities[sizeKey];

      if (!sizeStyle) {
        Lib.Debug.warn('unknown font size token, using default', { size: size });
        sizeStyle = Style.utilities['font_size_' + CONFIG.DEFAULT_FONT_SIZE];
      }

      classes.push(sizeStyle);

    }


    // ---- Font color ----
    const colorKey = 'font_' + (color || CONFIG.DEFAULT_FONT_COLOR);
    let colorStyle = Style.utilities[colorKey];

    if (!colorStyle) {
      Lib.Debug.warn('unknown font color token, using default', { color: color });
      colorStyle = Style.utilities['font_' + CONFIG.DEFAULT_FONT_COLOR];
    }

    classes.push(colorStyle);


    // ---- Font weight ----
    const weightKey = 'font_weight_' + (weight || CONFIG.DEFAULT_FONT_WEIGHT);
    let weightStyle = Style.utilities[weightKey];

    if (!weightStyle) {
      Lib.Debug.warn('unknown font weight token, using default', { weight: weight });
      weightStyle = Style.utilities['font_weight_' + CONFIG.DEFAULT_FONT_WEIGHT];
    }

    classes.push(weightStyle);


    // ---- Alignment ----
    if (align) {
      classes.push({ textAlign: align });
    }


    // ---- RTL writing direction (iOS only) ----
    if (Parts.Direction.isRtl() && Platform.OS === 'ios') {
      classes.push(StaticStyle.rtlIOS);
    }


    // Render
    return Lib.React.createElement(
      RNText,
      Object.assign({ style: [...classes, style] }, rest),
      children
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Text = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Text;

}/////////////////////////// Component Factory END /////////////////////////////
