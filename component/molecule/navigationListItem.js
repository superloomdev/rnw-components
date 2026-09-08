// Info: NavigationListItem molecule [S2 interactive]. A navigation list item
// with an optional leading icon and a title. Uses role="link" for screen
// reader semantics.
//   title       -> primary text
//   onPress     -> press handler
//   icon        -> leading icon name (optional)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the NavigationListItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The NavigationListItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const NavigationListItem = function NavigationListItem (props) {


    const {
      title, onPress, icon, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: onPress,
        accessibilityRole: 'link',
        accessibilityLabel: title,
        style: [
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_05'],
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          style
        ]
      }, ariaProps, rest),
      // Leading icon
      icon
        ? React.createElement(Registry.Icon, {
          name: icon,
          typeSet: 'body01',
          color: 'text_secondary',
          style: Style.utilities['m_e_spacing_03']
        })
        : null,
      // Title
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'text_primary',
        weight: 'regular'
      }, title)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _NavigationListItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return NavigationListItem;

}/////////////////////////// Component Factory END /////////////////////////////
