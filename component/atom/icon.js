// Info: Icon atom [S1 presentational]. Wraps an injected glyph component
// (Lib.Icons.Glyph).
//   name  -> glyph name (vendor-specific, set by the host adapter)
//   size  -> dimension token (xs..xxl) OR a raw number
//   color -> color token (e.g. 'text_primary' / 'icon_primary') OR a raw hex
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
    // Map legacy size names to type sets for the pixel value
    const SIZE_TO_TYPE_SET = {
      xs: 'caption01',
      sm: 'label02',
      md: 'body02',
      lg: 'body02',
      xl: 'heading03',
      xxl: 'expressive_paragraph_01'
    };
    let px = Style.utilities['type_' + (SIZE_TO_TYPE_SET.md || 'body01')].fontSize;

    if (Lib.Utils.isNumber(size)) {
      px = size;
    } else if (size) {
      const typeSetName = SIZE_TO_TYPE_SET[size];
      if (typeSetName && Style.utilities['type_' + typeSetName]) {
        px = Style.utilities['type_' + typeSetName].fontSize;
      }
    }

    // Resolve color: hex -> as-is, token -> palette, default text_primary
    const hex = _Icon.resolveColorToken(color, Style.tokens.Color);

    return Lib.React.createElement(
      Lib.Icons.Glyph,
      Object.assign({ name: name, size: px, color: hex, style: style }, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Icon = {

    // Resolve a color prop to a hex value: hex -> as-is, token -> palette,
    // default icon_primary
    resolveColorToken: function (color, Color) {

      // Raw hex value: use as-is
      if (color && color.charAt(0) === '#') {
        return color;
      }

      // Contract color tokens: icon_primary, icon_on_color, etc.
      if (color && Color[color]) {
        return Color[color];
      }

      // Default: icon_primary
      return Color.icon_primary;

    }

  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Icon;

}/////////////////////////// Component Factory END /////////////////////////////
