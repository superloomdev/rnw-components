// Info: Overlay provider component.
//
// Renders the root-level overlay host and manages the layer stack.
// Uses the useOverlay hook and OverlayContext from parts/overlay for
// registration so the context identity is shared with consumers.

// Imports
import { View as RNView, Platform as RNPlatform } from 'react-native';


/********************************************************************
Build the Overlay provider component.

@param {Object} Lib    - The shared Lib container (requires React)
@param {Object} CONFIG - Merged configuration (unused; keeps the canonical order)
@param {Object} ERRORS - Frozen error catalog (unused; keeps the canonical order)
@param {Object} Parts  - The built parts object from components.js

@return {Object} - { Overlay, useOverlay, OverlayContext }
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts) {

  const React = Lib.React;
  const OverlayContext = Parts.Overlay.OverlayContext;
  const useOverlay = Parts.Overlay.useOverlay;


  // The provider component, mounted once at app root
  const Overlay = function (props) {

    const children = props.children;

    // Stack of registered overlays: [{ id, trap, onClose }]
    const stackRef = React.useRef([]);
    const stackState = React.useState([]);
    const stack = stackState[0];
    const setStack = stackState[1];


    // Register an overlay layer; returns its index (0-based)
    const register = React.useCallback(function (layer) {

      const id = stackRef.current.length;
      stackRef.current.push(layer);
      setStack(stackRef.current.slice());
      return id;

    }, []);


    // Unregister an overlay layer by id
    const unregister = React.useCallback(function (id) {

      stackRef.current = stackRef.current.filter(function (l) {
        return l.id !== id;
      });
      setStack(stackRef.current.slice());

    }, []);


    const contextValue = {
      layers: stack,
      register: register,
      unregister: unregister
    };


    return React.createElement(
      OverlayContext.Provider,
      { value: contextValue },
      children,
      // Render all overlay layers in a single root-level container
      React.createElement(
        RNView,
        {
          pointerEvents: 'box-none',
          style: {
            position: RNPlatform.OS === 'web' ? 'fixed' : 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: Parts.Stacking.overlay
          }
        },
        stack.map(function (layer) {
          return React.createElement(
            RNView,
            {
              key: layer.id,
              pointerEvents: 'box-none',
              style: {
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: Parts.Stacking.modal + layer.id
              }
            },
            layer.render()
          );
        })
      )
    );

  };


  return {
    Overlay: Overlay,
    useOverlay: useOverlay,
    OverlayContext: OverlayContext
  };

}
