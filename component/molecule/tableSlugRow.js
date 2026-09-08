// Info: TableSlugRow molecule [S1 presentational]. A row with a slug (short
// label). Uses role="row" for screen reader semantics. Renders the slug as a
// secondary text label followed by the row children in a horizontal layout.
//   slug        -> string (short label rendered at the row start)
//   children    -> row cell elements
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableSlugRow molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableSlugRow component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableSlugRow = function TableSlugRow (props) {


    const {
      slug, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'row',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          style
        ]
      }, rest),
      React.createElement(
        RNView,
        {
          style: [
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_03']
          ]
        },
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary',
          weight: 'medium'
        }, slug == null ? '' : String(slug))
      ),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableSlugRow = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableSlugRow;

}/////////////////////////// Component Factory END /////////////////////////////
