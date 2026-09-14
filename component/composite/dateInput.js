// Info: DateInput composite [S2 interactive]. A simple text input with date
// format validation (YYYY-MM-DD). Uses A11y, ControllableState.
// Role input.
//   value       -> string YYYY-MM-DD (controlled)
//   defaultValue-> string YYYY-MM-DD (uncontrolled)
//   onChange    -> callback receiving the date string
//   disabled    -> boolean
//   invalid     -> boolean


// Imports
import { View as RNView } from 'react-native';



/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DateInput composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DateInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////


  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DateInput = function DateInput (props) {


    const {
      value, defaultValue, onChange, disabled, invalid,
      style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;
    const isDisabled = !!disabled;
    const isInvalid = !!invalid;

    // Frame ownership: the wrapper owns the border/focus/invalid/disabled
    // state. The inner TextInput renders unframed.
    const focusState = React.useState(false);
    const focused = focusState[0];
    const setFocused = focusState[1];

    // Resolve frame mode from the feedback.field token (underline | outline)
    const frameMode = Style.tokens.Feedback.field || 'underline';

    // Controlled/uncontrolled state for the date value
    const state = Parts.ControllableState({
      value: value,
      defaultValue: defaultValue || '',
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    // Auto-insert dashes as the user types YYYY-MM-DD
    const handleChange = function (text) {
      setValue(_DateInput.formatDateDigits(text));
    };

    // Build aria state props
    const ariaStateProps = Parts.A11y.state({
      disabled: isDisabled,
      invalid: isInvalid
    });

    return React.createElement(
      RNView,
      {
        style: [
          ...Parts.Frame.resolve({
            mode: frameMode,
            focused: focused,
            invalid: isInvalid,
            disabled: isDisabled
          }),
          { minWidth: 0 },
          style
        ]
      },
      React.createElement(
        Registry.TextInput,
        Object.assign({
          value: resolvedValue,
          onChangeText: handleChange,
          isDisabled: isDisabled,
          isInvalid: isInvalid,
          unframed: true,
          accessibilityRole: 'textbox',
          accessibilityLabel: accessibilityLabel || 'Date input',
          placeholder: 'YYYY-MM-DD',
          keyboardType: 'numeric',
          maxLength: 10,
          onFocus: function (e) {
            setFocused(true);
            if (Lib.Utils.isFunction(props.onFocus)) {
              props.onFocus(e);
            }
          },
          onBlur: function (e) {
            setFocused(false);
            if (Lib.Utils.isFunction(props.onBlur)) {
              props.onBlur(e);
            }
          }
        }, ariaStateProps, rest)
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DateInput = {

    // Strip non-digits and insert dashes to format YYYY-MM-DD
    formatDateDigits: function (text) {

      const digits = text.replace(/[^0-9]/g, '');

      if (digits.length <= 4) {
        return digits;
      }

      if (digits.length <= 6) {
        return digits.substring(0, 4) + '-' + digits.substring(4);
      }

      return digits.substring(0, 4) + '-' + digits.substring(4, 6) + '-' + digits.substring(6, 8);

    }

  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DateInput;

}/////////////////////////// Component Factory END /////////////////////////////
