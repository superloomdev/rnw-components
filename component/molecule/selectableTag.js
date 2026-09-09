// Info: SelectableTag molecule [S2 interactive]. A tag that can be
// selected/deselected. Uses A11y for aria-* state and PressKeys
// for keyboard activation. Role="button".
//   text        -> string (the tag label)
//   selected    -> boolean (whether the tag is selected)
//   onSelect    -> function (called with next boolean)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SelectableTag molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SelectableTag component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SelectableTag = function SelectableTag (props) {


    const {
      text, selected, onSelect, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Handle toggle
    const handlePress = function () {
      if (Lib.Utils.isFunction(onSelect)) {
        onSelect(!selected);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      pressed: !!selected
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        accessibilityRole: 'button',
        accessibilityLabel: text,
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_01'],
          Style.utilities['br_radius_max'],
          {
            ...Style.utilities['border_w_width_01'],
            ...(selected
              ? Style.utilities['border_color_interactive']
              : Style.utilities['border_color_border_subtle_01']),
            backgroundColor: selected
              ? Style.utilities['background_background'].backgroundColor
              : 'transparent'
          },
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: selected ? 'interactive' : 'text_primary'
      }, text)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SelectableTag = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SelectableTag;

}/////////////////////////// Component Factory END /////////////////////////////
