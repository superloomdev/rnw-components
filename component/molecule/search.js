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

    const isDisabled = !!disabled;

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
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          isDisabled
            ? { ...Style.utilities['background_layer_01'] }
            : Style.utilities['background_layer_02'],
          Style.utilities['p_h_spacing_03'],
          { flex: 1 },
          style
        ]
      },
      // Search icon
      React.createElement(Registry.Icon, {
        name: 'search',
        typeSet: 'label01',
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
          style: { flex: 1 }
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
            style: Style.utilities['m_s_spacing_01']
          },
          React.createElement(Registry.Icon, {
            name: 'close',
            typeSet: 'label01',
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
