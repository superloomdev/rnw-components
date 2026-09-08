// Info: TableSelectRow molecule [S2 interactive]. A cell with a checkbox to
// select a single row. Uses role="cell" for screen reader semantics.
// Composes the Checkbox atom and forwards its toggle to onSelect.
//   checked     -> true | false (current selection state of the row)
//   onSelect    -> function receiving the next boolean
//   ariaLabel   -> string (accessibility label for the checkbox)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableSelectRow molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableSelectRow component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableSelectRow = function TableSelectRow (props) {


    const {
      checked, onSelect, ariaLabel, style,
      ...rest
    } = props;

    const React = Lib.React;

    const handleChange = function (next) {

      if (Lib.Utils.isFunction(onSelect)) {
        onSelect(next);
      }

    };

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'cell',
        style: [
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, rest),
      React.createElement(Registry.Checkbox, {
        checked: checked,
        onChange: handleChange,
        accessibilityLabel: ariaLabel || 'Select row'
      })
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableSelectRow = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableSelectRow;

}/////////////////////////// Component Factory END /////////////////////////////
