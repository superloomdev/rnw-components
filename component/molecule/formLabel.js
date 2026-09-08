// Info: FormLabel molecule [S1 presentational]. A label for form fields.
// Uses A11y for aria-* relation props (aria-labelledby wiring is done
// by the parent FormItem). Composes Text atom.
//   children     -> string or node, the label text
//   htmlFor      -> string, the id of the associated control (web only)
//   required     -> boolean, shows required indicator
//   disabled     -> boolean, dims the label
//   style        -> custom style overrides


// Imports
import { Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the FormLabel molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The FormLabel component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const FormLabel = function FormLabel (props) {


    const {
      children, htmlFor, required, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;
    const isDisabled = !!disabled;

    // On web, htmlFor maps to native label behavior
    const webProps = {};

    if (htmlFor && Platform.OS === 'web') {
      webProps.htmlFor = htmlFor;
    }

    return React.createElement(
      Registry.Text,
      Object.assign({
        typeSet: 'label01',
        color: isDisabled ? 'text_disabled' : 'text_primary',
        weight: 'medium',
        style: [Style.utilities['m_b_spacing_01'], style]
      }, webProps, rest),
      children,
      required
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'support_error',
          weight: 'medium'
        }, ' *')
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _FormLabel = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return FormLabel;

}/////////////////////////// Component Factory END /////////////////////////////
