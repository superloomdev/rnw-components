// Info: DataTableCell molecule [S1 presentational]. A cell in a DataTable.
// Uses role="cell" for screen reader semantics. Renders the content string
// with padding; type="header" styles the text as a secondary header label.
// When onPress is provided the cell becomes pressable while keeping role="cell".
//   content     -> string or node rendered inside the cell
//   type        -> 'default' | 'header' (controls text styling)
//   width       -> number of points or a percentage string (cell width)
//   onPress     -> optional press handler (makes the cell pressable)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DataTableCell molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DataTableCell component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DataTableCell = function DataTableCell (props) {


    const {
      content, type, width, onPress, style,
      ...rest
    } = props;

    const React = Lib.React;
    const isHeader = type === 'header';

    // Validate layout dimension (D21 item 2)
    if (!Lib.Utils.isNullOrUndefined(width) && !Parts.Units.isLength(width)) {
      throw new TypeError('INVALID_LENGTH: ' + ERRORS.INVALID_LENGTH.message + ': DataTableCell.width = ' + String(width));
    }

    const cellStyle = [
      Style.utilities['flex_1'],
      Style.utilities['p_h_spacing_05'],
      Style.utilities['p_v_spacing_03'],
      Lib.Utils.isNullOrUndefined(width) ? null : { width: width },
      style
    ];

    const textElement = React.createElement(Registry.Text, {
      typeSet: 'label01',
      color: isHeader ? 'text_secondary' : 'text_primary',
      weight: isHeader ? 'medium' : 'regular'
    }, content == null ? '' : String(content));

    if (onPress) {
      return React.createElement(
        Pressable,
        Object.assign({
          onPress: onPress,
          accessibilityRole: 'cell',
          style: cellStyle
        }, rest),
        textElement
      );
    }

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'cell',
        style: cellStyle
      }, rest),
      textElement
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DataTableCell = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DataTableCell;

}/////////////////////////// Component Factory END /////////////////////////////
