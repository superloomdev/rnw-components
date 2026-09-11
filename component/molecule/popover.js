// Info: Popover molecule [S3 overlay]. A floating content panel anchored to
// a trigger. Uses A11y, Overlay, AnchoredPosition.
// Uses useFocusTrap with trap: false (Popover does not trap focus).
//   isOpen      -> boolean
//   onClose     -> function
//   placement   -> string (default 'top')
//   content     -> node (popover content)
//   children    -> trigger element
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Popover molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Popover component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Popover = function Popover (props) {


    const {
      isOpen, onClose, placement, content, children, style,
      ...rest
    } = props;

    const React = Lib.React;
    const anchorRef = React.useRef(null);

    // Focus trap with trap: false (popover does not trap)
    const focusTrap = Parts.FocusTrap({
      isOpen: isOpen,
      onClose: onClose,
      trap: false
    });

    // Anchored position calculation
    const anchoredPos = Parts.AnchoredPosition({
      placement: placement || 'top',
      offset: 8,
      flip: true,
      anchorRef: anchorRef
    });

    // Measure position when open
    React.useEffect(function () {
      if (isOpen) {
        anchoredPos.measure();
      }
    }, [isOpen]);

    // Build aria relation props
    const contentId = React.useRef(Parts.A11y.id('popover')).current;
    const ariaProps = Parts.A11y.relation({
      describedby: isOpen ? contentId : null
    });

    // Render the popover content panel
    const renderContent = function (zIndex) {
      const pos = anchoredPos.position || { top: 0, left: 0 };
      return React.createElement(
        RNView,
        Object.assign({
          id: contentId,
          ref: focusTrap.containerRef,
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_08'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['p_a_spacing_05'],
            {
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              zIndex: zIndex || 1000
            },
            style
          ]
        }, focusTrap.accessibilityProps, rest),
        content
      );
    };

    // Render backdrop for outside press
    const renderBackdrop = function () {
      return React.createElement(Pressable, {
        onPress: focusTrap.onOutsidePress,
        style: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0
        }
      });
    };

    // Call useOverlay unconditionally (hook-order safety). The hook
    // internally gates on isOpen, so it is a no-op when closed.
    const overlay = useOverlay({
      isOpen: isOpen,
      trap: false,
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

    // Guard: children must be a valid React element for cloneElement
    if (!children || !React.isValidElement(children)) {
      return null;
    }

    // On native, render inline
    if (Platform.OS !== 'web') {
      return React.createElement(
        RNView,
        { style: { position: 'relative' } },
        React.cloneElement(children, { ref: anchorRef }),
        isOpen ? renderBackdrop() : null,
        isOpen ? renderContent(1000) : null
      );
    }

    // Clone trigger with anchor ref and aria props
    const trigger = React.cloneElement(children, Object.assign({
      ref: anchorRef
    }, ariaProps));

    if (overlay.layerIndex < 0 && isOpen) {
      // Fallback: no Overlay mounted
      return React.createElement(
        RNView,
        { style: { position: 'relative' } },
        trigger,
        renderBackdrop(),
        renderContent(1000)
      );
    }

    return trigger;
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Popover = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Popover;

}/////////////////////////// Component Factory END /////////////////////////////
