// Info: TabPanel molecule [S1 presentational]. A content panel with
// role="tabpanel" that is shown when its corresponding Tab is selected.
// Uses A11y for aria-hidden when not selected.
//   children    -> panel content
//   selected    -> boolean, whether this panel is visible
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TabPanel molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TabPanel component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TabPanel = function TabPanel (props) {


    const { children, selected, style, ...rest } = props;

    const React = Lib.React;

    const ariaProps = Parts.A11y.state({
      hidden: selected === false ? true : undefined
    });

    if (selected === false) {
      return null;
    }

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'tabpanel',
        style: [
          Style.utilities['p_a_spacing_05'],
          style
        ]
      }, ariaProps, rest),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TabPanel = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TabPanel;

}/////////////////////////// Component Factory END /////////////////////////////
