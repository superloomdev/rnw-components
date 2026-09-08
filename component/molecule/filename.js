// Info: Filename molecule [S1 presentational]. Displays a filename with
// optional status icon. Uses role="text" for screen reader semantics.
//   name        -> string (the filename to display)
//   status      -> string ('uploading' | 'edit' | 'complete')
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Filename molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Filename component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Filename = function Filename (props) {


    const {
      name, status, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Map status to icon name
    const statusIcon = status === 'uploading'
      ? 'loading'
      : status === 'complete'
        ? 'checkmark'
        : status === 'edit'
          ? 'warning'
          : null;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'text',
        accessibilityLabel: name,
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          style
        ]
      }, rest),
      statusIcon
        ? React.createElement(Registry.Icon, {
          name: statusIcon,
          typeSet: 'label01',
          color: 'text_secondary',
          style: Style.utilities['m_e_spacing_01']
        })
        : null,
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'text_primary'
      }, name || '')
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Filename = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Filename;

}/////////////////////////// Component Factory END /////////////////////////////
