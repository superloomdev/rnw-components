// Info: IconIndicator atom [S1 presentational]. A colored circle with an
// icon inside, for status display. Uses A11y for aria-*.
// Uses shared_libs.Svg as an optional injection; degrades to colored View.
//   iconName    -> string (name of the icon to render)
//   color       -> string (background color token or hex)
//   iconColor   -> string (icon color token or hex, default 'text_on_color')
//   size        -> number (pixels, default 24)
//   label       -> string (accessibility label)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the IconIndicator atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The IconIndicator component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const IconIndicator = function IconIndicator (props) {

    const {
      iconName, color, iconColor, size, label, style,
      ...rest
    } = props;

    const React = Lib.React;
    const s = Lib.Utils.isNumber(size) ? size : 24;

    // Resolve colors from token or raw hex
    const resolvedBg = (Style.tokens.Color[color] || color || Style.tokens.Color.interactive);
    const resolvedIcon = (Style.tokens.Color[iconColor] || iconColor || Style.tokens.Color.text_on_color);

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityLabel: label || 'Icon indicator',
        style: [
          {
            width: s,
            height: s,
            borderRadius: s / 2,
            backgroundColor: resolvedBg,
            justifyContent: 'center',
            alignItems: 'center'
          },
          style
        ]
      }, rest),
      Registry.Icon
        ? React.createElement(Registry.Icon, {
          name: iconName || 'info',
          typeSet: 'label01',
          color: resolvedIcon
        })
        : null
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _IconIndicator = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return IconIndicator;

}/////////////////////////// Component Factory END /////////////////////////////
