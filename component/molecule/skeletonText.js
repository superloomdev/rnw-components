// Info: SkeletonText molecule [S1 presentational]. A skeleton placeholder for
// text. Uses role="img" for screen reader semantics.
//   lines       -> number (default 3)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SkeletonText molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SkeletonText component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SkeletonText = function SkeletonText (props) {


    const {
      lines, style,
      ...rest
    } = props;

    const React = Lib.React;
    const lineCount = lines || 3;

    const lineElements = [];
    for (let i = 0; i < lineCount; i++) {
      const isLast = i === lineCount - 1;
      lineElements.push(React.createElement(RNView, {
        key: i,
        style: {
          width: isLast ? '60%' : '100%',
          height: 16,
          ...Style.utilities['br_radius_02'],
          marginBottom: isLast ? 0 : 8,
          ...Style.utilities['background_layer_01']
        }
      }));
    }

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'img',
        accessibilityLabel: 'Loading text',
        style: style
      }, rest),
      lineElements
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SkeletonText = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SkeletonText;

}/////////////////////////// Component Factory END /////////////////////////////
