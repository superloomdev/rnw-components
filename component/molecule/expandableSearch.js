// Info: ExpandableSearch molecule [S2 interactive]. A search input that
// collapses to a search icon button and expands on press. Uses A11y
// for aria-* state and ControllableState for controlled/uncontrolled
// value. Composes TextInput, Icon, and Pressable atoms.
//   value         -> string (controlled)
//   defaultValue  -> string (uncontrolled)
//   onChange      -> callback receiving the text value
//   onClear       -> callback when clear button is pressed
//   placeholder   -> string (default 'Search')
//   disabled      -> boolean
//   defaultExpanded -> boolean (default false)


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ExpandableSearch molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ExpandableSearch component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  // a11y not needed: TextInput handles its own aria-* state

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ExpandableSearch = function ExpandableSearch (props) {


    const {
      value, defaultValue, onChange, onClear, placeholder, disabled,
      defaultExpanded, style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;

    // Controlled/uncontrolled state for the search text
    const state = Parts.ControllableState({
      value: value,
      defaultValue: defaultValue || '',
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    // Expanded/collapsed state (always uncontrolled)
    const expandState = React.useState(!!defaultExpanded);
    const isExpanded = expandState[0];
    const setIsExpanded = expandState[1];

    const isDisabled = !!disabled;

    // Clear button handler
    const handleClear = function () {
      setValue('');
      if (Lib.Utils.isFunction(onClear)) {
        onClear();
      }
    };

    // Toggle expand/collapse
    const handleToggle = function () {
      if (isDisabled) {
        return;
      }
      setIsExpanded(!isExpanded);
    };

    // Collapsed state: render just the search icon button
    if (!isExpanded) {
      return React.createElement(
        Pressable,
        {
          onPress: handleToggle,
          disabled: isDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: accessibilityLabel || 'Expand search',
          style: [Style.utilities['p_h_spacing_03'], Style.utilities['p_v_spacing_03'], style]
        },
        React.createElement(Registry.Icon, {
          name: 'search',
          typeSet: 'body01',
          color: isDisabled ? 'text_disabled' : 'text_primary'
        })
      );
    }

    // Expanded state: render the search input with collapse button
    return React.createElement(
      RNView,
      {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          isDisabled
            ? { backgroundColor: Style.tokens.Color.layer_01 }
            : Style.utilities['background_layer_02'],
          Style.utilities['p_h_spacing_03'],
          style
        ]
      },
      // Search icon (press to collapse)
      React.createElement(
        Pressable,
        {
          onPress: handleToggle,
          disabled: isDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: 'Collapse search',
          style: Style.utilities['m_e_spacing_01']
        },
        React.createElement(Registry.Icon, {
          name: 'search',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      ),
      // Text input
      React.createElement(
        Registry.TextInput,
        Object.assign({
          value: resolvedValue,
          onChangeText: setValue,
          placeholder: placeholder || 'Search',
          isDisabled: isDisabled,
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
  const _ExpandableSearch = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ExpandableSearch;

}/////////////////////////// Component Factory END /////////////////////////////
