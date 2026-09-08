// Info: OverflowMenu composite [S3 overlay]. A button that opens a Menu.
// Uses A11y, RovingTabIndex, Overlay, AnchoredPosition,
// CompoundContext. Composes Button, Menu, MenuItem atoms.
//   items       -> array of { label, onPress, disabled }
//   triggerLabel-> string (default 'Options')
//   placement   -> string (default 'bottom-end')
//   style       -> custom style overrides


// Imports
import menuFactory from './menu.js';
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the OverflowMenu composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The OverflowMenu component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const Menu = menuFactory(Lib, CONFIG, ERRORS, Parts, Registry, Style);

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const OverflowMenu = function OverflowMenu (props) {


    const {
      items, triggerLabel, placement, style, // eslint-disable-line no-unused-vars
      ...rest
    } = props;

    const React = Lib.React;
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClose = function () {
      setIsOpen(false);
    };
    const handleTrigger = function () {
      setIsOpen(!isOpen);
    };

    // Build aria state props for trigger
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
      { style: { position: 'relative' } },
      React.createElement(
        Pressable,
        Object.assign({
          onPress: handleTrigger,
          accessibilityRole: 'button',
          accessibilityLabel: triggerLabel || 'Options',
          style: [Style.utilities['p_h_spacing_03'], Style.utilities['p_v_spacing_03'], style]
        }, ariaProps, rest),
        React.createElement(Registry.Icon, {
          name: 'overflow',
          typeSet: 'body01',
          color: 'text_primary'
        })
      ),
      React.createElement(Menu, { isOpen: isOpen, onClose: handleClose }, menuItems)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _OverflowMenu = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return OverflowMenu;

}/////////////////////////// Component Factory END /////////////////////////////
