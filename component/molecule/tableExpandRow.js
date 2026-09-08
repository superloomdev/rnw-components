// Info: TableExpandRow molecule [S2 interactive]. A row that can expand to
// reveal additional content. Uses role="row" for screen reader semantics,
// A11y for aria-expanded state, and PressKeys for keyboard
// activation.
//   isExpanded -> boolean, whether this row is currently expanded
//   onToggle   -> function invoked when the row is pressed to toggle
//   children   -> row cell elements
//   style      -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableExpandRow molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableExpandRow component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableExpandRow = function TableExpandRow (props) {


    const {
      isExpanded, onToggle, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    const ariaProps = Parts.A11y.state({
      expanded: !!isExpanded
    });

    const pressKeysProps = Parts.PressKeys({
      role: 'row',
      onActivate: onToggle,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: onToggle,
        accessibilityRole: 'row',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableExpandRow = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableExpandRow;

}/////////////////////////// Component Factory END /////////////////////////////
