// Info: Tab molecule [S2 interactive]. A tab trigger with role="tab" that
// fires onPress when activated. Uses A11y for aria-selected and
// aria-disabled, and PressKeys for keyboard activation. Can
// optionally consume Tabs context for roving tab index coordination.
//   label       -> string (tab label text)
//   selected    -> boolean, whether this tab is selected
//   onPress     -> function (press handler)
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import getSharedContext from '../context/sharedContext.js';
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Tab molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Tab component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////


  // Get the shared Tabs context (cached per Lib instance)
  const tabsCtx = getSharedContext(Lib, 'Tabs');

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Tab = function Tab (props) {


    const {
      label, selected, onPress, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Read Tabs context if available (for roving tab index)
    const ctxValue = React.useContext(tabsCtx.Context);

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
      selected: isSelected,
      disabled: isDisabled
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'tab',
      onActivate: handlePress,
      disabled: isDisabled
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: isDisabled ? null : handlePress,
        disabled: isDisabled,
        accessibilityRole: 'tab',
        accessibilityLabel: label,
        focusable: focusable,
        style: [
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['m_r_spacing_03'],
          {
            ...Style.utilities['border_w_b_width_02'],
            borderColor: isSelected
              ? Style.utilities['border_color_interactive'].borderColor
              : 'transparent'
          },
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: isSelected ? 'text_primary' : 'text_secondary',
        weight: isSelected ? 'medium' : 'regular'
      }, label)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Tab = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Tab;

}/////////////////////////// Component Factory END /////////////////////////////
