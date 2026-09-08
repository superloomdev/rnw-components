// Info: TruncatedText molecule [S2 interactive]. Text that truncates with an
// ellipsis and expands on press to show the full text. Uses A11y.
//   children    -> string (the text content)
//   maxLines    -> number (max lines before truncation, default 2)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TruncatedText molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TruncatedText component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) { // eslint-disable-line no-unused-vars

  /////////////////////////// Static Constants START ////////////////////////////


  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TruncatedText = function TruncatedText (props) {


    const {
      children, maxLines, style,
      ...rest
    } = props;

    const React = Lib.React;
    const [expanded, setExpanded] = React.useState(false);

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      expanded: expanded
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: function () {
          setExpanded(!expanded);
        },
        accessibilityLabel: expanded ? 'Collapse text' : 'Expand text',
        style: [style]
      }, ariaProps, rest),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'text_primary',
        numberOfLines: expanded ? null : (maxLines || 2)
      }, children)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TruncatedText = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TruncatedText;

}/////////////////////////// Component Factory END /////////////////////////////
