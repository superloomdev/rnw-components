// Info: SideNavDetails molecule [S1 presentational]. A details section in
// the side nav. Uses role="group" for screen reader semantics.
//   title       -> string (section title)
//   children    -> detail content elements
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SideNavDetails molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SideNavDetails component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SideNavDetails = function SideNavDetails (props) {


    const {
      title, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'group',
        style: [
          Style.utilities['flex_col'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, rest),
      title
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary',
          weight: 'medium',
          style: Style.utilities['m_b_spacing_01']
        }, title)
        : null,
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SideNavDetails = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SideNavDetails;

}/////////////////////////// Component Factory END /////////////////////////////
