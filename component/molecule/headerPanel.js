// Info: HeaderPanel molecule [S1 presentational]. An expandable panel
// within the Header composite with role="region". Uses A11y for
// aria-hidden when collapsed.
//   children    -> panel content
//   expanded    -> boolean, whether the panel is visible
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the HeaderPanel molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The HeaderPanel component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const HeaderPanel = function HeaderPanel (props) {


    const { children, expanded, style, ...rest } = props;

    const React = Lib.React;

    const ariaProps = Parts.A11y.state({
      hidden: expanded === false ? true : undefined
    });

    if (expanded === false) {
      return null;
    }

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'region',
        style: [
          Style.utilities['background_layer_02'],
          Style.utilities['p_a_spacing_05'],
          style
        ]
      }, ariaProps, rest),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _HeaderPanel = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return HeaderPanel;

}/////////////////////////// Component Factory END /////////////////////////////
