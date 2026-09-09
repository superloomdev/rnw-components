// Info: AspectRatio atom [S1 presentational]. A wrapper that maintains a
// consistent width-to-height ratio for its children. No mechanisms needed.
//   ratio       -> number (width/height, default 1)
//   children    -> content to render inside
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the AspectRatio atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The AspectRatio component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) { // eslint-disable-line no-unused-vars

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const AspectRatio = function AspectRatio (props) {

    const {
      ratio, children, style,
      ...rest
    } = props;

    const React = Lib.React;
    const r = Lib.Utils.isNumber(ratio) ? ratio : 1;

    return React.createElement(
      RNView,
      Object.assign({ style: [style] }, rest),
      React.createElement(RNView, {
        style: {
          flex: 1,
          aspectRatio: r
        }
      }, children)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _AspectRatio = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return AspectRatio;

}/////////////////////////// Component Factory END /////////////////////////////
