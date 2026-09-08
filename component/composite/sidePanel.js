// Info: SidePanel composite [S3 overlay]. A side panel that slides in from
// the right. Uses A11y, Overlay. Uses useFocusTrap with
// trap: true. Composes View and Text atoms.
//   isOpen      -> boolean
//   onClose     -> function
//   title       -> string (optional panel header)
//   children    -> panel content
//   side        -> 'left' | 'right' (default 'right')
//   width       -> number (default 320)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable, Modal as RNModal, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SidePanel composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SidePanel component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SidePanel = function SidePanel (props) {


    const {
      isOpen, onClose, title, children, side, width, style,
      ...rest
    } = props;

    const React = Lib.React;
    const panelSide = side || 'right';
    const panelWidth = width || 320;

    // Focus trap
    const focusTrap = Parts.FocusTrap({
      isOpen: isOpen,
      onClose: onClose,
      trap: true
    });

    // Render panel content
    const renderPanel = function () {
      return React.createElement(
        RNView,
        Object.assign({
          ref: focusTrap.containerRef,
          accessibilityRole: 'dialog',
          style: [
            Style.utilities['background_layer_02'],
            {
              position: 'absolute',
              top: 0, bottom: 0,
              [panelSide]: 0,
              width: panelWidth
            },
            style
          ]
        }, focusTrap.accessibilityProps, rest),
        title
          ? React.createElement(Registry.Text, {
            typeSet: 'heading01',
            color: 'text_primary',
            weight: 'semibold',
            style: [Style.utilities['p_h_spacing_06'], Style.utilities['p_v_spacing_05']]
          }, title)
          : null,
        children
      );
    };

    // Backdrop
    const renderBackdrop = function () {
      return React.createElement(Pressable, {
        onPress: focusTrap.onOutsidePress,
        style: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }
      });
    };

    if (!isOpen) {
      return null;
    }

    // On native, use RN Modal
    if (Platform.OS !== 'web') {
      return React.createElement(
        RNModal,
        { visible: true, transparent: true, animationType: 'slide', onRequestClose: onClose },
        renderBackdrop(),
        renderPanel()
      );
    }

    // On web, use Overlay
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
        { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: Parts.Stacking.modal } },
        renderBackdrop(),
        renderPanel()
      );
    }

    return null;
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SidePanel = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SidePanel;

}/////////////////////////// Component Factory END /////////////////////////////
