// Info: Link atom [S2 interactive]. A Pressable styled as a hyperlink with
// role="link". Uses A11y for aria-* state.
//   href        -> string (URL, web only)
//   onPress     -> callback
//   disabled    -> boolean
//   children    -> link text content


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Link atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Link component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) { // eslint-disable-line no-unused-vars

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Link = function Link (props) {

    const {
      href, onPress, disabled, children, style,
      accessibilityLabel, ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator,
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled
    });

    // On web, set href for native anchor behavior,
    const webProps = {};

    if (href && Lib.React.Platform && Lib.React.Platform.OS === 'web') {
      webProps.href = href;
    }

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: disabled ? null : onPress,
        disabled: !!disabled,
        accessibilityRole: 'link',
        accessibilityLabel: accessibilityLabel,
        style: [style]
      }, ariaProps, webProps, rest),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: disabled ? 'text_disabled' : 'interactive',
        weight: 'regular'
      }, children)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Link = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Link;

}/////////////////////////// Component Factory END /////////////////////////////
