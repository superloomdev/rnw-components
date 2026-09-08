// Info: FormGroup composite [S1 presentational]. A wrapper that groups form
// fields with an optional label and message. Role group. Does not use any
// mechanisms. Composes View and Text atoms.
//   children    -> form field elements
//   label       -> string (optional group label)
//   invalid     -> boolean (shows message in danger color)
//   message     -> string (helper or error text shown below the group)
//   disabled    -> boolean (dims the label)


// Imports



/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the FormGroup composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The FormGroup component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const FormGroup = function FormGroup (props) {


    const {
      children, label, invalid, message, disabled,
      style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;
    const isDisabled = !!disabled;
    const isInvalid = !!invalid;

    // Build aria state props for the group
    const ariaStateProps = Parts.A11y.state({
      disabled: isDisabled,
      invalid: isInvalid
    });

    // Render the label if provided
    const labelElement = label
      ? React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: isDisabled ? 'text_disabled' : 'text_primary',
        weight: 'medium',
        style: Style.utilities['m_b_spacing_01']
      }, label)
      : null;

    // Render the message (error or helper) below the group
    const messageElement = message
      ? React.createElement(Registry.Text, {
        typeSet: 'caption01',
        color: isInvalid ? 'support_error' : 'text_secondary',
        style: Style.utilities['m_t_spacing_01']
      }, message)
      : null;

    return React.createElement(
      Registry.View,
      Object.assign({
        accessibilityRole: 'group',
        accessibilityLabel: accessibilityLabel || label,
        style: [Style.utilities['m_b_spacing_05'], style]
      }, ariaStateProps, rest),
      labelElement,
      children,
      messageElement
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _FormGroup = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return FormGroup;

}/////////////////////////// Component Factory END /////////////////////////////
