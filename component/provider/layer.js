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
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const React = Lib.React;
  const createContext = React.createContext;

  // Context holds an integer 0 through 3 (base + layer-01/02/03)
  const LayerContext = createContext(0);
  LayerContext.displayName = 'LayerContext';

  // Hook for descendants to read the current layer
  const useLayer = function () {
    return React.useContext(LayerContext);
  };

  // Hook for descendants to get the token suffix for the current layer.
  // Reads the available layer keys from Style.tokens.Color so the layer
  // prop accepts background, layer_01, layer_02, layer_03 by reading the
  // contract, not a hardcoded list (D14).
  const useLayerToken = function () {
    const level = React.useContext(LayerContext);

    // Read the layer keys from the contract: the `background` token plus
    // every `layer_*` color token, in the order the contract declares them.
    const colorKeys = Object.keys(Style.tokens.Color);
    const keys = [];
    for (let i = 0; i < colorKeys.length; i++) {
      const k = colorKeys[i];
      if (k === 'background' || k.indexOf('layer_') === 0) {
        keys.push(k);
      }
    }
    if (Lib.Utils.isEmptyArray(keys)) {
      keys.push('background');
    }
    return keys[level] || keys[0];
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
    LayerContext: LayerContext
  };

}/////////////////////////// Component Factory END /////////////////////////////
