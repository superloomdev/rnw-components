// Info: The token -> atomic-utility-style generator. Given the reshaped
// theme groups ({ Color, Spacing, Size, Shape, Border, Focus, Motion,
// Feedback, Shadow, TypeSet, Font, Breakpoint }) and a breakpoint key,
// it produces a Tailwind-like stylesheet of utility classes that
// components consume by name. Regenerated whenever the theme changes
// (the runtime-theming seam).
//
// Spacing utilities are LOGICAL (start/end), so layouts mirror correctly under
// RTL with no per-component work. Each breakpoint generates its own utility set
// so components can switch sets without regenerating styles on resize.
//
// Type set utilities preserve the full type style (fontSize, lineHeight,
// letterSpacing, fontWeight, fontFamily) as emitted by the engine. The
// fontFamily field is a role (sans, serif, mono); it is resolved to a concrete
// family through Font.family[role] here, then through Parts.Typeface.
//
// Every color.* token generates background_, font_, and border_color_
// utilities by its verbatim name. Border utilities separate width/side from
// color so a selected top border cannot become an all-side border.
//
// Pure function, no side effects. Called by build() once per breakpoint.

// Imports
import { StyleSheet as RNStyleSheet } from 'react-native';


// Build the padding style object for a logical/physical side
const paddingFor = function (side, value) {

  switch (side) {
  case 'a': return { padding: value };
  case 'h': return { paddingHorizontal: value };
  case 'v': return { paddingVertical: value };
  case 't': return { paddingTop: value };
  case 'b': return { paddingBottom: value };
  case 's': return { paddingInlineStart: value };  // RTL-aware, RNW-supported
  case 'e': return { paddingInlineEnd: value };     // RTL-aware, RNW-supported
  case 'r': return { paddingRight: value };
  case 'l': return { paddingLeft: value };
  default: return {};
  }

};


// Build the margin style object for a logical/physical side
const marginFor = function (side, value) {

  switch (side) {
  case 'a': return { margin: value };
  case 'h': return { marginHorizontal: value };
  case 'v': return { marginVertical: value };
  case 't': return { marginTop: value };
  case 'b': return { marginBottom: value };
  case 's': return { marginInlineStart: value };  // RTL-aware, RNW-supported
  case 'e': return { marginInlineEnd: value };     // RTL-aware, RNW-supported
  case 'r': return { marginRight: value };
  case 'l': return { marginLeft: value };
  default: return {};
  }

};


// Logical and physical sides for spacing utilities
const SIDES = ['a', 'h', 'v', 't', 'b', 's', 'e', 'r', 'l'];

// Border sides for border width utilities
const BORDER_SIDES = ['a', 't', 'b', 's', 'e', 'r', 'l'];


/********************************************************************
Generate the atomic utility stylesheet from a theme for a specific
breakpoint. The breakpoint key is accepted for future per-breakpoint
spacing scale adjustments; currently all breakpoints share the same
space tokens.

@param {Object} theme      - Reshaped internal groups { Color, Spacing,
                              Size, Shape, Border, Focus, Motion,
                              Feedback, Shadow, TypeSet, Font, Breakpoint }
@param {String} breakpoint - Breakpoint key (e.g. 'sm', 'md', 'lg')
@param {Object} Parts      - Mechanism parts; uses Parts.Typeface for
                              font weight resolution

@return {Object} - StyleSheet of utility classes keyed by name
*********************************************************************/
export default function generateCommonStyles (theme, breakpoint, Parts) {

  const Color = theme.Color || {};
  const Spacing = theme.Spacing || {};
  const Size = theme.Size || {};
  const Shape = theme.Shape || {};
  const Border = theme.Border || {};
  const Focus = theme.Focus || {};
  const Shadow = theme.Shadow || {};
  const TypeSet = theme.TypeSet || {};
  const Font = theme.Font || {};

  const styles = {};


  // ~~~~~~~~~~ Color utilities (every color.* token) ~~~~~~~~~~
  // Generate background_, font_, and border_color_ utilities for every
  // color token in the theme, using their verbatim names.
  const colorKeys = Object.keys(Color);

  for (let i = 0; i < colorKeys.length; i++) {
    const key = colorKeys[i];
    const value = Color[key];

    // Only generate utilities for string (hex) color values
    if (typeof value !== 'string') {
      continue;
    }

    // Background: background_<name>
    styles['background_' + key] = { backgroundColor: value };

    // Font color: font_<name>
    styles['font_' + key] = { color: value };

    // Border color: border_color_<name>
    styles['border_color_' + key] = { borderColor: value };
  }


  // ~~~~~~~~~~ Type sets (full type styles as emitted by the engine) ~~~~~~~~~~
  // Each type set utility carries fontSize, lineHeight, letterSpacing,
  // fontWeight, and fontFamily. The fontFamily field is a role (sans, serif,
  // mono); it is resolved to a concrete family through Font.family[role].
  const typeKeys = Object.keys(TypeSet);

  for (let i = 0; i < typeKeys.length; i++) {
    const key = typeKeys[i];
    const ts = TypeSet[key];

    if (!ts || typeof ts !== 'object') {
      continue;
    }

    const style = {};

    // Font size (already a number from the native projection)
    if (typeof ts.fontSize === 'number') {
      style.fontSize = ts.fontSize;
    }

    // Line height (already a number from the native projection)
    if (typeof ts.lineHeight === 'number') {
      style.lineHeight = ts.lineHeight;
    }

    // Letter spacing (already a number from the native projection)
    if (typeof ts.letterSpacing === 'number') {
      style.letterSpacing = ts.letterSpacing;
    }

    // Font weight and family resolution
    if (ts.fontWeight !== undefined) {

      // Resolve the font family role to a concrete family name
      const role = ts.fontFamily || 'sans';
      const familyName = (Font.family && Font.family[role]) || role;

      // Use Typeface.styleFor to handle synthesizing vs per-weight-face families
      // Typeface.styleFor expects (role, weight, Font) but the type set already
      // has the resolved weight value, so we pass the family directly
      if (Parts.Typeface.isSynthesizing(familyName)) {
        style.fontFamily = familyName;
        style.fontWeight = ts.fontWeight;
      } else {
        style.fontFamily = familyName;
      }
    } else if (ts.fontFamily) {
      // Family without weight
      const role = ts.fontFamily;
      const familyName = (Font.family && Font.family[role]) || role;
      if (familyName) {
        style.fontFamily = familyName;
      }
    }

    styles['type_' + key] = style;
  }


  // ~~~~~~~~~~ Font weights (resolved through Parts.Typeface) ~~~~~~~~~~
  if (Font.weight && typeof Font.weight === 'object') {
    const weightKeys = Object.keys(Font.weight);

    for (let i = 0; i < weightKeys.length; i++) {
      const w = weightKeys[i];

      // Typeface.styleFor returns { fontFamily } for per-weight-face families
      // or { fontFamily, fontWeight } for synthesizing families (System, etc.)
      styles['font_weight_' + w] = Parts.Typeface.styleFor('sans', Font.weight[w], Font);
    }
  }


  // ~~~~~~~~~~ Font families ~~~~~~~~~~
  if (Font.family && typeof Font.family === 'object') {
    const familyKeys = Object.keys(Font.family);

    for (let i = 0; i < familyKeys.length; i++) {
      const key = familyKeys[i];
      const family = Font.family[key];

      if (typeof family === 'string') {
        styles['font_family_' + key] = { fontFamily: family };
      }
    }
  }


  // ~~~~~~~~~~ Focus ring (D17: outline* props) ~~~~~~~~~~
  // The focus ring uses outline* props which draw outside the border box
  // without affecting layout, exactly like CSS outline.
  if (Focus.width !== undefined && Focus.offset !== undefined && Color.focus !== undefined) {
    styles['focus_ring'] = {
      outlineWidth: Focus.width,
      outlineColor: Color.focus,
      outlineOffset: Focus.offset,
      outlineStyle: 'solid'
    };
  }


  // ~~~~~~~~~~ Shadow utilities ~~~~~~~~~~
  // Shadow utilities from the Shadow group. On native, these use
  // shadowColor/shadowOffset/shadowRadius/shadowOpacity/elevation.
  // On web, they use boxShadow.
  const shadowKeys = Object.keys(Shadow);

  for (let i = 0; i < shadowKeys.length; i++) {
    const key = shadowKeys[i];
    const shadow = Shadow[key];

    if (typeof shadow === 'string') {
      // CSS box-shadow string (used in box_shadow mode)
      styles['shadow_' + key] = { boxShadow: shadow };
    } else if (shadow && typeof shadow === 'object') {
      // Native shadow object
      styles['shadow_' + key] = shadow;
    }
  }


  // ~~~~~~~~~~ Size utilities (size.* as { width, height }) ~~~~~~~~~~
  const sizeKeys = Object.keys(Size);

  for (let i = 0; i < sizeKeys.length; i++) {
    const key = sizeKeys[i];
    const value = Size[key];

    if (typeof value === 'number') {
      styles['size_' + key] = { width: value, height: value };
    }
  }


  // ~~~~~~~~~~ Radii (shape.radius_*) ~~~~~~~~~~
  const radiusKeys = Object.keys(Shape);

  for (let i = 0; i < radiusKeys.length; i++) {
    const key = radiusKeys[i];
    const value = Shape[key];

    if (typeof value === 'number') {
      styles['br_' + key] = { borderRadius: value };
    }
  }


  // ~~~~~~~~~~ Border widths (border.width_*) ~~~~~~~~~~
  // Border width is separated from border color so a selected top border
  // cannot become an all-side border. Components combine width + side +
  // color utilities.
  const borderWidthKeys = Object.keys(Border);

  for (let w = 0; w < borderWidthKeys.length; w++) {
    const widthKey = borderWidthKeys[w];
    const width = Border[widthKey];

    if (typeof width !== 'number') {
      continue;
    }

    // All-sides width: border_w_<name>
    styles['border_w_' + widthKey] = { borderWidth: width };

    // Per-side width: border_w_<side>_<name>
    for (let s = 0; s < BORDER_SIDES.length; s++) {
      const side = BORDER_SIDES[s];

      if (side === 't') {
        styles['border_w_t_' + widthKey] = { borderTopWidth: width };
      } else if (side === 'b') {
        styles['border_w_b_' + widthKey] = { borderBottomWidth: width };
      } else if (side === 's') {
        styles['border_w_s_' + widthKey] = { borderStartWidth: width };
      } else if (side === 'e') {
        styles['border_w_e_' + widthKey] = { borderEndWidth: width };
      } else if (side === 'r') {
        styles['border_w_r_' + widthKey] = { borderRightWidth: width };
      } else if (side === 'l') {
        styles['border_w_l_' + widthKey] = { borderLeftWidth: width };
      }
    }
  }


  // ~~~~~~~~~~ Spacing (logical sides for RTL: a/h/v/t/b/s/e/r/l) ~~~~~~~~~~
  const spaceKeys = Object.keys(Spacing);

  for (let i = 0; i < spaceKeys.length; i++) {
    const token = spaceKeys[i];
    const value = Spacing[token];

    if (typeof value !== 'number') {
      continue;
    }

    for (let j = 0; j < SIDES.length; j++) {
      const side = SIDES[j];

      styles['p_' + side + '_' + token] = paddingFor(side, value);
      styles['m_' + side + '_' + token] = marginFor(side, value);
    }
  }


  // ~~~~~~~~~~ Flexbox utilities ~~~~~~~~~~
  styles['flex_row'] = { flexDirection: 'row' };
  styles['flex_col'] = { flexDirection: 'column' };
  styles['flex_center'] = { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' };
  styles['flex_between'] = { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' };
  styles['flex_stretch'] = { alignSelf: 'stretch' };
  styles['flex_wrap'] = { flexWrap: 'wrap' };
  styles['flex_1'] = { flex: 1 };
  styles['align_center'] = { alignItems: 'center' };
  styles['align_start'] = { alignItems: 'flex-start' };
  styles['align_end'] = { alignItems: 'flex-end' };
  styles['justify_center'] = { justifyContent: 'center' };
  styles['justify_start'] = { justifyContent: 'flex-start' };
  styles['justify_end'] = { justifyContent: 'flex-end' };
  styles['justify_between'] = { justifyContent: 'space-between' };
  styles['justify_evenly'] = { justifyContent: 'space-evenly' };


  // ~~~~~~~~~~ Display utilities ~~~~~~~~~~
  styles['display_none'] = { display: 'none' };
  styles['position_absolute'] = { position: 'absolute' };
  styles['position_relative'] = { position: 'relative' };


  // Freeze into a native StyleSheet
  return RNStyleSheet.create(styles);

}
