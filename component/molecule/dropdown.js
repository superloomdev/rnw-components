// Info: Dropdown molecule [S3 overlay] (CANONICAL). A dropdown menu with
// focus trap, Escape/back dismissal, outside-press dismissal, and focus
// restoration. Uses Overlay (M4) for stacking, Parts.AnchoredPosition(M5)
// for panel placement, and useFocusTrap for focus management. Composes
// Button, Text, and Icon atoms.
//
// S3 obligations (all six, same as Modal):
//   1. On open: record focus and move into the dropdown
//   2. While open: trap focus so Tab cycles within the dropdown
//   3. On Escape (web) or hardware back (Android): close
//   4. On outside press: close
//   5. On close: restore focus to the trigger
//   6. Set aria-modal on the overlay container
//
// useAnchoredPosition measures the trigger and positions the panel below it,
// flipping above when there is not enough space.


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Dropdown molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Dropdown component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  // Build the focus trap hook once
  // Build the overlay host hook once,
  const useOverlay = Parts.Overlay.useOverlay;

  // Build the anchored position hook once,

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Dropdown = function Dropdown (props) {


    // Destructure props,
    const {
      triggerLabel, items, onSelect, style,
      accessibilityLabel, ...rest
    } = props;

    const React = Lib.React;
    const [isOpen, setIsOpen] = React.useState(false);

    // Ref to the trigger element for position measurement,
    const triggerRef = React.useRef(null);

    // Close handler,
    const handleClose = function () {
      setIsOpen(false);
    };

    // Use the focus trap hook for all six S3 obligations,
    const focusTrap = Parts.FocusTrap({
      isOpen: isOpen,
      onClose: handleClose
    });

    const containerRef = focusTrap.containerRef;
    const onOutsidePress = focusTrap.onOutsidePress;
    const accessibilityProps = focusTrap.accessibilityProps;

    // Use anchored position for the dropdown panel,
    const anchoredPos = Parts.AnchoredPosition({
      placement: 'bottom-start',
      offset: 4,
      flip: true,
      anchorRef: triggerRef
    });

    // Measure position when the dropdown opens,
    React.useEffect(function () {

      if (isOpen) {
        anchoredPos.measure();
      }

    }, [isOpen]); // anchoredPos.measure is stable via useCallback

    // Toggle the dropdown open/closed,
    const handleTriggerPress = function () {
      setIsOpen(!isOpen);
    };

    // Handle item selection,
    const handleItemSelect = function (item) {

      setIsOpen(false);

      if (Lib.Utils.isFunction(onSelect)) {
        onSelect(item);
      }

    };

    // Build aria state props for the trigger through the a11y translator,
    const triggerAriaProps = Parts.A11y.state({
      expanded: !!isOpen
    });

    // Render the trigger button,
    const trigger = React.createElement(
      Pressable,
      Object.assign({
        ref: triggerRef,
        onPress: handleTriggerPress,
        accessibilityRole: 'button',
        accessibilityLabel: accessibilityLabel || triggerLabel,
        style: [
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['background_layer_02'],
          Style.utilities['flex_row'],
          Style.utilities['align_center']
        ]
      }, triggerAriaProps),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'text_primary'
      }, triggerLabel),
      React.createElement(Registry.Icon, {
        name: isOpen ? 'chevron-up' : 'chevron-down',
        typeSet: 'label01',
        color: 'text_secondary',
        style: Style.utilities['m_s_spacing_01']
      })
    );

    // Nothing more to render when closed,
    if (!isOpen) {
      return trigger;
    }

    // Build the dropdown items,
    const itemElements = (items || []).map(function (item) {
      return React.createElement(
        Pressable,
        {
          key: item.value,
          onPress: function () {
            handleItemSelect(item);
          },
          accessibilityRole: 'menuitem',
          accessibilityLabel: item.label,
          style: [
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_03']
          ]
        },
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary'
        }, item.label)
      );
    });

    // Compute panel position: use anchored position if available, fall back,
    const panelStyle = anchoredPos.position
      ? {
        position: 'absolute',
        top: anchoredPos.position.top,
        left: anchoredPos.position.left,
        minWidth: 200
      }
      : {
        position: 'absolute',
        top: '100%',
        left: 0,
        minWidth: 200
      };

    // Dropdown panel with focus trap,
    const renderPanel = function (zIndex) {
      return React.createElement(
        RNView,
        Object.assign({
          ref: containerRef,
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_08'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['p_v_spacing_01'],
            panelStyle,
            zIndex ? { zIndex: zIndex } : {},
            style
          ]
        }, accessibilityProps, rest),
        itemElements
      );
    };

    // Backdrop for outside-press dismissal,
    const renderBackdrop = function () {
      return React.createElement(Pressable, {
        onPress: onOutsidePress,
        style: {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0
        }
      });
    };

    // On native, render inline with relative positioning,
    if (Platform.OS !== 'web') {
      return React.createElement(
        RNView,
        { style: { position: 'relative' } },
        trigger,
        renderBackdrop(),
        renderPanel(1000)
      );
    }

    // On web, try Overlay for stacking,
    const overlay = useOverlay({
      isOpen: true,
      trap: false,
      onClose: handleClose,
      render: function () {
        return React.createElement(
          React.Fragment,
          null,
          renderBackdrop(),
          renderPanel()
        );
      }
    });

    // When no Overlay is mounted, fall back to relative positioning,
    if (overlay.layerIndex < 0) {
      return React.createElement(
        RNView,
        { style: { position: 'relative' } },
        trigger,
        renderBackdrop(),
        renderPanel(1000)
      );
    }

    // Overlay renders the panel; return just the trigger,
    return trigger;
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Dropdown = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Dropdown;

}/////////////////////////// Component Factory END /////////////////////////////
