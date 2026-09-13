// Info: DismissibleTag molecule [S2 interactive]. A tag that can be dismissed.
// Uses role="button" for screen reader semantics. Uses A11y for aria-*
// state and PressKeys for keyboard activation.
//   text        -> string (the tag label)
//   onDismiss   -> function (called when dismiss is pressed)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DismissibleTag molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DismissibleTag component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DismissibleTag = function DismissibleTag (props) {


    const {
      text, onDismiss, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Resolve spec sheet values
    const tagSpec = Parts.Spec('tag');
    const dismissSize = tagSpec.dismissTargetSize;
    const dismissIconSize = tagSpec.dismissIconSize;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: onDismiss,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: onDismiss,
        accessibilityRole: 'button',
        accessibilityLabel: text ? ('Dismiss ' + text) : 'Dismiss tag'
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
      }, text),
      React.createElement(
        RNView,
        {
          style: [Style.utilities['m_s_spacing_01'], { minWidth: dismissSize, minHeight: dismissSize, alignItems: 'center', justifyContent: 'center' }]
        },
        React.createElement(Registry.Icon, {
          name: tagSpec.dismissIcon,
          size: dismissIconSize,
          color: 'text_secondary'
        })
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DismissibleTag = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DismissibleTag;

}/////////////////////////// Component Factory END /////////////////////////////
