// Info: Modal molecule [S3 overlay] (CANONICAL). A dialog overlay with focus
// trap, Escape/back dismissal, outside-press dismissal, and focus restoration.
// Uses Overlay (M4) for stacking and useFocusTrap for focus management.
//
// S3 obligations (all six, from the plan):
//   1. On open: record the last focused element and move focus into the overlay
//   2. While open: trap focus so Tab cycles within the overlay
//   3. On Escape (web) or hardware back (Android): close
//   4. On outside press: close
//   5. On close: restore focus to the recorded element
//   6. Set aria-modal on the overlay container for screen reader trapping
//
// Overlay integration: registers with the host so a Popover opened from
// inside a Modal paints above it. The host assigns zIndex from the stack
// position. On native, uses RN Modal for hardware back support.


// Imports
import { View as RNView, Pressable, Modal as RNModal, Platform, Animated } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Modal molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition, Motion }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Modal component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  // Build the focus trap hook once
  // Build the overlay host hook once,
  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Modal = function Modal (props) {


    // Destructure props,
    const {
      isOpen, onClose, children, style,
      initialFocusRef, finalFocusRef, ...rest
    } = props;

    const React = Lib.React;

    // Entrance animation driven by motion tokens (D18)
    const animatedOpacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(function () {
      if (isOpen) {
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: Style.tokens.Motion.duration_moderate_02,
          easing: Parts.Motion.toEasing(Style.tokens.Motion.easing_entrance_productive).easing || undefined,
          useNativeDriver: true
        }).start();
      }
    }, [isOpen]);

    // Use the focus trap hook for all six S3 obligations
    // trap=true for Modal: Tab cycles within the dialog,
    const focusTrap = Parts.FocusTrap({
      isOpen: isOpen,
      onClose: onClose,
      trap: true,
      initialFocusRef: initialFocusRef,
      finalFocusRef: finalFocusRef
    });

    const containerRef = focusTrap.containerRef;
    const onOutsidePress = focusTrap.onOutsidePress;
    const accessibilityProps = focusTrap.accessibilityProps;

    // Backdrop: pressable overlay that closes on outside press,
    const renderBackdrop = function () {
      return React.createElement(Pressable, {
        onPress: onOutsidePress,
        style: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          ...Style.utilities['background_overlay']
        }
      });
    };

    // Content container with focus trap accessibility props,
    const renderContent = function () {
      return React.createElement(
        Animated.View,
        { style: { opacity: animatedOpacity } },
        React.createElement(
          RNView,
          Object.assign({
            ref: containerRef,
            style: [
              Style.utilities['background_layer_02'],
              Style.utilities['br_radius_12'],
              Style.utilities['p_a_spacing_06'],
              Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
              {
                margin: 24,
                maxWidth: 600,
                alignSelf: 'center'
              },
              style
            ]
          }, accessibilityProps, rest),
          children
        )
      );
    };

    // Call useOverlay unconditionally (hook-order safety). The hook
    // internally gates on isOpen, so it is a no-op when closed.
    const overlay = useOverlay({
      isOpen: isOpen,
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

    // On native, use RN Modal for native modal behavior + hardware back,
    if (Platform.OS !== 'web') {

      if (!isOpen) {
        return null;
      }

      return React.createElement(
        RNModal,
        {
          visible: isOpen,
          transparent: true,
          animationType: 'none',
          onRequestClose: onClose
        },
        renderBackdrop(),
        renderContent()
      );

    }

    // When no Overlay is mounted, fall back to fixed positioning,
    if (overlay.layerIndex < 0) {

      if (!isOpen) {
        return null;
      }

      return React.createElement(
        RNView,
        {
          style: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: Parts.Stacking.modal,
            alignItems: 'center',
            justifyContent: 'center'
          }
        },
        renderBackdrop(),
        renderContent()
      );

    }

    // Overlay renders the content; return null here,
    return null;
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Modal = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Modal;

}/////////////////////////// Component Factory END /////////////////////////////
