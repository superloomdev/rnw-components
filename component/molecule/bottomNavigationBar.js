// Info: BottomNavigationBar molecule [S1 presentational]. A bottom
// navigation bar with icon+text items. Uses role="tabbar" for screen
// reader semantics. Each item is a Pressable with icon and label.
//   items       -> array of { icon, text, onPress, active }
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the BottomNavigationBar molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The BottomNavigationBar component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const BottomNavigationBar = function BottomNavigationBar (props) {


    // Destructure props
    const {
      items, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Render each navigation item
    const renderItem = function (item, index) {

      // Each item takes equal width so the bar distributes evenly
      const itemStyles = [
        Style.utilities['flex_col'],
        Style.utilities['align_center'],
        { flex: 1 },
        Style.utilities['p_v_spacing_03'],
        { minHeight: CONFIG.MIN_HIT_TARGET }
      ];

      if (item.active) {
        itemStyles.push(Style.utilities['border_w_width_01'], Style.utilities['border_color_interactive']);
      }

      return React.createElement(
        Pressable,
        {
          key: index,
          onPress: item.onPress,
          accessibilityRole: 'tab',
          accessibilityLabel: item.text,
          hitSlop: { top: 4, bottom: 4, left: 4, right: 4 },
          style: itemStyles
        },
        item.icon ? React.createElement(Registry.Icon, { name: item.icon, style: { marginBottom: 2 } }) : null,
        React.createElement(Registry.Text, { typeSet: 'label01', color: item.active ? 'interactive' : 'text_secondary' }, item.text)
      );

    };

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'tabbar',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['justify_between'],
          Style.utilities['border_w_width_01'],
          Style.utilities['border_color_border_subtle_01'],
          style
        ]
      }, rest),
      (Array.isArray(items) ? items : []).map(renderItem)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _BottomNavigationBar = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return BottomNavigationBar;

}/////////////////////////// Component Factory END /////////////////////////////
