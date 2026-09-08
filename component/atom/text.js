// Info: Text atom [S1 presentational]. Maps typography props to generated
// utility classes:
//   typeSet -> type_<typeSet>     (body01|heading01|caption01|...)
//   color   -> font_<color>       (text_primary|text_secondary|interactive|...)
//   weight  -> font_weight_<weight> (regular|medium|semibold|bold)
//   family  -> font_family_<family> (sans|serif|mono)
//
// When typeSet is provided, the full type style is applied (fontSize,
// lineHeight, letterSpacing, fontWeight, fontFamily) instead of collapsing
// to a size plus a global ratio.


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
    const { typeSet, color, weight, family, align, style, children, ...rest } = props;

    // Resolve token props to utility classes, falling back to defaults
    const classes = [];


    // ---- Type set (full type style: fontSize, lineHeight, letterSpacing,
    //      fontWeight, fontFamily) ----
    const effectiveTypeSet = typeSet || CONFIG.DEFAULT_TYPE_SET;
    const typeKey = 'type_' + effectiveTypeSet;
    const typeStyle = Style.utilities[typeKey];

    if (typeStyle) {
      classes.push(typeStyle);
    } else {
      Lib.Debug.warn('unknown type set token', { typeSet: effectiveTypeSet });
    }


    // ---- Font color ----
    const colorKey = 'font_' + (color || CONFIG.DEFAULT_FONT_COLOR);
    let colorStyle = Style.utilities[colorKey];

    if (!colorStyle) {
      Lib.Debug.warn('unknown font color token, using default', { color: color });
      colorStyle = Style.utilities['font_' + CONFIG.DEFAULT_FONT_COLOR];
    }

    classes.push(colorStyle);


    // ---- Font weight (override on top of the type set) ----
    if (weight) {
      const weightKey = 'font_weight_' + weight;
      const weightStyle = Style.utilities[weightKey];

      if (weightStyle) {
        classes.push(weightStyle);
      } else {
        Lib.Debug.warn('unknown font weight token', { weight: weight });
      }
    }


    // ---- Font family (override on top of the type set) ----
    if (family) {
      const familyKey = 'font_family_' + family;
      const familyStyle = Style.utilities[familyKey];

      if (familyStyle) {
        classes.push(familyStyle);
      } else {
        Lib.Debug.warn('unknown font family token', { family: family });
      }
    }


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
