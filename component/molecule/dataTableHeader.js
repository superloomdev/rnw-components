// Info: DataTableHeader molecule [S1 presentational]. A header bar for a
// DataTable with primary and secondary actions. Uses role="row" for screen
// reader semantics. Renders the primary action on the leading edge and the
// secondary actions on the trailing edge.
//   primaryAction    -> single action object { label, onPress, kind }
//   secondaryActions -> array of action objects { label, onPress, kind }
//   style            -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DataTableHeader molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DataTableHeader component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DataTableHeader = function DataTableHeader (props) {


    const {
      primaryAction, secondaryActions, style,
      ...rest
    } = props;

    const React = Lib.React;

    const renderAction = function (action, key) {

      if (!action) {
        return null;
      }

      return React.createElement(Registry.Button, {
        key: key,
        kind: action.kind || 'secondary',
        onPress: action.onPress,
        accessibilityLabel: action.label,
        style: Style.utilities['m_s_spacing_01']
      }, action.label);

    };

    const primary = primaryAction
      ? renderAction(primaryAction, 'primary')
      : null;

    const secondary = (secondaryActions || []).map(function (action, index) {
      return renderAction(action, 'secondary-' + index);
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'row',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['justify_between'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          style
        ]
      }, rest),
      primary,
      React.createElement(
        RNView,
        { style: Style.utilities['flex_row'] },
        secondary
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DataTableHeader = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DataTableHeader;

}/////////////////////////// Component Factory END /////////////////////////////
