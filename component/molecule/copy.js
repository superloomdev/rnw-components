// Info: Copy molecule [S2 interactive]. A copy-to-clipboard button. Uses
// role="button" for screen reader semantics. Uses A11y for aria-* state
// and PressKeys for keyboard activation. Platform: split (web uses
// navigator.clipboard, native uses injected clipboard).
//   text        -> string (the text to copy)
//   onSuccess   -> function (callback after successful copy)
//   style       -> custom style overrides


// Imports
import { Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Copy molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Copy component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Copy = function Copy (props) {


    const {
      text, onSuccess, style,
      ...rest
    } = props;

    const React = Lib.React;
    const [copied, setCopied] = React.useState(false);

    // Handle copy action
    const handlePress = function () {

      // Web: use navigator.clipboard; native: use injected Lib.Clipboard
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' &&
            navigator.clipboard &&
            Lib.Utils.isFunction(navigator.clipboard.writeText)) {
          navigator.clipboard.writeText(text);
        }
      } else if (Lib.Clipboard && Lib.Utils.isFunction(Lib.Clipboard.setString)) {
        Lib.Clipboard.setString(text);
      }

      setCopied(true);
      setTimeout(function () {
        setCopied(false);
      }, 2000);

      if (Lib.Utils.isFunction(onSuccess)) {
        onSuccess(text);
      }

    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      pressed: copied
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        accessibilityRole: 'button',
        accessibilityLabel: 'Copy to clipboard'
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['background_layer_02'],
          style
        ]
      }, rest),
      React.createElement(Registry.Icon, {
        name: copied ? 'checkmark' : 'copy',
        typeSet: 'label01',
        color: 'text_secondary',
        style: Style.utilities['m_e_spacing_01']
      }),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'text_primary'
      }, copied ? 'Copied!' : 'Copy')
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Copy = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Copy;

}/////////////////////////// Component Factory END /////////////////////////////
