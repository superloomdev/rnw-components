// Info: FileUploader composite [S3 overlay]. A file upload container with
// drag-drop on web and document picker on native. Uses role="group" for
// screen reader semantics. Platform: split (web uses input type=file,
// native uses document picker).
//   label       -> string (uploader label)
//   accept      -> string | array (accepted file types)
//   multiple    -> boolean (allow multiple files)
//   onChange    -> function (called with selected files)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the FileUploader composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The FileUploader component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const FileUploader = function FileUploader (props) {


    const {
      label, accept, multiple, onChange, style, // eslint-disable-line no-unused-vars
      ...rest
    } = props;

    const React = Lib.React;

    // Handle file selection (platform split is P6; contract established here)
    const handlePress = function () {
      if (Lib.Utils.isFunction(onChange)) {
        onChange([]);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    // Build keyboard activation props for the drop area
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'group',
        accessibilityLabel: label,
        style: [
          Style.utilities['flex_col'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['br_radius_08'],
          Style.utilities['p_a_spacing_05'],
          style
        ]
      }, rest),
      label
        ? React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary',
          weight: 'medium',
          style: Style.utilities['m_b_spacing_03']
        }, label)
        : null,
      React.createElement(
        Pressable,
        Object.assign({
          onPress: handlePress,
          accessibilityRole: 'button',
          accessibilityLabel: label || 'Upload files'
        }, ariaProps, pressKeysProps, {
          style: [
            Style.utilities['flex_col'],
            Style.utilities['align_center'],
            Style.utilities['p_a_spacing_05'],
            Style.utilities['br_radius_08'],
            Style.utilities['background_layer_01']
          ]
        }),
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary'
        }, multiple ? 'Drag and drop files or click to select' : 'Drag and drop a file or click to select')
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _FileUploader = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return FileUploader;

}/////////////////////////// Component Factory END /////////////////////////////
