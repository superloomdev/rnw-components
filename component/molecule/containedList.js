// Info: ContainedList molecule [S1 presentational]. A contained list with a
// label. Uses role="list" for screen reader semantics.
//   label       -> string (list label, optional)
//   children    -> list item elements
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ContainedList molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ContainedList component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ContainedList = function ContainedList (props) {


    const {
      label, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'list',
        style: [
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['background_layer_02'],
          style
        ]
      }, rest),
      label
        ? React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary',
          weight: 'medium',
          style: [
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_03']
          ]
        }, label)
        : null,
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ContainedList = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ContainedList;

}/////////////////////////// Component Factory END /////////////////////////////
