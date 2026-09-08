// Info: FileUploaderDropContainer molecule [S2 interactive]. A drag-drop area
// for files. Uses role="button" for screen reader semantics. Uses A11y
// for aria-* state and PressKeys for keyboard activation.
//   onDrop      -> function (called with dropped files)
//   label       -> string (drop area label)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the FileUploaderDropContainer molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The FileUploaderDropContainer component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const FileUploaderDropContainer = function FileUploaderDropContainer (props) {


    const {
      onDrop, label, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Handle press (simulates drop on native where drag-drop is unavailable)
    const handlePress = function () {
      if (Lib.Utils.isFunction(onDrop)) {
        onDrop([]);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

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
        accessibilityLabel: label || 'Drop files here'
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['flex_col'],
          Style.utilities['align_center'],
          Style.utilities['justify_center'],
          Style.utilities['p_a_spacing_06'],
          Style.utilities['br_radius_08'],
          {
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: Style.tokens.Color.border_subtle_01
          },
          style
        ]
      }, rest),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'text_secondary'
      }, label || 'Drag and drop files here or click to browse')
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _FileUploaderDropContainer = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return FileUploaderDropContainer;

}/////////////////////////// Component Factory END /////////////////////////////
