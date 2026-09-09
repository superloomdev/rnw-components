// Info: Overlay provider and useOverlay hook.
//
// Replaces the upstream Portal. A provider plus a hook, owning a stack of
// overlay layers. Maintains an ordered stack so a Popover opened from
// inside a Modal paints above it. Assigns zIndex from the stack position.
// Only the topmost trapping layer traps focus. Escape dismisses the
// topmost layer only.
//
// On native, renders through a single root-level absolute View rather
// than RN Modal, because RN Modal always traps focus and cannot express
// a non-modal popover.
//
// Contexts are created once per loader call, in createInterface, and
// stored on state.contexts. They are NOT created inside build.

// Imports
// No React Native imports needed in the hook itself.


/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils, Debug, React
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - { useOverlay, OverlayContext }
*********************************************************************/
export default function (shared_libs, config, errors) { // eslint-disable-line no-unused-vars

  // Capture shared libraries for this part
  const Lib = { Utils: shared_libs.Utils, Debug: shared_libs.Debug, React: shared_libs.React };

  // Delegate to createInterface to build the public API
  return createInterface(Lib);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Build the Overlay context and useOverlay hook.

@param {Object} Lib - The shared Lib container (requires React)

@return {Object} - { useOverlay, OverlayContext }
*********************************************************************/
const createInterface = function (Lib) {


  ///////////////////////////Public Functions START//////////////////////////////

  // The default context value: no host mounted
  const OverlayContext = Lib.React.createContext({
    layers: [],
    register: function () {
      // No host mounted; return an invalid layer index
      return -1;
    },
    unregister: function () {}
  });


  /********************************************************************
  Hook for overlay components to register themselves with the host.

  @param {Object} options
  @param {Boolean}  options.isOpen - Whether the overlay is open
  @param {Boolean}  [options.trap] - Whether this layer traps focus
  @param {Function} options.onClose - Called on Escape/outside dismissal
  @param {Function} options.render - Function returning the overlay children

  @return {Object} - { layerIndex, zIndex }
  *********************************************************************/
  const useOverlay = function (options) {

    // Destructure overlay options: isOpen, trap, onClose, render
    const isOpen = options.isOpen;
    const trap = options.trap;
    const onClose = options.onClose;
    const render = options.render;

    // Access the overlay host context and prepare a layer id ref
    const ctx = Lib.React.useContext(OverlayContext);
    const layerIdRef = Lib.React.useRef(-1);


    // Register on open, unregister on close
    Lib.React.useEffect(function () {

      // Register the overlay layer when it opens
      if (isOpen) {
        layerIdRef.current = ctx.register({
          id: ctx.layers.length,
          trap: trap,
          onClose: onClose,
          render: render
        });
      }

      // Unregister the layer on cleanup to keep the stack in sync
      return function () {
        // Only unregister if a layer was actually registered
        if (layerIdRef.current >= 0) {
          ctx.unregister(layerIdRef.current);
          layerIdRef.current = -1;
        }
      };

    }, [isOpen]);


    // Update the layer when trap/onClose/render change
    Lib.React.useEffect(function () {

      // Re-register the layer with updated options when they change
      if (layerIdRef.current >= 0 && isOpen) {
        // Re-register with updated values
        ctx.unregister(layerIdRef.current);
        layerIdRef.current = ctx.register({
          id: ctx.layers.length,
          trap: trap,
          onClose: onClose,
          render: render
        });
      }

    }, [trap, onClose, render]);


    // Return the layer index and computed z-index
    return {
      layerIndex: layerIdRef.current,
      zIndex: layerIdRef.current >= 0 ? 1000 + layerIdRef.current : undefined
    };

  };


  // Expose the hook and context to consumers
  return {
    useOverlay: useOverlay,
    OverlayContext: OverlayContext
  };

};/////////////////////////// createInterface END //////////////////////////////
