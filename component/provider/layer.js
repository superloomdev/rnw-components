// Info: Layer provider [PROVIDER]. Auto-increments an elevation level on
// nesting so descendants pick the next surface token. Uses
// createCompoundContext. Context holds an integer 0 through 2.
//
// Layer mapping to layer semantics:
//   0 -> base (background)
//   1 -> layer-01
//   2 -> layer-02
//   3 -> layer-03 (clamped from higher values)
//
//   children    -> content to render within the layer context
//   level       -> number (optional override; defaults to parent level + 1)


// Imports
// None.


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Layer provider.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { ... }
@param {Object} Registry - Component registry (unused by providers)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Object} - The Layer provider interface
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) { // eslint-disable-line no-unused-vars

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const React = Lib.React;
  const createContext = React.createContext;

  // Context holds an integer 0 through 3 (base + layer-01/02/03)
  const LayerContext = createContext(0);
  LayerContext.displayName = 'LayerContext';

  // Mapping from layer numbers to token name suffixes
  const LAYER_TOKEN_SUFFIXES = ['background', 'layer_01', 'layer_02', 'layer_03'];

  // Hook for descendants to read the current layer
  const useLayer = function () {
    return React.useContext(LayerContext);
  };

  // Hook for descendants to get the token suffix for the current layer
  const useLayerToken = function () {
    const level = React.useContext(LayerContext);
    return LAYER_TOKEN_SUFFIXES[level] || LAYER_TOKEN_SUFFIXES[0];
  };

  // Provider component
  const Layer = function (props) {

    const overrideLevel = props.level;
    const children = props.children;

    // Read parent layer, default to 0
    const parentLayer = React.useContext(LayerContext);

    // Compute this layer's level: override, or parent + 1, clamped to 0-3
    const myLevel = Lib.Utils.isNumber(overrideLevel)
      ? Parts.Units.clamp(overrideLevel, 0, 3)
      : Parts.Units.clamp(parentLayer + 1, 0, 3);

    return React.createElement(
      LayerContext.Provider,
      { value: myLevel },
      children
    );

  };
  ////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Layer = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the provider interface
  return {
    Layer: Layer,
    useLayer: useLayer,
    useLayerToken: useLayerToken,
    LayerContext: LayerContext,
    LAYER_TOKEN_SUFFIXES: LAYER_TOKEN_SUFFIXES
  };

}/////////////////////////// Component Factory END /////////////////////////////
