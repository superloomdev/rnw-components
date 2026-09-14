// Info: DatePickerInput molecule [S2 interactive]. A text input that opens a
// DatePicker. Composes Registry.TextInput and Registry.DatePicker. Uses M1
// (a11y) for aria-* state and ControllableState for controlled/
// uncontrolled value.
//   value       -> string (controlled)
//   onChange    -> callback receiving the selected date string
//   placeholder -> string
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DatePickerInput molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DatePickerInput component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DatePickerInput = function DatePickerInput (props) {


    const {
      value, onChange, placeholder, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Controlled/uncontrolled state for the date value
    const state = Parts.ControllableState({
      value: value,
      defaultValue: '',
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    const [isOpen, setIsOpen] = React.useState(false);
    const isDisabled = !!disabled;

    // Frame ownership: the wrapper owns the border/focus/disabled state.
    // The inner TextInput renders unframed.
    const focusState = React.useState(false);
    const focused = focusState[0];
    const setFocused = focusState[1];

    // Field-adjacent controls meet the spec sheet control size
    const controlSize = Parts.Spec('textInput').controlSize;

    // Resolve frame mode from the feedback.field token (underline | outline)
    const frameMode = Style.tokens.Feedback.field || 'underline';

    return React.createElement(
      RNView,
      {
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          ...Parts.Frame.resolve({
            mode: frameMode,
            focused: focused,
            invalid: false,
            disabled: isDisabled
          }),
          { minWidth: 0 },
          style
        ]
      },
      // Text input that displays the date value
      React.createElement(
        Registry.TextInput,
        Object.assign({
          value: resolvedValue,
          onChangeText: setValue,
          placeholder: placeholder || 'YYYY-MM-DD',
          isDisabled: isDisabled,
          unframed: true,
          accessibilityRole: 'combobox',
          'aria-expanded': isOpen,
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
          },
          style: { flex: 1 }
        }, rest)
      ),
      // Calendar trigger button that opens the DatePicker
      React.createElement(
        Pressable,
        {
          onPress: function () {
            if (!isDisabled) {
              setIsOpen(!isOpen);
            }
          },
          disabled: isDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: 'Open date picker',
          style: [Style.utilities['m_s_spacing_01'], { minWidth: controlSize, minHeight: controlSize, alignItems: 'center', justifyContent: 'center' }]
        },
        React.createElement(Registry.Icon, {
          name: 'calendar',
          size: 'sm',
          color: 'text_secondary'
        })
      ),
      // DatePicker overlay
      isOpen
        ? React.createElement(Registry.DatePicker, {
          value: resolvedValue,
          onChange: function (nextValue) {
            setValue(nextValue);
            setIsOpen(false);
          },
          disabled: isDisabled
        })
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DatePickerInput = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DatePickerInput;

}/////////////////////////// Component Factory END /////////////////////////////
