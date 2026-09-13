// Info: TopNavigationBar molecule [S1 presentational]. A top navigation
// bar with title, subtitle, left items, and right items. Uses role="banner"
// for screen reader semantics.
//   title       -> main title string
//   subTitle    -> optional subtitle string
//   leftItems   -> array of { icon, text, onPress }
//   rightItems  -> array of { icon, text, onPress }
//   headerMode  -> boolean (larger title when true)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TopNavigationBar molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TopNavigationBar component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TopNavigationBar = function TopNavigationBar (props) {


    // Destructure props
    const {
      title, subTitle, leftItems, rightItems, headerMode,
      style,
      ...rest
    } = props;

    const React = Lib.React;

    // Render a nav item (icon button)
    const renderNavItem = function (item, index) {
      return React.createElement(Registry.Button, {
        key: index,
        kind: 'ghost',
        children: item.text,
        icon: item.icon,
        onPress: item.onPress
      });
    };

    // Title section
    const titleSection = React.createElement(
      RNView,
      { style: Style.utilities['flex_col'] },
      React.createElement(Registry.Text, { style: headerMode ? { fontSize: 20 } : null }, title || ''),
      subTitle ? React.createElement(Registry.Text, null, subTitle) : null
    );

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'banner',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['justify_between'],
          style
        ]
      }, rest),
      React.createElement(RNView, { style: Style.utilities['flex_row'] },
        (Array.isArray(leftItems) ? leftItems : []).map(renderNavItem)
      ),
      titleSection,
      React.createElement(RNView, { style: Style.utilities['flex_row'] },
        (Array.isArray(rightItems) ? rightItems : []).map(renderNavItem)
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TopNavigationBar = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TopNavigationBar;

}/////////////////////////// Component Factory END /////////////////////////////
