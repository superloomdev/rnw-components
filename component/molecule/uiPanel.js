// Info: UiPanel molecule [S1 presentational]. A collapsible panel with a
// header and content area. Uses role="group" for screen reader semantics.
// The header toggles visibility of the children.
//   title       -> panel header text
//   collapsed   -> boolean (true = content hidden)
//   onToggle    -> callback when header is pressed
//   children    -> panel content
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the UiPanel molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The UiPanel component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  const minSize = Parts.Spec('target').minSize;
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const UiPanel = function UiPanel (props) {


    // Destructure props
    const {
      title, collapsed, onToggle, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Header section with toggle
    const header = React.createElement(
      Pressable,
      {
        onPress: onToggle,
        accessibilityRole: 'button',
        accessibilityLabel: title,
        style: [
          Style.utilities['flex_row'],
          { minWidth: minSize, minHeight: minSize, alignItems: 'center' }
        ]
      },
      React.createElement(Registry.Text, null, title || ''),
      React.createElement(Registry.Icon, { name: collapsed ? 'chevron--right' : 'chevron--down' })
    );

    // Content section (hidden when collapsed)
    const content = collapsed ? null : children;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'group',
        style: [
          Style.utilities['flex_col'],
          style
        ]
      }, rest),
      header,
      content
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _UiPanel = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return UiPanel;

}/////////////////////////// Component Factory END /////////////////////////////
