// Info: SelectableTile molecule [S2 interactive]. A tile that acts as a
// checkbox. Uses A11y for aria-* state and PressKeys for keyboard.
//   title       -> string
//   selected    -> boolean
//   onSelect    -> function (called with next boolean)
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SelectableTile molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SelectableTile component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SelectableTile = function SelectableTile (props) {


    const {
      title, selected, onSelect, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Handle toggle
    const handlePress = function () {
      if (disabled) {
        return;
      }
      if (Lib.Utils.isFunction(onSelect)) {
        onSelect(!selected);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      checked: !!selected
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'checkbox',
      onActivate: handlePress,
      disabled: !!disabled
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        disabled: !!disabled,
        accessibilityRole: 'checkbox',
        accessibilityLabel: title,
        style: [
          Style.utilities['br_radius_08'],
          Style.utilities['p_a_spacing_05'],
          {
            borderWidth: 2,
            borderColor: selected
              ? (Style.tokens.Color.interactive)
              : (Style.tokens.Color.border_subtle_01),
            backgroundColor: selected
              ? (Style.tokens.Color.layer_01)
              : 'transparent'
          },
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      title
        ? React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary',
          weight: 'medium'
        }, title)
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SelectableTile = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SelectableTile;

}/////////////////////////// Component Factory END /////////////////////////////
