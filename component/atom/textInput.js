// Info: TextInput atom [S2 interactive]. A themed single-line input.
// When framed, the atom owns the border, focus ring, invalid state, and
// disabled state. When unframed, a composite wrapper owns the frame and
// the atom renders padding, type style, and text color only. In both
// paths the UA focus outline is suppressed (outlineStyle: 'none') so the
// frame owner renders focus through the border color, never the browser.
// Passes accessibilityRole and aria-* for screen readers.


// Imports
import { TextInput as RNTextInput } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TextInput atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition, Frame }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The TextInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TextInput = function TextInput (props) {

    // Destructure props
    const {
      style, accessibilityLabel, isInvalid, isDisabled, typeSet, unframed,
      onFocus, onBlur, ...rest
    } = props;

    const React = Lib.React;
    const [focused, setFocused] = React.useState(false);

    // Resolve type style: typeSet takes precedence, then default type_body01
    const typeKey = typeSet ? 'type_' + typeSet : 'type_body01';
    const typeStyle = Style.utilities[typeKey];

    // Resolve text color from the spec sheet state entry
    const sheet = Parts.Spec('textInput');
    let stateName;
    if (isDisabled) {
      stateName = 'disabled';
    } else if (isInvalid) {
      stateName = 'invalid';
    } else if (focused) {
      stateName = 'focus';
    } else {
      stateName = 'rest';
    }
    const textToken = sheet.states[stateName].text.replace(/^color\./, '');
    const textColor = Style.utilities['font_' + textToken];

    // Resolve frame mode from the feedback.field token (underline | outline)
    const frameMode = Style.tokens.Feedback.field || 'underline';

    // The UA focus outline is always suppressed; the frame owner (this atom
    // when framed, or the composite wrapper when unframed) renders focus
    // through the border color.
    const noOutline = { outlineStyle: 'none', outlineWidth: 0 };

    // When unframed, skip border/radius/background - the parent owns the shell.
    // Padding, type style, and text color remain so the text is not flush
    // against the border. minWidth: 0 prevents the intrinsic min-width
    // overflow on web.
    const base = unframed
      ? [
        { minWidth: 0 },
        Style.utilities['p_h_spacing_05'],
        Style.utilities['p_v_spacing_03'],
        typeStyle,
        textColor,
        noOutline
      ]
      : [
        { minWidth: 0 },
        Style.utilities['p_h_spacing_05'],
        Style.utilities['p_v_spacing_03'],
        typeStyle,
        textColor,
        noOutline,
        ...Parts.Frame.resolve({
          mode: frameMode,
          focused: focused,
          invalid: !!isInvalid,
          disabled: !!isDisabled
        })
      ];

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!isDisabled,
      invalid: !!isInvalid
    });

    return Lib.React.createElement(
      RNTextInput,
      Object.assign({
        style: [...base, style],
        placeholderTextColor: Style.tokens.Color.text_secondary,
        editable: !isDisabled,
        accessibilityRole: 'textbox',
        accessibilityLabel: accessibilityLabel,
        onFocus: function (e) {

          setFocused(true);

          if (Lib.Utils.isFunction(onFocus)) {
            onFocus(e);
          }

        },
        onBlur: function (e) {

          setFocused(false);

          if (Lib.Utils.isFunction(onBlur)) {
            onBlur(e);
          }

        }
      }, ariaProps, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TextInput = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TextInput;

}/////////////////////////// Component Factory END /////////////////////////////
