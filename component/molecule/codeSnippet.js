// Info: CodeSnippet molecule [S1/S2]. A code display block with optional copy
// button. Uses A11y for aria-* and useAnnounce for copy feedback.
//   code        -> string (the code to display)
//   language    -> string (language label, e.g. 'javascript')
//   showCopy    -> boolean (default true)
//   onCopy      -> function (callback after copy)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the CodeSnippet molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The CodeSnippet component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const CodeSnippet = function CodeSnippet (props) {


    const {
      code, language, showCopy, onCopy, style, // eslint-disable-line no-unused-vars
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        style: [
          {
            ...Style.utilities['background_layer_01'],
            ...Style.utilities['br_radius_04'],
            padding: 12,
            fontFamily: 'monospace'
          },
          style
        ]
      }, rest),
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: 'text_primary',
        style: { fontFamily: 'monospace' }
      }, code || ''),
      showCopy !== false
        ? React.createElement(Registry.CopyButton, {
          text: code || '',
          label: 'Copy code',
          onCopy: onCopy,
          style: { marginTop: 8 }
        })
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _CodeSnippet = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return CodeSnippet;

}/////////////////////////// Component Factory END /////////////////////////////
