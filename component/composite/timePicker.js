// Info: TimePicker composite [S3 overlay]. A time picker with a trigger
// button and a time selection view. Uses A11y, Overlay,
// AnchoredPosition, ControllableState. Role combobox.
//   value       -> string HH:MM (controlled)
//   defaultValue-> string HH:MM (uncontrolled)
//   onChange    -> callback receiving the selected time string
//   disabled    -> boolean
//   invalid     -> boolean


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TimePicker composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TimePicker component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TimePicker = function TimePicker (props) {


    const {
      value, defaultValue, onChange, disabled, invalid,
      style, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;
    const anchorRef = React.useRef(null);

    // Controlled/uncontrolled state for the selected time
    const state = Parts.ControllableState({
      value: value,
      defaultValue: defaultValue || '',
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    const [isOpen, setIsOpen] = React.useState(false);
    const isDisabled = !!disabled;
    const isInvalid = !!invalid;

    // Parse hours and minutes from the current value
    let currentHour = 9;
    let currentMinute = 0;
    if (resolvedValue) {
      const parts = _TimePicker.parseTimeParts(resolvedValue);
      const parsedHour = Parts.Units.parseInteger(parts[0]);
      const parsedMinute = Parts.Units.parseInteger(parts[1]);
      if (Lib.Utils.isNumber(parsedHour)) {
        currentHour = parsedHour;
      }
      if (Lib.Utils.isNumber(parsedMinute)) {
        currentMinute = parsedMinute;
      }
    }

    const [selectedHour, setSelectedHour] = React.useState(currentHour);
    const [selectedMinute, setSelectedMinute] = React.useState(currentMinute);

    // Sync internal selection when the panel opens
    React.useEffect(function () {
      if (isOpen) {
        setSelectedHour(currentHour);
        setSelectedMinute(currentMinute);
      }
    }, [isOpen]);

    // Anchored position for the dropdown panel
    const anchored = Parts.AnchoredPosition({
      placement: 'bottom-start',
      anchorRef: anchorRef
    });

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

    const handleConfirm = function () {
      const hourStr = String(selectedHour).padStart(2, '0');
      const minStr = String(selectedMinute).padStart(2, '0');
      setValue(hourStr + ':' + minStr);
      setIsOpen(false);
    };

    // Build aria state props for the trigger
    const ariaStateProps = Parts.A11y.state({
      disabled: isDisabled,
      expanded: !!isOpen,
      invalid: isInvalid
    });

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
          accessibilityLabel: accessibilityLabel || 'Time picker',
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
          color: resolvedValue ? 'text_primary' : 'text_secondary'
        }, resolvedValue || 'HH:MM'),
        React.createElement(Registry.Icon, {
          name: 'time',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      );
    };

    // Render the time selection panel
    const renderPanel = function (zIndex) {
      const pos = anchored.position || { top: 0, left: 0 };

      // Build hour options (0-23)
      const hourOptions = [];
      for (let h = 0; h < 24; h++) {
        hourOptions.push(React.createElement(
          Pressable,
          {
            key: 'hour_' + h,
            onPress: function () {
              setSelectedHour(h);
            },
            accessibilityRole: 'option',
            accessibilityLabel: h + ' hours',
            style: [
              { paddingVertical: 4, paddingHorizontal: 8, ...Style.utilities['br_radius_04'] },
              h === selectedHour
                ? { ...Style.utilities['background_interactive'] }
                : null
            ]
          },
          React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: h === selectedHour ? 'text_on_color' : 'text_primary'
          }, String(h).padStart(2, '0'))
        ));
      }

      // Build minute options (0, 15, 30, 45)
      const minuteOptions = [0, 15, 30, 45].map(function (m) {
        return React.createElement(
          Pressable,
          {
            key: 'min_' + m,
            onPress: function () {
              setSelectedMinute(m);
            },
            accessibilityRole: 'option',
            accessibilityLabel: m + ' minutes',
            style: [
              { paddingVertical: 4, paddingHorizontal: 8, ...Style.utilities['br_radius_04'] },
              m === selectedMinute
                ? { ...Style.utilities['background_interactive'] }
                : null
            ]
          },
          React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: m === selectedMinute ? 'text_on_color' : 'text_primary'
          }, String(m).padStart(2, '0'))
        );
      });

      return React.createElement(
        RNView,
        {
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_08'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['p_a_spacing_03'],
            { position: 'absolute', top: pos.top, left: pos.left, width: 200, zIndex: zIndex || 1000 }
          ]
        },
        React.createElement(
          RNView,
          { style: [Style.utilities['flex_row'], Style.utilities['align_center'], Style.utilities['justify_center'], Style.utilities['m_b_spacing_01']] },
          React.createElement(Registry.Text, {
            typeSet: 'body02',
            color: 'text_primary',
            weight: 'semibold'
          }, String(selectedHour).padStart(2, '0') + ':' + String(selectedMinute).padStart(2, '0'))
        ),
        React.createElement(
          RNView,
          { style: [Style.utilities['flex_row'], { height: 120 }] },
          // Hour column
          React.createElement(
            RNView,
            { style: [Style.utilities['flex_1'], Style.utilities['border_w_r_width_01'], Style.utilities['border_color_border_subtle_01']] },
            hourOptions
          ),
          // Minute column
          React.createElement(
            RNView,
            { style: [Style.utilities['flex_1']] },
            minuteOptions
          )
        ),
        // Confirm button
        React.createElement(
          Pressable,
          {
            onPress: handleConfirm,
            accessibilityRole: 'button',
            accessibilityLabel: 'Confirm time',
            style: [
              Style.utilities['br_radius_08'],
              Style.utilities['p_v_spacing_01'],
              { ...Style.utilities['background_interactive'], alignItems: 'center', marginTop: 8 }
            ]
          },
          React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: 'text_on_color',
            weight: 'medium'
          }, 'OK')
        )
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
  const _TimePicker = {

    // Split a time string (HH:MM) into parts, tolerating non-string input
    parseTimeParts: function (value) {
      return String(value).split(':');
    }

  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TimePicker;

}/////////////////////////// Component Factory END /////////////////////////////
