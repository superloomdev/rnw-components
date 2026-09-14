// Info: TableToolbarSearch molecule [S2 interactive]. A search input for
// filtering table rows. Uses role="searchbox" for screen reader semantics.
// Composes the TextInput atom with a leading search icon.
//   value       -> string (controlled search value)
//   onChange    -> callback receiving the text value
//   placeholder -> string (placeholder text, default 'Search')
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableToolbarSearch molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableToolbarSearch component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableToolbarSearch = function TableToolbarSearch (props) {


    const {
      value, onChange, placeholder, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Frame ownership: the wrapper owns the border/focus state.
    const focusState = React.useState(false);
    const focused = focusState[0];
    const setFocused = focusState[1];

    // Resolve frame mode from the feedback.field token (underline | outline)
    const frameMode = Style.tokens.Feedback.field || 'underline';

    return React.createElement(
      RNView,
      {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          ...Parts.Frame.resolve({
            mode: frameMode,
            focused: focused,
            invalid: false,
            disabled: false
          }),
          { minWidth: 0 },
          Style.utilities['p_h_spacing_03'],
          style
        ]
      },
      React.createElement(Registry.Icon, {
        name: 'search',
        typeSet: 'label01',
        color: 'text_secondary',
        style: Style.utilities['m_e_spacing_01']
      }),
      React.createElement(
        Registry.TextInput,
        Object.assign({
          value: value,
          onChangeText: onChange,
          placeholder: placeholder || 'Search',
          unframed: true,
          accessibilityRole: 'searchbox',
          accessibilityLabel: 'Search table',
          onFocus: function (e) {
            setFocused(true);
            if (Lib.Utils.isFunction(props.onFocus)) {
              props.onFocus(e);
            }
          },
          onBlur: function (e) {
            setFocused(false);
            if (Lib.Utils.isFunction(props.onBlur)) {
              props.onBlur(e);
            }
          },
          style: { flex: 1 }
        }, rest)
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableToolbarSearch = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableToolbarSearch;

}/////////////////////////// Component Factory END /////////////////////////////
