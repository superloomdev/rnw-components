// Info: Search molecule [S2 interactive]. A TextInput with a search icon
// and optional clear button. Uses A11y for aria-* state and M8
// (useControllableState) for controlled/uncontrolled value.
//   value         -> string (controlled)
//   defaultValue  -> string (uncontrolled)
//   onChange      -> callback receiving the text value
//   onClear       -> callback when clear button is pressed
//   placeholder   -> string (default 'Search')
//   disabled      -> boolean


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Search molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Search component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Search = function Search (props) {


    const {
      value, defaultValue, onChange, onClear, placeholder, disabled, style,
      accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;

    // Controlled/uncontrolled state
    const state = Parts.ControllableState({
      value: value,
      defaultValue: defaultValue || '',
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    // Frame ownership: the wrapper owns the border/focus/disabled state.
    const focusState = React.useState(false);
    const focused = focusState[0];
    const setFocused = focusState[1];

    const isDisabled = !!disabled;

    // Field-adjacent controls meet the spec sheet control size
    const controlSize = Parts.Spec('textInput').controlSize;

    // Resolve frame mode from the feedback.field token (underline | outline)
    const frameMode = Style.tokens.Feedback.field || 'underline';

    // Clear button handler
    const handleClear = function () {
      setValue('');
      if (Lib.Utils.isFunction(onClear)) {
        onClear();
      }
    };

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
            disabled: isDisabled
          }),
          Style.utilities['p_h_spacing_03'],
          { flex: 1, minWidth: 0 },
          style
        ]
      },
      // Search icon
      React.createElement(Registry.Icon, {
        name: 'search',
        size: 'sm',
        color: 'text_secondary',
        style: Style.utilities['m_e_spacing_01']
      }),
      // Text input
      React.createElement(
        Registry.TextInput,
        Object.assign({
          value: resolvedValue,
          onChangeText: setValue,
          placeholder: placeholder || 'Search',
          isDisabled: isDisabled,
          unframed: true,
          accessibilityRole: 'searchbox',
          accessibilityLabel: accessibilityLabel || 'Search',
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
          style: { flex: 1, minWidth: 0 }
        }, rest)
      ),
      // Clear button (visible when there is text)
      resolvedValue && !isDisabled
        ? React.createElement(
          Pressable,
          {
            onPress: handleClear,
            accessibilityRole: 'button',
            accessibilityLabel: 'Clear search',
            style: [Style.utilities['m_s_spacing_01'], { minWidth: controlSize, minHeight: controlSize, alignItems: 'center', justifyContent: 'center' }]
          },
          React.createElement(Registry.Icon, {
            name: 'close',
            size: 'sm',
            color: 'text_secondary'
          })
        )
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Search = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Search;

}/////////////////////////// Component Factory END /////////////////////////////
