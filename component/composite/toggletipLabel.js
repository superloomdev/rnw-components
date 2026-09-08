// Info: ToggletipLabel composite [S1/S3]. A label with an inline toggletip
// that shows additional content on interaction. Uses A11y for aria-*
// state and role="group" for screen reader semantics. Composes the
// Toggletip molecule for the tooltip behavior.
//   label             -> the label text
//   toggletipContent  -> content to show in the toggletip
//   children          -> additional content (optional)
//   style             -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ToggletipLabel composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ToggletipLabel component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ToggletipLabel = function ToggletipLabel (props) {


    const {
      label, toggletipContent, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build aria props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'group',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          style
        ]
      }, ariaProps, rest),
      // Label text
      label
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary',
          weight: 'medium',
          style: Style.utilities['m_e_spacing_01']
        }, label)
        : null,
      // Toggletip with content; pass an info icon as the trigger child
      React.createElement(Registry.Toggletip, {
        content: toggletipContent
      }, React.createElement(Registry.Icon, {
        name: 'information',
        typeSet: 'label01',
        color: 'text_secondary'
      })),
      // Additional children
      children || null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ToggletipLabel = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ToggletipLabel;

}/////////////////////////// Component Factory END /////////////////////////////
