// Info: BottomToolbarPrimaryAction molecule [S2 interactive]. A bottom
// toolbar with a primary call-to-action button and secondary actions.
// Uses role="toolbar" for screen reader semantics.
//   primaryAction -> object with { text, onPress }
//   items         -> array of secondary { text, icon, onPress }
//   style         -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the BottomToolbarPrimaryAction molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The BottomToolbarPrimaryAction component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const BottomToolbarPrimaryAction = function BottomToolbarPrimaryAction (props) {


    // Destructure props
    const {
      primaryAction, items, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Render secondary items
    let secondaryElements = [];

    if (Array.isArray(items)) {
      secondaryElements = items.map(function (item, index) {
        return React.createElement(Registry.Button, {
          key: index,
          kind: 'ghost',
          children: item.text,
          icon: item.icon,
          onPress: item.onPress
        });
      });
    }

    // Render primary action
    let primaryElement = null;

    if (primaryAction && Lib.Utils.isFunction(primaryAction.onPress)) {
      primaryElement = React.createElement(Registry.Button, {
        kind: 'primary',
        children: primaryAction.text,
        onPress: primaryAction.onPress
      });
    }

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'toolbar',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['justify_between'],
          style
        ]
      }, rest),
      React.createElement(RNView, { style: Style.utilities['flex_row'] }, secondaryElements),
      primaryElement
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _BottomToolbarPrimaryAction = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return BottomToolbarPrimaryAction;

}/////////////////////////// Component Factory END /////////////////////////////
