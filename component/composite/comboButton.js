// Info: ComboButton composite [S3 overlay]. A split button: primary action
// plus a dropdown for secondary actions. Uses A11y, Overlay,
// AnchoredPosition, CompoundContext.
//   primaryLabel  -> string (main button label)
//   onPrimaryPress-> function (main button handler)
//   items         -> array of { label, onPress, disabled }
//   style         -> custom style overrides


// Imports
import menuFactory from './menu.js';
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ComboButton composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ComboButton component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const Menu = menuFactory(Lib, CONFIG, ERRORS, Parts, Registry, Style);

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ComboButton = function ComboButton (props) {


    const {
      primaryLabel, onPrimaryPress, items, style,
      ...rest
    } = props;

    const React = Lib.React;
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClose = function () {
      setIsOpen(false);
    };

    // Build aria state props for the dropdown trigger
    const ariaProps = Parts.A11y.state({
      expanded: !!isOpen
    });

    // Build menu items
    const menuItems = (items || []).map(function (item) {
      return React.createElement(Registry.MenuItem, {
        key: item.label,
        label: item.label,
        onPress: function () {
          setIsOpen(false);
          if (Lib.Utils.isFunction(item.onPress)) {
            item.onPress();
          }
        },
        disabled: item.disabled
      });
    });

    return React.createElement(
      RNView,
      Object.assign({ style: [Style.utilities['flex_row'], style] }, rest),
      // Primary button
      React.createElement(
        Registry.Button,
        { onPress: onPrimaryPress },
        primaryLabel
      ),
      // Dropdown trigger
      React.createElement(
        Pressable,
        Object.assign({
          onPress: function () {
            setIsOpen(!isOpen);
          },
          accessibilityRole: 'button',
          accessibilityLabel: 'More options',
          style: [Style.utilities['p_h_spacing_03'], Style.utilities['p_v_spacing_03'], Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01']]
        }, ariaProps),
        React.createElement(Registry.Icon, {
          name: 'chevron-down',
          typeSet: 'label01',
          color: 'text_primary'
        })
      ),
      React.createElement(Menu, { isOpen: isOpen, onClose: handleClose }, menuItems)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ComboButton = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ComboButton;

}/////////////////////////// Component Factory END /////////////////////////////
