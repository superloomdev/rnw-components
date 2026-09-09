// Info: Switch molecule [S2 interactive]. A content switcher button with
// role="button" that toggles selected state. Used inside the ContentSwitcher
// composite. Uses A11y for aria-pressed and aria-disabled, and M2
// (usePressKeys) for keyboard activation. Can optionally consume
// ContentSwitcher context for selection coordination.
//   label       -> string (switch label text)
//   selected    -> boolean, whether this switch is selected
//   onPress     -> function (press handler)
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import getSharedContext from '../context/sharedContext.js';
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Switch molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Switch component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////


  // Get the shared ContentSwitcher context (cached per Lib instance)
  const contentSwitcherCtx = getSharedContext(Lib, 'ContentSwitcher');

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Switch = function Switch (props) {


    const {
      label, selected, onPress, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Read ContentSwitcher context if available
    const ctxValue = React.useContext(contentSwitcherCtx.Context);

    // Determine selected state: context overrides props
    const isSelected = ctxValue ? (ctxValue.selectedIndex === ctxValue.index) : !!selected;
    const isDisabled = !!disabled;

    // Determine focusable from roving tab index
    const focusable = ctxValue ? ctxValue.focusable : undefined;

    // Handle press
    const handlePress = function () {
      if (isDisabled) {
        return;
      }
      if (Lib.Utils.isFunction(onPress)) {
        onPress();
      }
      if (ctxValue && Lib.Utils.isFunction(ctxValue.onChange)) {
        ctxValue.onChange(ctxValue.index);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      pressed: isSelected,
      disabled: isDisabled
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handlePress,
      disabled: isDisabled
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: isDisabled ? null : handlePress,
        disabled: isDisabled,
        accessibilityRole: 'button',
        accessibilityLabel: label,
        focusable: focusable,
        style: [
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['m_r_spacing_03'],
          Style.utilities['br_radius_04'],
          {
            ...(isSelected
              ? Style.utilities['background_interactive']
              : Style.utilities['background_layer_01'])
          },
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: isSelected ? 'text_on_color' : 'text_secondary',
        weight: 'medium'
      }, label)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Switch = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Switch;

}/////////////////////////// Component Factory END /////////////////////////////
