// Info: Skeleton atom [S1 presentational]. A placeholder for loading states.
// Sets aria-hidden so screen readers skip placeholder content. Uses A11y
// for the aria-hidden prop.
//   variant    -> 'text' | 'icon' | 'placeholder' (default 'text')
//   lines      -> number (for text variant, default 1)
//   width      -> number or string (default '100%')
//   height     -> number or string (default 16 for text, 48 for placeholder)
//   style      -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Skeleton atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Skeleton component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Skeleton = function Skeleton (props) {

    const {
      variant, lines, width, height, style,
      ...rest
    } = props;

    const React = Lib.React;
    const v = variant || 'text';

    // Build aria-hidden through the a11y translator
    const ariaProps = Parts.A11y.state({
      hidden: true
    });

    // Default dimensions per variant
    const defaultHeight = v === 'placeholder' ? 48 : v === 'icon' ? 24 : 16;
    const resolvedHeight = height || defaultHeight;
    const resolvedWidth = width || '100%';
    const lineCount = lines || 1;

    // Build skeleton box style
    const boxStyle = {
      backgroundColor: Style.tokens.Color.layer_01,
      borderRadius: v === 'text' ? 2 : 4,
      height: resolvedHeight,
      width: resolvedWidth
    };

    // For text variant with multiple lines, render stacked boxes
    if (v === 'text' && lineCount > 1) {
      const lineElements = [];

      for (let i = 0; i < lineCount; i++) {
        const isLast = i === lineCount - 1;
        lineElements.push(React.createElement(RNView, {
          key: i,
          style: [boxStyle, {
            width: isLast ? '60%' : '100%',
            marginBottom: isLast ? 0 : 8
          }]
        }));
      }

      return React.createElement(
        RNView,
        Object.assign({ style: style }, ariaProps, rest),
        lineElements
      );
    }

    return React.createElement(
      RNView,
      Object.assign({ style: [boxStyle, style] }, ariaProps, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Skeleton = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Skeleton;

}/////////////////////////// Component Factory END /////////////////////////////
