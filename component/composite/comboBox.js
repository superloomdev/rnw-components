// Info: ComboBox composite [S3 overlay]. A select with text input filtering.
// Uses A11y, Overlay, AnchoredPosition, M8
// (useControllableState). Role combobox.
//   value       -> string (controlled)
//   defaultValue-> string (uncontrolled)
//   onChange    -> callback receiving the selected value
//   options     -> array of { value, label }
//   placeholder -> string (default 'Search')
//   disabled    -> boolean
//   invalid     -> boolean


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ComboBox composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ComboBox component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ComboBox = function ComboBox (props) {


    const {
      value, defaultValue, onChange, options, placeholder, disabled, invalid,
      style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;
    const anchorRef = React.useRef(null);

    // Controlled/uncontrolled state for the input text
    const state = Parts.ControllableState({
      value: value,
      defaultValue: defaultValue || '',
      onChange: onChange
    });
    const inputValue = state[0];
    const setInputValue = state[1];

    const [isOpen, setIsOpen] = React.useState(false);
    const isDisabled = !!disabled;
    const isInvalid = !!invalid;
    const optionList = options || [];

    // Filter options based on the current input text
    const filteredOptions = optionList.filter(function (opt) {
      return Parts.Filter.matchesLabel(inputValue, opt.label);
    });

    // Anchored position for the dropdown panel
    const anchored = Parts.AnchoredPosition({
      placement: 'bottom-start',
      anchorRef: anchorRef
    });

    // Measure position when the dropdown opens
    React.useEffect(function () {
      if (isOpen) {
        anchored.measure();
      }
    }, [isOpen]);

    const handleFocus = function () {
      setIsOpen(true);
    };

    const handleClose = function () {
      setIsOpen(false);
    };

    const handleSelect = function (opt) {
      setInputValue(opt.value);
      setIsOpen(false);
    };

    // Build aria state props for the combobox
    const ariaStateProps = Parts.A11y.state({
      disabled: isDisabled,
      expanded: !!isOpen,
      invalid: isInvalid
    });

    // Render the text input trigger
    const renderTrigger = function () {
      return React.createElement(
        RNView,
        { ref: anchorRef, style: { position: 'relative' } },
        React.createElement(
          Registry.TextInput,
          Object.assign({
            value: inputValue,
            onChangeText: setInputValue,
            onFocus: handleFocus,
            isDisabled: isDisabled,
            isInvalid: isInvalid,
            accessibilityRole: 'combobox',
            accessibilityLabel: accessibilityLabel || placeholder || 'Search',
            placeholder: placeholder || 'Search',
            style: [
              isInvalid
                ? { ...Style.utilities['border_color_support_error'] }
                : null,
              style
            ]
          }, ariaStateProps, rest)
        )
      );
    };

    // Render the filtered options panel
    const renderPanel = function (zIndex) {
      const pos = anchored.position || { top: 0, left: 0 };

      return React.createElement(
        RNView,
        {
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_08'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['p_v_spacing_01'],
            { position: 'absolute', top: pos.top, left: pos.left, minWidth: 200, zIndex: zIndex || 1000 }
          ]
        },
        Lib.Utils.isEmptyArray(filteredOptions)
          ? React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: 'text_secondary',
            style: [Style.utilities['p_h_spacing_05'], Style.utilities['p_v_spacing_01']]
          }, 'No results found')
          : filteredOptions.map(function (opt) {
            return React.createElement(
              Pressable,
              {
                key: opt.value,
                onPress: function () {
                  handleSelect(opt);
                },
                accessibilityRole: 'option',
                accessibilityLabel: opt.label,
                style: [
                  Style.utilities['p_h_spacing_05'],
                  Style.utilities['p_v_spacing_01']
                ]
              },
              React.createElement(Registry.Text, {
                typeSet: 'body01',
                color: 'text_primary'
              }, opt.label)
            );
          })
      );
    };

    // Render backdrop
    const renderBackdrop = function () {
      return React.createElement(Pressable, {
        onPress: handleClose,
        style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
      });
    };

    // Call useOverlay unconditionally (hook-order safety). The hook
    // internally gates on isOpen, so it is a no-op when closed.
    const overlay = useOverlay({
      isOpen: isOpen,
      trap: false,
      onClose: handleClose,
      render: function () {
        return React.createElement(
          React.Fragment,
          null,
          renderBackdrop(),
          renderPanel()
        );
      }
    });

    if (!isOpen) {
      return renderTrigger();
    }

    // On native, render inline with backdrop
    if (Platform.OS !== 'web') {
      return React.createElement(
        RNView,
        { style: { position: 'relative' } },
        renderTrigger(),
        renderBackdrop(),
        renderPanel(1000)
      );
    }

    if (overlay.layerIndex < 0) {
      return React.createElement(
        RNView,
        { style: { position: 'relative' } },
        renderTrigger(),
        renderBackdrop(),
        renderPanel(1000)
      );
    }

    return renderTrigger();
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ComboBox = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ComboBox;

}/////////////////////////// Component Factory END /////////////////////////////
