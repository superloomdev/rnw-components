// Info: MenuItemSelectable molecule [S2 interactive]. A menu item with
// role="menuitemcheckbox" that toggles checked state. Uses A11y and
// PressKeys.
//   label       -> string
//   checked     -> boolean
//   onChange    -> function (called with next boolean)
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the MenuItemSelectable molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The MenuItemSelectable component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const MenuItemSelectable = function MenuItemSelectable (props) {


    const {
      label, checked, onChange, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Handle toggle
    const handlePress = function () {
      if (disabled) {
        return;
      }
      if (Lib.Utils.isFunction(onChange)) {
        onChange(!checked);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      checked: !!checked
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'menuitemcheckbox',
      onActivate: handlePress,
      disabled: !!disabled
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        disabled: !!disabled,
        accessibilityRole: 'menuitemcheckbox',
        accessibilityLabel: label,
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      // Checkmark indicator
      React.createElement(RNView, {
        style: [
          {
            width: 16,
            height: 16,
            marginRight: 8,
            borderWidth: 2,
            borderRadius: 2,
            borderColor: checked
              ? (Style.tokens.Color.interactive)
              : (Style.tokens.Color.border_subtle_01),
            backgroundColor: checked
              ? (Style.tokens.Color.interactive)
              : 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }
        ]
      }, checked
        ? React.createElement(Registry.Text, {
          typeSet: 'caption01',
          color: 'text_on_color',
          weight: 'bold'
        }, '\u2713')
        : null
      ),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: disabled ? 'text_disabled' : 'text_primary',
        style: { flex: 1 }
      }, label)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _MenuItemSelectable = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return MenuItemSelectable;

}/////////////////////////// Component Factory END /////////////////////////////
