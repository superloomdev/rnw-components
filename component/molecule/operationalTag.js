// Info: OperationalTag molecule [S2 interactive]. An operational tag with an
// action. Uses role="button" for screen reader semantics. Uses A11y for
// aria-* state and PressKeys for keyboard activation.
//   text        -> string (the tag label)
//   onAction    -> function (called when the tag is pressed)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the OperationalTag molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The OperationalTag component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const OperationalTag = function OperationalTag (props) {


    const {
      text, onAction, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: onAction,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: onAction,
        accessibilityRole: 'button',
        accessibilityLabel: text
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_01'],
          Style.utilities['br_radius_max'],
          {
            ...Style.utilities['border_w_width_01'],
            ...Style.utilities['border_color_border_subtle_01'],
            ...Style.utilities['background_layer_01']
          },
          style
        ]
      }, rest),
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: 'text_primary'
      }, text)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _OperationalTag = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return OperationalTag;

}/////////////////////////// Component Factory END /////////////////////////////
