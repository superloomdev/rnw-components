// Info: FileUploaderItem molecule [S2 interactive]. A single uploaded file
// item with name and remove button. Uses role="listitem" for screen reader
// semantics. Uses A11y for aria-* state and PressKeys for
// keyboard activation on the remove button.
//   filename    -> string (name of the uploaded file)
//   status      -> string ('uploading' | 'edit' | 'complete')
//   onRemove    -> function (called when remove is pressed)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the FileUploaderItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The FileUploaderItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const FileUploaderItem = function FileUploaderItem (props) {


    const {
      filename, status, onRemove, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Handle remove press
    const handleRemove = function () {
      if (Lib.Utils.isFunction(onRemove)) {
        onRemove();
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    // Build keyboard activation props for the remove button
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handleRemove,
      disabled: false
    });

    // Map status to icon name
    const statusIcon = status === 'uploading'
      ? 'loading'
      : status === 'complete'
        ? 'checkmark'
        : 'warning';

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'listitem',
        accessibilityLabel: filename,
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          style
        ]
      }, rest),
      React.createElement(Registry.Icon, {
        name: statusIcon,
        typeSet: 'label01',
        color: 'text_secondary',
        style: Style.utilities['m_e_spacing_03']
      }),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'text_primary',
        style: { flex: 1 }
      }, filename || ''),
      React.createElement(
        Pressable,
        Object.assign({
          onPress: handleRemove,
          accessibilityRole: 'button',
          accessibilityLabel: 'Remove ' + (filename || 'file')
        }, ariaProps, pressKeysProps, {
          style: [
            Style.utilities['p_a_spacing_01'],
            { minWidth: CONFIG.MIN_HIT_TARGET, minHeight: CONFIG.MIN_HIT_TARGET }
          ]
        }),
        React.createElement(Registry.Icon, {
          name: 'close',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _FileUploaderItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return FileUploaderItem;

}/////////////////////////// Component Factory END /////////////////////////////
