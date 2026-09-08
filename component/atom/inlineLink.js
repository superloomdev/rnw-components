// Info: InlineLink atom [S2 interactive]. A text link styled differently
// from Link, for inline placement within text content. Uses role="link".
//   onPress     -> callback
//   title       -> link text content
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the InlineLink atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The InlineLink component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) { // eslint-disable-line no-unused-vars

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const InlineLink = function InlineLink (props) {

    const {
      onPress, title, disabled, style,
      accessibilityLabel, ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator,
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: disabled ? null : onPress,
        disabled: !!disabled,
        accessibilityRole: 'link',
        accessibilityLabel: accessibilityLabel || title,
        style: [style]
      }, ariaProps, rest),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: disabled ? 'text_disabled' : 'interactive',
        weight: 'regular'
      }, title)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _InlineLink = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return InlineLink;

}/////////////////////////// Component Factory END /////////////////////////////
