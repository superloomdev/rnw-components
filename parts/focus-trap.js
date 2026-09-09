// Info: Shared focus-trap hook for overlay components (Modal, Dropdown,
// Popover, ComposedModal, SidePanel).
//
// Implements the six obligations of a managed overlay:
//   1. On open: record the last focused element and move focus into the overlay
//   2. While open: trap focus so Tab cycles within the overlay (when trap=true)
//   3. On Escape (web) or hardware back (Android): close
//   4. On outside press: close
//   5. On close: restore focus to the recorded element
//   6. Set aria-modal on the overlay container (web) for screen reader trapping
//
// The `trap` boolean controls whether Tab cycling is active. Modal uses
// trap=true; Popover uses trap=false (focus moves in but does not cycle).
//
// On web, Tab cycling uses the DOM focusable elements query. On native,
// the overlay structure handles VoiceOver focus trapping.

// Imports
import { Platform as RNPlatform, BackHandler as RNBackHandler, AccessibilityInfo as RNAccessibilityInfo } from 'react-native';


/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils, Debug, React
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Function} - useFocusTrap hook
*********************************************************************/
export default function (shared_libs, config, errors) { // eslint-disable-line no-unused-vars

  // Collect the shared libs needed by the focus trap hook
  const Lib = { Utils: shared_libs.Utils, Debug: shared_libs.Debug, React: shared_libs.React };

  // Return the useFocusTrap hook built from the shared libs
  return createInterface(Lib);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Build the useFocusTrap hook. Returns a React hook that manages focus
trapping for an overlay component.

@param {Object} Lib - The shared Lib container (requires React, Debug)

@return {Function} - useFocusTrap(options) -> { containerRef, onKeyDown, onOutsidePress }
*********************************************************************/
const createInterface = function (Lib) {


  ///////////////////////////Public Functions START//////////////////////////////

  /********************************************************************
  React hook that traps focus within an overlay while it is open.

  @param {Object}   options
  @param {Boolean}  options.isOpen        - Whether the overlay is currently open
  @param {Function} options.onClose       - Called when Escape or outside press dismisses
  @param {Object}   [options.initialFocusRef] - Ref to focus on open (defaults to first focusable)
  @param {Object}   [options.finalFocusRef]   - Ref to focus on close (defaults to trigger)

  @return {Object} - { containerRef, onOutsidePress, accessibilityProps }
  *********************************************************************/
  const useFocusTrap = function (options) {

    // Destructure focus trap options: isOpen, onClose, initialFocusRef, finalFocusRef, trap
    const isOpen = options.isOpen;
    const onClose = options.onClose;
    const initialFocusRef = options.initialFocusRef;
    const finalFocusRef = options.finalFocusRef;
    const trap = options.trap !== false; // default true; Popover passes false

    // Ref to the overlay container element
    const containerRef = Lib.React.useRef(null);

    // Record the last focused element for restoration on close
    const previousFocusRef = Lib.React.useRef(null);


    // On open: record previous focus and move focus into the overlay
    Lib.React.useEffect(function () {

      // Bail out when the overlay is not open
      if (!isOpen) {
        return;
      }

      // Record the currently focused element for restoration on close
      if (RNPlatform.OS === 'web' && typeof document !== 'undefined') {
        previousFocusRef.current = document.activeElement;
      }

      // Move focus into the overlay
      if (initialFocusRef && initialFocusRef.current) {
        // Focus the explicitly specified element
        if (Lib.Utils.isFunction(initialFocusRef.current.focus)) {
          initialFocusRef.current.focus();
        }
      } else if (containerRef.current && Lib.Utils.isFunction(containerRef.current.focus)) {
        // Focus the container itself as the default
        containerRef.current.focus();
      }

      // On native, set accessibility focus on the container for VoiceOver
      if (RNPlatform.OS !== 'web' && containerRef.current) {
        // AccessibilityInfo.setAccessibilityFocus needs a reactTag;
        // called multiple times as a workaround for RN async layout timing
        RNAccessibilityInfo.setAccessibilityFocus(containerRef.current);
        RNAccessibilityInfo.setAccessibilityFocus(containerRef.current);
      }

    }, [isOpen]);


    // Escape key and hardware back handler
    Lib.React.useEffect(function () {

      // Bail out when the overlay is not open
      if (!isOpen) {
        return;
      }

      // Web: listen for Escape key
      if (RNPlatform.OS === 'web' && typeof document !== 'undefined') {

        const handleKeyDown = function (event) {

          // Close the overlay when Escape is pressed
          if (event.key === 'Escape') {
            onClose();
          }

        };

        // Attach the keydown listener to the document
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup: remove the keydown listener
        return function () {
          document.removeEventListener('keydown', handleKeyDown);
        };

      }

      // Android: hardware back button
      if (RNPlatform.OS === 'android') {

        const handleBackPress = function () {

          // Close the overlay on hardware back press
          onClose();

          // Return true to prevent default back behavior
          return true;

        };

        // Attach the back press handler to the Android back handler
        RNBackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Cleanup: remove the back handler
        return function () {
          RNBackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };

      }

    }, [isOpen, onClose]);


    // Tab cycling on web: trap focus within the container (only when trap=true)
    Lib.React.useEffect(function () {

      // Bail out when trapping is disabled or not on web
      if (!isOpen || !trap || RNPlatform.OS !== 'web' || typeof document === 'undefined') {
        return;
      }

      // Define the Tab key handler that cycles focus within the container
      const handleTabKey = function (event) {

        // Only handle Tab key
        if (event.key !== 'Tab') {
          return;
        }

        // Find all focusable elements within the container
        const container = containerRef.current;

        // Bail out when the container ref is not available
        if (!container) {
          return;
        }

        // Query focusable elements in DOM order
        const focusable = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Prevent Tab navigation when there are no focusable elements
        if (Lib.Utils.isEmptyArray(focusable)) {
          event.preventDefault();
          return;
        }

        // Identify the first and last focusable elements for wrap-around
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        // Tab on last element wraps to first
        if (event.shiftKey) {
          // Shift+Tab on first element wraps to last
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          // Tab on last element wraps to first
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }

      };

      // Attach the Tab key listener to the document
      document.addEventListener('keydown', handleTabKey);

      // Cleanup: remove the Tab key listener
      return function () {
        document.removeEventListener('keydown', handleTabKey);
      };

    }, [isOpen, trap]);


    // On close: restore focus to the last focused element
    Lib.React.useEffect(function () {

      // Bail out when the overlay is still open
      if (isOpen) {
        return;
      }

      // Restore focus to the trigger element
      if (finalFocusRef && finalFocusRef.current && Lib.Utils.isFunction(finalFocusRef.current.focus)) {
        finalFocusRef.current.focus();
      } else if (previousFocusRef.current && Lib.Utils.isFunction(previousFocusRef.current.focus)) {
        previousFocusRef.current.focus();
      }

    }, [isOpen]);


    // Accessibility props for the overlay container
    // aria-modal replaces the deprecated iOS modal and Android important
    // accessibility props, which are no-ops on web
    const accessibilityProps = {
      accessibilityRole: 'dialog',
      'aria-modal': true,
      focusable: true
    };


    // Outside press handler for the backdrop
    const onOutsidePress = function () {

      // Close the overlay when the backdrop is pressed
      onClose();

    };


    // Return the container ref, outside press handler, and accessibility props
    return {
      containerRef: containerRef,
      onOutsidePress: onOutsidePress,
      accessibilityProps: accessibilityProps
    };

  };


  // Return the public useFocusTrap hook
  return useFocusTrap;

};/////////////////////////// createInterface END //////////////////////////////
