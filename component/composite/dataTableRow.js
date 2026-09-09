// Info: DataTableRow composite [S2 interactive]. An interactive table row
// with press handling and selection state. Uses A11y for aria-* state
// and PressKeys for keyboard activation. role="row".
//   cells       -> array of cell values (strings or elements)
//   onPress     -> press handler (optional; when absent, row is static)
//   selected    -> boolean, whether the row is selected
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DataTableRow composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DataTableRow component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DataTableRow = function DataTableRow (props) {


    const {
      cells, onPress, selected, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build the row content (shared between pressable and static variants)
    const rowContent = (cells || []).map(function (cell, index) {
      return React.createElement(
        RNView,
        {
          key: 'cell-' + index,
          accessibilityRole: 'cell',
          style: [
            Style.utilities['flex_1'],
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_03']
          ]
        },
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_primary'
        }, String(cell))
      );
    });

    // Row container styles
    const rowStyle = [
      Style.utilities['flex_row'],
      Style.utilities['align_center'],
      Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
      selected
        ? { ...Style.utilities['background_layer_01'] }
        : null,
      style
    ];

    // Static (non-pressable) row
    if (!Lib.Utils.isFunction(onPress)) {
      return React.createElement(
        RNView,
        Object.assign({
          accessibilityRole: 'row',
          style: rowStyle
        }, rest),
        rowContent
      );
    }

    // Pressable row: S2 interactive
    const ariaProps = Parts.A11y.state({
      selected: !!selected
    });

    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: onPress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: onPress,
        accessibilityRole: 'row',
        style: function () {
          return rowStyle;
        }
      }, ariaProps, pressKeysProps, rest),
      rowContent
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DataTableRow = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DataTableRow;

}/////////////////////////// Component Factory END /////////////////////////////
