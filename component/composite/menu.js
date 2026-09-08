// Info: Menu composite [S3/S4 overlay]. A menu container with role="menu"
// that coordinates MenuItem children. Uses A11y, RovingTabIndex,
// Overlay, AnchoredPosition, CompoundContext.
//   isOpen      -> boolean
//   onClose     -> function
//   children    -> MenuItem elements
//   placement   -> string (default 'bottom-start')
//   anchorRef   -> ref (external anchor; if not provided, uses internal)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Menu composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Menu component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Menu = function Menu (props) {


    const {
      isOpen, onClose, children, placement, style, // eslint-disable-line no-unused-vars
      ...rest
    } = props;

    const React = Lib.React;

    // Focus trap (menu traps focus while open)
    const focusTrap = Parts.FocusTrap({
      isOpen: isOpen,
      onClose: onClose,
      trap: true
    });

    // Render the menu panel
    const renderPanel = function (zIndex) {
      return React.createElement(
        RNView,
        Object.assign({
          ref: focusTrap.containerRef,
          accessibilityRole: 'menu',
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_08'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['p_v_spacing_01'],
            { minWidth: 200, zIndex: zIndex || 1000 },
            style
          ]
        }, focusTrap.accessibilityProps, rest),
        children
      );
    };

    // Backdrop
    const renderBackdrop = function () {
      return React.createElement(Pressable, {
        onPress: focusTrap.onOutsidePress,
        style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
      });
    };

    if (!isOpen) {
      return null;
    }

    // Use Overlay on web
    const overlay = useOverlay({
      isOpen: true,
      trap: true,
      onClose: onClose,
      render: function () {
        return React.createElement(
          React.Fragment,
          null,
          renderBackdrop(),
          renderPanel()
        );
      }
    });

    if (overlay.layerIndex < 0) {
      return React.createElement(
        RNView,
        { style: { position: 'relative' } },
        renderBackdrop(),
        renderPanel(1000)
      );
    }

    return null;
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Menu = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Menu;

}/////////////////////////// Component Factory END /////////////////////////////
