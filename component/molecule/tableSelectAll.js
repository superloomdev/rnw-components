// Info: TableSelectAll molecule [S2 interactive]. A header cell with a
// checkbox to select all rows. Uses role="columnheader" for screen reader
// semantics. Composes the Checkbox atom and forwards its toggle to
// onSelectAll.
//   checked     -> true | false | 'mixed' (current selection state)
//   onSelectAll -> function receiving the next boolean
//   ariaLabel   -> string (accessibility label for the checkbox)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableSelectAll molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableSelectAll component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableSelectAll = function TableSelectAll (props) {


    const {
      checked, onSelectAll, ariaLabel, style,
      ...rest
    } = props;

    const React = Lib.React;

    const handleChange = function (next) {

      if (Lib.Utils.isFunction(onSelectAll)) {
        onSelectAll(next);
      }

    };

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'columnheader',
        style: [
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, rest),
      React.createElement(Registry.Checkbox, {
        checked: checked,
        onChange: handleChange,
        accessibilityLabel: ariaLabel || 'Select all rows'
      })
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableSelectAll = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableSelectAll;

}/////////////////////////// Component Factory END /////////////////////////////
