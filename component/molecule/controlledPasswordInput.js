// Info: ControlledPasswordInput molecule [S2 interactive]. A controlled
// variant of PasswordInput that requires explicit value and onChange props.
// Composes Registry.PasswordInput, which owns its own border, visibility
// toggle, and show/hide state. This component does not duplicate any of
// those concerns.
//   value       -> string (controlled, required)
//   onChange    -> callback receiving the text value (required)
//   placeholder -> string
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
// None - this component forwards props to Registry.PasswordInput


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ControlledPasswordInput molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ControlledPasswordInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) { // eslint-disable-line no-unused-vars

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ControlledPasswordInput = function ControlledPasswordInput (props) {


    const {
      value, onChange, placeholder, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // PasswordInput owns its border, visibility toggle, and show/hide state.
    // This component is a thin controlled variant that forwards props
    // without duplicating any of those concerns.
    return React.createElement(
      Registry.PasswordInput,
      Object.assign({
        value: value,
        onChange: onChange,
        placeholder: placeholder,
        disabled: !!disabled,
        style: style
      }, rest)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ControlledPasswordInput = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ControlledPasswordInput;

}/////////////////////////// Component Factory END /////////////////////////////
