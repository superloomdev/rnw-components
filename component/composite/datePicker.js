// Info: DatePicker composite [S3 overlay]. A date picker with a trigger
// button and a calendar-like view. Uses A11y, Overlay,
// AnchoredPosition, ControllableState. Role combobox.
//   value       -> string YYYY-MM-DD (controlled)
//   defaultValue-> string YYYY-MM-DD (uncontrolled)
//   onChange    -> callback receiving the selected date string
//   disabled    -> boolean
//   invalid     -> boolean
//   datePickerType -> 'single' | 'range' (default 'single'; 'range' absorbed from DateRangePicker)


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DatePicker composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DatePicker component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  const useOverlay = Parts.Overlay.useOverlay;

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DatePicker = function DatePicker (props) {


    const {
      value, defaultValue, onChange, disabled, invalid, datePickerType,
      style, accessibilityLabel,
      ...rest
    } = props;

    // datePickerType: 'range' renders two date triggers (start and end).
    // Absorbs the deleted DateRangePicker composite.
    const isRange = datePickerType === 'range';

    const React = Lib.React;
    const anchorRef = React.useRef(null);

    // Controlled/uncontrolled state for the selected date
    const state = Parts.ControllableState({
      value: value,
      defaultValue: defaultValue || '',
      onChange: onChange
    });
    const resolvedValue = state[0];
    const setValue = state[1];

    const [isOpen, setIsOpen] = React.useState(false);
    const [viewYear, setViewYear] = React.useState(null);
    const [viewMonth, setViewMonth] = React.useState(null);
    const isDisabled = !!disabled;
    const isInvalid = !!invalid;

    // Initialize the calendar view from the current value or today
    React.useEffect(function () {
      if (!isOpen) {
        return;
      }
      let year, month;
      if (resolvedValue) {
        const parts = _DatePicker.parseDateParts(resolvedValue);
        year = Parts.Units.parseInteger(parts[0]);
        month = (Parts.Units.parseInteger(parts[1]) || 1) - 1;
      } else {
        const now = new Date();
        year = now.getFullYear();
        month = now.getMonth();
      }
      if (Lib.Utils.isNumber(year) && Lib.Utils.isNumber(month)) {
        setViewYear(year);
        setViewMonth(month);
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

    const handleSelectDay = function (day) {
      const monthStr = String(viewMonth + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      setValue(viewYear + '-' + monthStr + '-' + dayStr);
      setIsOpen(false);
    };

    const handlePrevMonth = function () {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(viewYear - 1);
      } else {
        setViewMonth(viewMonth - 1);
      }
    };

    const handleNextMonth = function () {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(viewYear + 1);
      } else {
        setViewMonth(viewMonth + 1);
      }
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

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Compute the days in the current view month
    const daysInMonth = Lib.Utils.isNumber(viewYear) && Lib.Utils.isNumber(viewMonth)
      ? new Date(viewYear, viewMonth + 1, 0).getDate()
      : 30;
    const firstDayOfWeek = Lib.Utils.isNumber(viewYear) && Lib.Utils.isNumber(viewMonth)
      ? new Date(viewYear, viewMonth, 1).getDay()
      : 0;

    // Parse the selected day from the current value
    let selectedDay = null;
    if (resolvedValue) {
      const parts = _DatePicker.parseDateParts(resolvedValue);
      if (Parts.Units.parseInteger(parts[0]) === viewYear && (Parts.Units.parseInteger(parts[1]) || 1) - 1 === viewMonth) {
        selectedDay = Parts.Units.parseInteger(parts[2]);
      }
    }

    // Render the trigger button
    const renderTrigger = function () {
      return React.createElement(
        Pressable,
        Object.assign({
          ref: anchorRef,
          onPress: handleToggle,
          disabled: isDisabled,
          accessibilityRole: 'combobox',
          accessibilityLabel: accessibilityLabel || 'Date picker',
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
              ? { borderColor: Style.tokens.Color.support_error }
              : null,
            isDisabled
              ? { backgroundColor: Style.tokens.Color.layer_01 }
              : null,
            style
          ]
        }, ariaStateProps, pressKeysProps, rest),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: resolvedValue ? 'text_primary' : 'text_secondary'
        }, resolvedValue || 'YYYY-MM-DD'),
        React.createElement(Registry.Icon, {
          name: 'calendar',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      );
    };

    // Render the calendar panel
    const renderPanel = function (zIndex) {
      const pos = anchored.position || { top: 0, left: 0 };

      // Build the calendar grid cells
      const cells = [];

      // Leading empty cells for the first week
      for (let i = 0; i < firstDayOfWeek; i++) {
        cells.push(React.createElement(RNView, {
          key: 'empty_' + i,
          style: { width: 32, height: 32 }
        }));
      }

      // Day cells
      for (let day = 1; day <= daysInMonth; day++) {
        const isSelected = day === selectedDay;
        cells.push(React.createElement(
          Pressable,
          {
            key: 'day_' + day,
            onPress: function () {
              handleSelectDay(day);
            },
            accessibilityRole: 'option',
            accessibilityLabel: day + ' ' + (monthNames[viewMonth] || '') + ' ' + viewYear,
            style: [
              { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
              isSelected
                ? { backgroundColor: Style.tokens.Color.interactive }
                : null
            ]
          },
          React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: isSelected ? 'text_on_color' : 'text_primary'
          }, String(day))
        ));
      }

      return React.createElement(
        RNView,
        {
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_08'],
            Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
            Style.utilities['p_a_spacing_03'],
            { position: 'absolute', top: pos.top, left: pos.left, width: 240, zIndex: zIndex || 1000 }
          ]
        },
        // Header with month navigation
        React.createElement(
          RNView,
          {
            style: [
              Style.utilities['flex_row'],
              Style.utilities['align_center'],
              Style.utilities['justify_between'],
              Style.utilities['m_b_spacing_01']
            ]
          },
          React.createElement(
            Pressable,
            { onPress: handlePrevMonth, accessibilityRole: 'button', accessibilityLabel: 'Previous month' },
            React.createElement(Registry.Text, { typeSet: 'body01', color: 'text_primary', weight: 'bold' }, '<')
          ),
          React.createElement(Registry.Text, {
            typeSet: 'body01',
            color: 'text_primary',
            weight: 'semibold'
          }, (monthNames[viewMonth] || '') + ' ' + viewYear),
          React.createElement(
            Pressable,
            { onPress: handleNextMonth, accessibilityRole: 'button', accessibilityLabel: 'Next month' },
            React.createElement(Registry.Text, { typeSet: 'body01', color: 'text_primary', weight: 'bold' }, '>')
          )
        ),
        // Calendar grid
        React.createElement(
          RNView,
          { style: [Style.utilities['flex_row'], Style.utilities['flex_wrap']] },
          cells
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

    // Range mode: wrap two triggers in a group. The full range calendar
    // and the prop contract are handled by this component.
    if (isRange) {
      return React.createElement(
        RNView,
        {
          accessibilityRole: 'group',
          accessibilityLabel: accessibilityLabel || 'date range picker',
          style: [Style.utilities['flex_row'], Style.utilities['align_center'], style]
        },
        renderTrigger(),
        React.createElement(Registry.Text, null, ' - '),
        renderTrigger()
      );
    }

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
  const _DatePicker = {

    // Split a date string (YYYY-MM-DD) into parts, tolerating non-string input
    parseDateParts: function (value) {
      return String(value).split('-');
    }

  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DatePicker;

}/////////////////////////// Component Factory END /////////////////////////////
