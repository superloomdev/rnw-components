// Info: The token -> atomic-utility-style generator. Given an assembled theme
// ({ Color, Dimension, Font, Breakpoint, TypeSet, Shadow, Motion, Layer }) and
// a breakpoint key, it produces a Tailwind-like stylesheet of utility classes
// that components consume by name. Regenerated whenever the theme changes
// (the runtime-theming seam).
//
// Spacing utilities are LOGICAL (start/end), so layouts mirror correctly under
// RTL with no per-component work. Each breakpoint generates its own utility set
// so components can switch sets without regenerating styles on resize.
//
// Type set utilities preserve the full Carbon type style (fontSize, lineHeight,
// letterSpacing, fontWeight, fontFamily) rather than collapsing to a size plus
// a global lineHeightRatio. Carbon color tokens (layer_01, text_primary,
// border_subtle_01, icon_primary, etc.) generate utilities by their snake_case
// names. Border utilities separate width/side from color so a selected top
// border cannot become an all-side border.
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


// Normalize a token name to lowercase for style key generation
const normalizeToken = function (token) {
  return token.toLowerCase();
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


// Color tokens that get font_ utility classes
const FONT_COLOR_TOKENS = [
  'TEXT_PRIMARY', 'TEXT_SECONDARY', 'TEXT_MUTED', 'TEXT_DISABLED', 'TEXT_ON_PRIMARY',
  'APP_PRIMARY', 'STATUS_SUCCESS', 'STATUS_DANGER', 'STATUS_WARNING', 'STATUS_INFO'
];


// Color tokens that get background_ utility classes
const BACKGROUND_COLOR_TOKENS = [
  'APP_PRIMARY', 'APP_PRIMARY_HOVERED', 'APP_PRIMARY_PRESSED', 'APP_PRIMARY_DISABLED',
  'APP_PRIMARY_SUBTLE', 'BACKGROUND_PRIMARY', 'BACKGROUND_SECONDARY', 'SURFACE',
  'STATUS_SUCCESS', 'STATUS_SUCCESS_SUBTLE', 'STATUS_DANGER', 'STATUS_DANGER_SUBTLE',
  'STATUS_WARNING', 'STATUS_WARNING_SUBTLE', 'STATUS_INFO', 'STATUS_INFO_SUBTLE',
  'BUTTON_PRIMARY', 'BUTTON_PRIMARY_HOVER', 'BUTTON_PRIMARY_ACTIVE',
  'BUTTON_SECONDARY', 'BUTTON_SECONDARY_HOVER', 'BUTTON_SECONDARY_ACTIVE',
  'BUTTON_TERTIARY', 'BUTTON_TERTIARY_HOVER', 'BUTTON_TERTIARY_ACTIVE',
  'BUTTON_DANGER_PRIMARY', 'BUTTON_DANGER_HOVER', 'BUTTON_DANGER_ACTIVE',
  'BUTTON_DANGER_SECONDARY', 'BUTTON_DISABLED', 'BUTTON_SEPARATOR'
];


// Logical and physical sides for spacing utilities
const SIDES = ['a', 'h', 'v', 't', 'b', 's', 'e', 'r', 'l'];


/********************************************************************
Generate the atomic utility stylesheet from a theme for a specific
breakpoint. The breakpoint key is accepted for future per-breakpoint
spacing scale adjustments; currently all breakpoints share the same
space tokens.

@param {Object} theme      - { Color, Dimension, Font, Breakpoint }
@param {String} breakpoint - Breakpoint key (e.g. 'base', 'sm', 'md')
@param {Object} Parts      - Mechanism parts; uses Parts.Typeface for
                              font weight resolution

@return {Object} - StyleSheet of utility classes keyed by name
*********************************************************************/
export default function generateCommonStyles (theme, breakpoint, Parts) {

  const Color = theme.Color;
  const Dimension = theme.Dimension;
  const Font = theme.Font;

  const styles = {};


  // ~~~~~~~~~~ Font sizes (+ derived line-height) ~~~~~~~~~~
  const fontSizeKeys = Object.keys(Dimension.fontSize);

  for (let i = 0; i < fontSizeKeys.length; i++) {
    const key = fontSizeKeys[i];
    const size = Dimension.fontSize[key];

    styles['font_size_' + key] = {
      fontSize: size,
      lineHeight: Math.round(size * (Dimension.lineHeightRatio || 1.4))
    };

  }


  // ~~~~~~~~~~ Font colors (curated token subset) ~~~~~~~~~~
  for (let i = 0; i < FONT_COLOR_TOKENS.length; i++) {
    const token = FONT_COLOR_TOKENS[i];

    if (Color[token] !== undefined) {
      styles['font_' + normalizeToken(token)] = { color: Color[token] };
    }

  }


  // ~~~~~~~~~~ Font weights (resolved through Parts.Typeface) ~~~~~~~~~~
  const weightKeys = Object.keys(Font.weight);

  for (let i = 0; i < weightKeys.length; i++) {
    const w = weightKeys[i];

    // Typeface.styleFor returns { fontFamily } for per-weight-face families
    // or { fontFamily, fontWeight } for synthesizing families (System, etc.)
    styles['font_weight_' + w] = Parts.Typeface.styleFor('primary', Font.weight[w], Font);

  }

  // Secondary family is available as a named utility
  if (Font.family.secondary) {
    styles['font_family_secondary'] = { fontFamily: Font.family.secondary };
  }


  // ~~~~~~~~~~ Type sets (full Carbon type styles) ~~~~~~~~~~
  // Each type set utility carries fontSize, lineHeight, letterSpacing,
  // fontWeight, and fontFamily - not collapsed to size + global ratio.
  if (theme.TypeSet && typeof theme.TypeSet === 'object') {

    const typeKeys = Object.keys(theme.TypeSet);

    for (let i = 0; i < typeKeys.length; i++) {

      const key = typeKeys[i];
      const ts = theme.TypeSet[key];

      if (ts && typeof ts === 'object') {

        const style = {};

        // Font size: round for native rendering
        if (typeof ts.fontSize === 'number') {
          style.fontSize = ts.fontSize;
        } else if (typeof ts.fontSize === 'string') {
          // Parse rem/em to px
          const px = parseFloat(ts.fontSize);
          if (!isNaN(px)) {
            style.fontSize = Math.round(px * 16);
          }
        }

        // Line height: preserve exact value, not a global ratio
        if (typeof ts.lineHeight === 'number') {
          style.lineHeight = ts.lineHeight;
        }

        // Letter spacing: parse to px for native
        if (typeof ts.letterSpacing === 'number') {
          style.letterSpacing = ts.letterSpacing;
        } else if (typeof ts.letterSpacing === 'string') {
          const lsPx = parseFloat(ts.letterSpacing);
          if (!isNaN(lsPx)) {
            style.letterSpacing = lsPx;
          }
        }

        // Font weight
        if (ts.fontWeight !== undefined) {
          const weightStyle = Parts.Typeface.styleFor(
            ts.fontFamily || 'primary',
            ts.fontWeight,
            Font
          );
          Object.assign(style, weightStyle);
        } else if (ts.fontFamily) {
          // Family without weight (Carbon leaves weight unset for some styles)
          const familyName = Font.family[ts.fontFamily] || Font.family.primary;
          if (familyName) {
            style.fontFamily = familyName;
          }
        }

        styles['type_' + key] = style;

      }

    }

  }


  // ~~~~~~~~~~ Carbon color utilities (snake_case token names) ~~~~~~~~~~
  // Generate font_, background_, and border_color_ utilities for every
  // Carbon color token in the theme, using their snake_case names.
  if (Color && typeof Color === 'object') {

    const colorKeys = Object.keys(Color);

    for (let i = 0; i < colorKeys.length; i++) {

      const key = colorKeys[i];
      const snakeKey = normalizeToken(key);
      const value = Color[key];

      if (typeof value !== 'string') {
        continue;
      }

      // Text color utilities: font_text_primary, font_icon_primary, etc.
      if (snakeKey.indexOf('text_') === 0 || snakeKey.indexOf('icon_') === 0 ||
          snakeKey.indexOf('interactive') === 0 || snakeKey.indexOf('focus') === 0 ||
          snakeKey.indexOf('highlight') === 0 || snakeKey.indexOf('support_') === 0) {
        styles['font_' + snakeKey] = { color: value };
      }

      // Background color utilities: background_layer_01, background_background, etc.
      if (snakeKey.indexOf('layer_') === 0 || snakeKey.indexOf('background') === 0 ||
          snakeKey.indexOf('field_') === 0 || snakeKey.indexOf('overlay') === 0 ||
          snakeKey.indexOf('skeleton_') === 0 || snakeKey.indexOf('ai_') === 0) {
        styles['background_' + snakeKey] = { backgroundColor: value };
      }

      // Border color utilities (separated from width/side): border_color_subtle_01, etc.
      if (snakeKey.indexOf('border_') === 0) {
        styles['border_color_' + snakeKey] = { borderColor: value };
      }

    }

  }


  // ~~~~~~~~~~ Backgrounds ~~~~~~~~~~
  for (let i = 0; i < BACKGROUND_COLOR_TOKENS.length; i++) {
    const token = BACKGROUND_COLOR_TOKENS[i];

    if (Color[token] !== undefined) {
      styles['background_' + normalizeToken(token)] = { backgroundColor: Color[token] };
    }

  }


  // ~~~~~~~~~~ Borders ~~~~~~~~~~
  if (Color.BORDER !== undefined) {
    styles['border_default'] = { borderWidth: 1, borderColor: Color.BORDER };
    styles['border_top'] = { borderTopWidth: 1, borderColor: Color.BORDER };
  }

  if (Color.APP_PRIMARY !== undefined) {
    styles['border_primary'] = { borderWidth: 1, borderColor: Color.APP_PRIMARY };
  }

  // Focus ring border for the focused interaction state
  if (Color.APP_PRIMARY !== undefined) {
    styles['border_focused'] = { borderWidth: 2, borderColor: Color.APP_PRIMARY };
  }


  // ~~~~~~~~~~ Separated border width/side utilities ~~~~~~~~~~
  // Border width is separated from border color so a selected top border
  // cannot become an all-side border. Components combine width + side +
  // color utilities.
  const BORDER_WIDTHS = [0, 1, 2, 4];
  const BORDER_SIDES = ['a', 't', 'b', 's', 'e', 'r', 'l'];

  for (let w = 0; w < BORDER_WIDTHS.length; w++) {

    const width = BORDER_WIDTHS[w];

    // All-sides width
    styles['border_w_' + width] = { borderWidth: width };

    // Per-side width
    for (let s = 0; s < BORDER_SIDES.length; s++) {

      const side = BORDER_SIDES[s];

      if (side === 't') {
        styles['border_w_t_' + width] = { borderTopWidth: width };
      } else if (side === 'b') {
        styles['border_w_b_' + width] = { borderBottomWidth: width };
      } else if (side === 's') {
        styles['border_w_s_' + width] = { borderStartWidth: width };
      } else if (side === 'e') {
        styles['border_w_e_' + width] = { borderEndWidth: width };
      } else if (side === 'r') {
        styles['border_w_r_' + width] = { borderRightWidth: width };
      } else if (side === 'l') {
        styles['border_w_l_' + width] = { borderLeftWidth: width };
      }

    }

  }


  // ~~~~~~~~~~ Shadow utilities ~~~~~~~~~~
  // Shadow utilities from the Shadow group. On native, these use
  // shadowColor/shadowOffset/shadowRadius/shadowOpacity/elevation.
  // On web, they use boxShadow.
  if (theme.Shadow && typeof theme.Shadow === 'object') {

    const shadowKeys = Object.keys(theme.Shadow);

    for (let i = 0; i < shadowKeys.length; i++) {

      const key = shadowKeys[i];
      const shadow = theme.Shadow[key];

      if (typeof shadow === 'string') {
        // CSS box-shadow string (used in box_shadow mode)
        styles['shadow_' + key] = { boxShadow: shadow };
      } else if (shadow && typeof shadow === 'object') {
        // Native shadow object
        styles['shadow_' + key] = shadow;
      }

    }

  }


  // ~~~~~~~~~~ Radii ~~~~~~~~~~
  const radiusKeys = Object.keys(Dimension.radius);

  for (let i = 0; i < radiusKeys.length; i++) {
    const key = radiusKeys[i];

    styles['br_' + key] = { borderRadius: Dimension.radius[key] };

  }


  // ~~~~~~~~~~ Spacing (logical sides for RTL: a/h/v/t/b/s/e) ~~~~~~~~~~
  const spaceKeys = Object.keys(Dimension.space);

  for (let i = 0; i < spaceKeys.length; i++) {
    const token = spaceKeys[i];
    const value = Dimension.space[token];

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
