// Info: UiPanelItem molecule [S2 interactive]. A single item within a
// UiPanel, with icon, text, and onPress. Uses role="button" for screen
// reader semantics.
//   icon        -> icon name (optional)
//   text        -> item label
//   onPress     -> callback when pressed
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the UiPanelItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The UiPanelItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  const minSize = Parts.Spec('target').minSize;
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const UiPanelItem = function UiPanelItem (props) {


    // Destructure props
    const {
      icon, text, onPress, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: onPress,
        accessibilityRole: 'button',
        accessibilityLabel: text,
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          { minWidth: minSize, minHeight: minSize },
          style
        ]
      }, rest),
      icon ? React.createElement(Registry.Icon, { name: icon }) : null,
      React.createElement(Registry.Text, null, text || '')
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _UiPanelItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return UiPanelItem;

}/////////////////////////// Component Factory END /////////////////////////////
