// Info: DataTable molecule [S1]. A simple data table that renders headers
// and rows. Uses role="table" for screen reader semantics. Keep simple -
// just render headers and rows in a column layout.
//   headers     -> array of header strings
//   rows        -> array of arrays (each inner array is a row of cell values)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DataTable molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DataTable component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DataTable = function DataTable (props) {


    const {
      headers, rows, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Render header row
    const headerRow = React.createElement(
      RNView,
      {
        accessibilityRole: 'row',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['background_layer_01'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01']
        ]
      },
      (headers || []).map(function (header, index) {
        return React.createElement(
          RNView,
          {
            key: 'header-' + index,
            accessibilityRole: 'columnheader',
            style: [
              Style.utilities['flex_1'],
              Style.utilities['p_h_spacing_05'],
              Style.utilities['p_v_spacing_03']
            ]
          },
          React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: 'text_secondary',
            weight: 'medium'
          }, String(header))
        );
      })
    );

    // Render data rows
    const dataRows = (rows || []).map(function (row, rowIndex) {
      return React.createElement(
        RNView,
        {
          key: 'row-' + rowIndex,
          accessibilityRole: 'row',
          style: [
            Style.utilities['flex_row'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01']
          ]
        },
        (row || []).map(function (cell, cellIndex) {
          return React.createElement(
            RNView,
            {
              key: 'cell-' + rowIndex + '-' + cellIndex,
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
        })
      );
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'table',
        style: [
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['br_radius_08'],
          { overflow: 'hidden' },
          style
        ]
      }, rest),
      headerRow,
      dataRows
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DataTable = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DataTable;

}/////////////////////////// Component Factory END /////////////////////////////
