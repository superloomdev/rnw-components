// Info: MultiSelect composite [S3 overlay]. A dropdown with multi-select
// checkboxes. Uses A11y, Overlay, AnchoredPosition,
// ControllableState. Role listbox.
//   values      -> array (controlled)
//   defaultValues-> array (uncontrolled)
//   onChange    -> callback receiving the selected values array
//   options     -> array of { value, label }
//   placeholder -> string (default 'Select options')
//   disabled    -> boolean
//   invalid     -> boolean


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the MultiSelect composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The MultiSelect component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const MultiSelect = function MultiSelect (props) {


    const {
      values, defaultValues, onChange, options, placeholder, disabled, invalid,
      style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;
    const anchorRef = React.useRef(null);

    // Controlled/uncontrolled state for the selected values array
    const state = Parts.ControllableState({
      value: values,
      defaultValue: defaultValues || [],
      onChange: onChange
    });
    const resolvedValues = state[0];
    const setValues = state[1];

    const [isOpen, setIsOpen] = React.useState(false);
    const isDisabled = !!disabled;
    const isInvalid = !!invalid;
    const optionList = options || [];
    const selectedArray = resolvedValues || [];

    // Build the display label from selected count
    const displayLabel = Lib.Utils.isEmptyArray(selectedArray)
      ? (placeholder || 'Select options')
      : selectedArray.length + ' selected';

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

    const handleToggle = function () {
      if (isDisabled) {
        return;
      }
      setIsOpen(!isOpen);
    };

    const handleClose = function () {
      setIsOpen(false);
    };

    const handleToggleOption = function (optValue) {
      const isSelected = selectedArray.indexOf(optValue) >= 0;
      if (isSelected) {
        setValues(selectedArray.filter(function (v) {
          return v !== optValue;
        }));
      } else {
        setValues(selectedArray.concat([optValue]));
      }
    };

    // Build aria state props for the trigger
    const ariaStateProps = Parts.A11y.state({
      disabled: isDisabled,
      expanded: !!isOpen,
      invalid: isInvalid
    });

    // Build keyboard activation props for the trigger
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handleToggle,
      disabled: isDisabled
    });

    // Render the trigger button
    const renderTrigger = function () {
      return React.createElement(
        Pressable,
        Object.assign({
          ref: anchorRef,
          onPress: handleToggle,
          disabled: isDisabled,
          accessibilityRole: 'combobox',
          accessibilityLabel: accessibilityLabel || placeholder || 'Multi-select',
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center'],
            Style.utilities['justify_between'],
            Style.utilities['br_radius_08'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_03'],
            Style.utilities['background_layer_02'],
            isInvalid
              ? { ...Style.utilities['border_color_support_error'] }
              : null,
            isDisabled
              ? { ...Style.utilities['background_layer_01'] }
              : null,
            style
          ]
        }, ariaStateProps, pressKeysProps, rest),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: !Lib.Utils.isEmptyArray(selectedArray) ? 'text_primary' : 'text_secondary'
        }, displayLabel),
        React.createElement(Registry.Icon, {
          name: isOpen ? 'chevron_up' : 'chevron_down',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      );
    };

    // Render the dropdown panel with checkbox options
    const renderPanel = function (zIndex) {
      const pos = anchored.position || { top: 0, left: 0 };

      return React.createElement(
        RNView,
        {
          accessibilityRole: 'listbox',
          'aria-multiselectable': true,
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_08'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['p_v_spacing_01'],
            { position: 'absolute', top: pos.top, left: pos.left, minWidth: 200, zIndex: zIndex || 1000 }
          ]
        },
        optionList.map(function (opt) {
          const isSelected = selectedArray.indexOf(opt.value) >= 0;
          return React.createElement(Registry.Checkbox, {
            key: opt.value,
            checked: isSelected,
            onChange: function () {
              handleToggleOption(opt.value);
            },
            label: opt.label,
            disabled: isDisabled
          });
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

    if (!isOpen) {
      return React.createElement(RNView, { style: { position: 'relative' } }, renderTrigger());
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

    // On web, use Overlay
    const overlay = useOverlay({
      isOpen: true,
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

    if (overlay.layerIndex < 0) {
      return React.createElement(
        RNView,
        { style: { position: 'relative' } },
        renderTrigger(),
        renderBackdrop(),
        renderPanel(1000)
      );
    }

    return React.createElement(RNView, { style: { position: 'relative' } }, renderTrigger());
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _MultiSelect = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return MultiSelect;

}/////////////////////////// Component Factory END /////////////////////////////
