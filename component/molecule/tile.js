// Info: Tile molecule [S1 presentational]. A clickable tile card with
// title, subtitle, and optional icon. Uses A11y.
//   title       -> string
//   subtitle    -> string
//   icon        -> string (icon name)
//   children    -> additional content
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Tile molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Tile component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Tile = function Tile (props) {


    const {
      title, subtitle, icon, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        style: [
          Style.utilities['background_layer_02'],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['p_a_spacing_05'],
          style
        ]
      }, rest),
      icon
        ? React.createElement(Registry.Icon, {
          name: icon,
          typeSet: 'body02',
          color: 'text_primary',
          style: Style.utilities['m_b_spacing_03']
        })
        : null,
      title
        ? React.createElement(Registry.Text, {
          typeSet: 'body02',
          color: 'text_primary',
          weight: 'semibold',
          style: Style.utilities['m_b_spacing_01']
        }, title)
        : null,
      subtitle
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary',
          style: Style.utilities['m_b_spacing_03']
        }, subtitle)
        : null,
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Tile = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Tile;

}/////////////////////////// Component Factory END /////////////////////////////
