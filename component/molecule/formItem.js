// Info: FormItem molecule [S1 presentational]. A wrapper that groups a
// FormLabel, a child control, and optional helper/error text. Does not use
// any mechanisms (no M1-M8 needed). Composes View and Text atoms.
//   label        -> string, rendered through FormLabel
//   children     -> the form control element
//   helperText   -> string, shown below the control when no error
//   errorText    -> string, shown below the control in danger color
//   required     -> boolean, passed to FormLabel
//   disabled     -> boolean, passed to FormLabel
//   style        -> custom style overrides


// Imports



/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the FormItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The FormItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const FormItem = function FormItem (props) {


    const {
      label, children, helperText, errorText, required, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Render the label if provided
    const labelElement = label
      ? React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: disabled ? 'text_disabled' : 'text_primary',
        weight: 'medium',
        style: Style.utilities['m_b_spacing_01']
      }, label, required
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'support_error',
          weight: 'medium'
        }, ' *')
        : null)
      : null;

    // Render helper or error text below the control
    const messageElement = errorText
      ? React.createElement(Registry.Text, {
        typeSet: 'caption01',
        color: 'support_error',
        style: Style.utilities['m_t_spacing_01']
      }, errorText)
      : helperText
        ? React.createElement(Registry.Text, {
          typeSet: 'caption01',
          color: 'text_secondary',
          style: Style.utilities['m_t_spacing_01']
        }, helperText)
        : null;

    return React.createElement(
      Registry.View,
      Object.assign({ style: [Style.utilities['m_b_spacing_05'], style] }, rest),
      labelElement,
      children,
      messageElement
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _FormItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return FormItem;

}/////////////////////////// Component Factory END /////////////////////////////
