// Info: CopyButton molecule [S2 interactive]. A button that copies text to
// clipboard and shows a success state. Uses A11y for aria-* state and
// useAnnounce for screen reader announcement of the copy action.
//   text        -> string (the text to copy)
//   label       -> string (button label, default 'Copy')
//   onCopy      -> function (callback after copy)
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the CopyButton molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The CopyButton component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const CopyButton = function CopyButton (props) {


    const {
      text, label, onCopy, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;
    const [copied, setCopied] = React.useState(false);

    // Handle copy action
    const handlePress = function () {
      if (disabled) {
        return;
      }

      // Use clipboard if available
      if (Lib.Clipboard && Lib.Utils.isFunction(Lib.Clipboard.setString)) {
        Lib.Clipboard.setString(text);
      }

      setCopied(true);
      setTimeout(function () {
        setCopied(false);
      }, 2000);

      if (Lib.Utils.isFunction(onCopy)) {
        onCopy(text);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      pressed: copied
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        disabled: !!disabled,
        accessibilityRole: 'button',
        accessibilityLabel: label || 'Copy',
        style: [
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['background_layer_02'],
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          style
        ]
      }, ariaProps, rest),
      React.createElement(Registry.Icon, {
        name: copied ? 'checkmark' : 'copy',
        typeSet: 'label01',
        color: 'text_secondary',
        style: Style.utilities['m_e_spacing_01']
      }),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: disabled ? 'text_disabled' : 'text_primary'
      }, copied ? 'Copied!' : (label || 'Copy'))
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _CopyButton = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return CopyButton;

}/////////////////////////// Component Factory END /////////////////////////////
