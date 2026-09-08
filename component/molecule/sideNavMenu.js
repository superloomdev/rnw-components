// Info: SideNavMenu molecule [S2 interactive]. A collapsible menu in the
// side nav. Uses role="button" for screen reader semantics. Uses A11y
// for aria-expanded state and PressKeys for keyboard activation.
//   label       -> string (menu label)
//   expanded    -> boolean (whether the menu is expanded)
//   onToggle    -> function (called with next boolean)
//   children    -> SideNavMenuItem elements (shown when expanded)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SideNavMenu molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SideNavMenu component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SideNavMenu = function SideNavMenu (props) {


    const {
      label, expanded, onToggle, children, style,
      ...rest
    } = props;

    const React = Lib.React;
    const isExpanded = !!expanded;

    // Handle toggle
    const handlePress = function () {
      if (Lib.Utils.isFunction(onToggle)) {
        onToggle(!isExpanded);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      expanded: isExpanded
    });

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
      React.createElement(
        Pressable,
        Object.assign({
          onPress: handlePress,
          accessibilityRole: 'button',
          accessibilityLabel: label
        }, ariaProps, pressKeysProps, {
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center'],
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_03']
          ]
        }),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary',
          weight: 'medium',
          style: { flex: 1 }
        }, label || ''),
        React.createElement(Registry.Icon, {
          name: isExpanded ? 'chevron--up' : 'chevron--down',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      ),
      isExpanded
        ? React.createElement(RNView, null, children)
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SideNavMenu = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SideNavMenu;

}/////////////////////////// Component Factory END /////////////////////////////
