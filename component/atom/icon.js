// Info: Icon atom [S1 presentational]. Wraps an injected glyph component
// (Lib.Icons.Glyph).
//   name  -> glyph name (vendor-specific, set by the host adapter)
//   size  -> dimension token (xs..xxl) OR a raw number
//   color -> color token (e.g. 'TEXT_PRIMARY' / 'text_primary') OR a raw hex
// The icon source is injected as shared_libs.Icons (capability-named, never
// vendor-named) so the library does not couple to a specific icon set.


// Imports


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Icon atom.

@param {Object} Lib      - { Utils, Debug, React, Icons }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Icon component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Icon = function Icon (props) {

    // Destructure token props from pass-through props
    const { name, size, color, style, ...rest } = props;

    // Guard: Icons must be injected by the host
    if (!Lib.Icons || !Lib.Icons.Glyph) {
      Lib.Debug.warn('Icons not injected; pass shared_libs.Icons with a Glyph component');
      return null;
    }

    // Resolve size: token -> px, number -> px, default md
    const fontSizeMap = Style.tokens.Dimension.fontSize;
    let px = fontSizeMap.md;

    if (Lib.Utils.isNumber(size)) {
      px = size;
    } else if (size && fontSizeMap[size]) {
      px = fontSizeMap[size];
    }

    // Resolve color: hex -> as-is, token -> palette, default TEXT_PRIMARY
    const colorMap = Style.tokens.Color;
    const hex = _Icon.resolveColorToken(color, colorMap);

    return Lib.React.createElement(
      Lib.Icons.Glyph,
      Object.assign({ name: name, size: px, color: hex, style: style }, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Icon = {

    // Resolve a color prop to a hex value: hex -> as-is, token -> palette,
    // default icon_primary (Carbon) or TEXT_PRIMARY (legacy)
    resolveColorToken: function (color, colorMap) {

      // Raw hex value: use as-is
      if (color && color.charAt(0) === '#') {
        return color;
      }

      // Carbon snake_case icon tokens: icon_primary, icon_on_color, etc.
      if (color && colorMap[color]) {
        return colorMap[color];
      }

      // Legacy SCREAMING_SNAKE_CASE tokens: TEXT_PRIMARY, APP_PRIMARY, etc.
      if (color && colorMap[color.toUpperCase()]) {
        return colorMap[color.toUpperCase()];
      }

      // Default: prefer Carbon icon_primary, fall back to TEXT_PRIMARY
      return colorMap.icon_primary || colorMap.TEXT_PRIMARY;

    }

  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Icon;

}/////////////////////////// Component Factory END /////////////////////////////
