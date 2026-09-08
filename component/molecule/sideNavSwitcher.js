// Info: SideNavSwitcher molecule [S2 interactive]. A switcher in the side
// nav. Uses role="button" for screen reader semantics. Uses A11y for
// aria-* state and PressKeys for keyboard activation.
//   label       -> string (switcher label)
//   options     -> array (switcher options)
//   onChange    -> function (called with selected option)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SideNavSwitcher molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SideNavSwitcher component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SideNavSwitcher = function SideNavSwitcher (props) {


    const {
      label, options, onChange, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Handle press (cycles through options)
    const handlePress = function () {
      if (Array.isArray(options) && !Lib.Utils.isEmptyArray(options) && Lib.Utils.isFunction(onChange)) {
        onChange(options[0]);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      RNView,
      Object.assign({
        style: [
          Style.utilities['flex_col'],
          style
        ]
      }, rest),
      label
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary',
          style: Style.utilities['m_b_spacing_01']
        }, label)
        : null,
      React.createElement(
        Pressable,
        Object.assign({
          onPress: handlePress,
          accessibilityRole: 'button',
          accessibilityLabel: label || 'Switcher'
        }, ariaProps, pressKeysProps, {
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center'],
            Style.utilities['justify_between'],
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_03'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['br_radius_04']
          ]
        }),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary'
        }, Array.isArray(options) && !Lib.Utils.isEmptyArray(options) ? String(options[0]) : ''),
        React.createElement(Registry.Icon, {
          name: 'chevron--down',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SideNavSwitcher = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SideNavSwitcher;

}/////////////////////////// Component Factory END /////////////////////////////
