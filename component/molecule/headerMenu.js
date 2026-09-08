// Info: HeaderMenu molecule [S2 interactive]. A dropdown menu in the header.
// Uses role="menu" for screen reader semantics. Uses A11y for aria-*
// state and PressKeys for keyboard activation on the toggle.
//   label       -> string (menu label)
//   children    -> HeaderMenuItem elements
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the HeaderMenu molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The HeaderMenu component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const HeaderMenu = function HeaderMenu (props) {


    const {
      label, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    // Build keyboard activation props for the menu toggle
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: function () {},
      disabled: false
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'menu',
        accessibilityLabel: label,
        style: [
          Style.utilities['flex_col'],
          style
        ]
      }, rest),
      React.createElement(
        Pressable,
        Object.assign({
          onPress: function () {},
          accessibilityRole: 'button',
          accessibilityLabel: label
        }, ariaProps, pressKeysProps, {
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center'],
            Style.utilities['p_h_spacing_03'],
            Style.utilities['p_v_spacing_03']
          ]
        }),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary'
        }, label || ''),
        React.createElement(Registry.Icon, {
          name: 'chevron--down',
          typeSet: 'label01',
          color: 'text_secondary',
          style: Style.utilities['m_s_spacing_01']
        })
      ),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _HeaderMenu = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return HeaderMenu;

}/////////////////////////// Component Factory END /////////////////////////////
