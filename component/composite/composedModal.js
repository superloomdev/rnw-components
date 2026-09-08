// Info: ComposedModal composite [S3/S4 overlay]. A modal dialog with
// ModalHeader, ModalBody, ModalFooter coordination. Uses A11y,
// Overlay, CompoundContext. Uses useFocusTrap with
// trap: true. Composes ModalHeader, ModalBody, ModalFooter molecules.
//   isOpen      -> boolean
//   onClose     -> function
//   children    -> ModalHeader, ModalBody, ModalFooter elements
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable, Modal as RNModal, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ComposedModal composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ComposedModal component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ComposedModal = function ComposedModal (props) {


    const {
      isOpen, onClose, children, style,
      initialFocusRef, ...rest
    } = props;

    const React = Lib.React;

    // Focus trap with trap: true for modal,
    const focusTrap = Parts.FocusTrap({
      isOpen: isOpen,
      onClose: onClose,
      trap: true,
      initialFocusRef: initialFocusRef
    });

    // Render the modal content,
    const renderContent = function () {
      return React.createElement(
        RNView,
        Object.assign({
          ref: focusTrap.containerRef,
          accessibilityRole: 'dialog',
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_12'],
            { margin: 24, maxWidth: 600, alignSelf: 'center' },
            style
          ]
        }, focusTrap.accessibilityProps, rest),
        children
      );
    };

    // Backdrop,
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

    // On native, use RN Modal,
    if (Platform.OS !== 'web') {
      if (!isOpen) {
        return null;
      }
      return React.createElement(
        RNModal,
        { visible: true, transparent: true, animationType: 'fade', onRequestClose: onClose },
        renderBackdrop(),
        renderContent()
      );
    }

    // On web, use Overlay,
    const overlay = useOverlay({
      isOpen: !!isOpen,
      trap: true,
      onClose: onClose,
      render: function () {
        return React.createElement(
          React.Fragment,
          null,
          renderBackdrop(),
          renderContent()
        );
      }
    });

    if (overlay.layerIndex < 0 && isOpen) {
      return React.createElement(
        RNView,
        { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: Parts.Stacking.modal, alignItems: 'center', justifyContent: 'center' } },
        renderBackdrop(),
        renderContent()
      );
    }

    return null;
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ComposedModal = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ComposedModal;

}/////////////////////////// Component Factory END /////////////////////////////
