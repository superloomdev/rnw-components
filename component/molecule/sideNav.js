// Info: SideNav molecule [S1 presentational]. A side navigation panel. Uses
// role="navigation" for screen reader semantics. Renders children in a
// vertical column with surface background.
//   children    -> side nav content elements
//   expanded    -> boolean (whether the side nav is expanded)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SideNav molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SideNav component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SideNav = function SideNav (props) {


    const {
      children, expanded, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'navigation',
        style: [
          Style.utilities['flex_col'],
          Style.utilities['background_layer_02'],
          {
            width: expanded === false ? 0 : 256,
            borderRightWidth: 1,
            borderRightColor: Style.tokens.Color.border_subtle_01
          },
          style
        ]
      }, rest),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SideNav = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SideNav;

}/////////////////////////// Component Factory END /////////////////////////////
