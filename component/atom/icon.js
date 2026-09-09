// Info: Icon atom [S1 presentational]. Wraps an injected glyph component
// (Lib.Icons.Glyph).
//   name  -> glyph name (vendor-specific, set by the host adapter)
//   size  -> number of points or a size token (xs..xxl, default md)
//   color -> color.* token name (default icon_primary)
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

    // Validate size (D21 item 2): a number of points or a dimension token; a
    // CSS unit string or percentage string is not a valid size
    if (!Lib.Utils.isNullOrUndefined(size) && Lib.Utils.isString(size) && /^[0-9]/.test(size)) {
      throw new TypeError('INVALID_LENGTH: ' + ERRORS.INVALID_LENGTH.message + ': Icon.size = ' + String(size));
    }

    // Guard: Icons must be injected by the host
    if (!Lib.Icons || !Lib.Icons.Glyph) {
      Lib.Debug.warn('Icons not injected; pass shared_libs.Icons with a Glyph component');
      return null;
    }

    // Resolve size: token -> type set, number -> px, default md
    // Map size tokens to type sets for the pixel value
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

    // Resolve color through the utilities so the strict proxy guards the name
    const hex = Style.utilities['font_' + (color || 'icon_primary')].color;

    return Lib.React.createElement(
      Lib.Icons.Glyph,
      Object.assign({ name: name, size: px, color: hex, style: style }, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Icon = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Icon;

}/////////////////////////// Component Factory END /////////////////////////////
