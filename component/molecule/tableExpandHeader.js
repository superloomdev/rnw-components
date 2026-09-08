// Info: TableExpandHeader molecule [S1 presentational]. A header cell with an
// expand/collapse toggle for expandable rows. Uses role="columnheader" for
// screen reader semantics and exposes aria-expanded for the toggle state.
//   isExpanded -> boolean, whether the row group is currently expanded
//   onToggle   -> function invoked when the toggle is pressed
//   style      -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableExpandHeader molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableExpandHeader component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableExpandHeader = function TableExpandHeader (props) {


    const {
      isExpanded, onToggle, style,
      ...rest
    } = props;

    const React = Lib.React;

    const ariaProps = Parts.A11y.state({
      expanded: !!isExpanded
    });

    const toggle = React.createElement(
      Pressable,
      {
        onPress: onToggle,
        accessibilityRole: 'button',
        accessibilityLabel: isExpanded ? 'Collapse row' : 'Expand row',
        style: [
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_01']
        ]
      },
      React.createElement(Registry.Icon, {
        name: isExpanded ? 'chevron-up' : 'chevron-down',
        typeSet: 'label01',
        color: 'text_secondary'
      })
    );

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'columnheader',
        style: [
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, ariaProps, rest),
      toggle
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableExpandHeader = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableExpandHeader;

}/////////////////////////// Component Factory END /////////////////////////////
