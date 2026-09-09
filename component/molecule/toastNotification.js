// Info: ToastNotification molecule [S1/S2]. A transient notification that auto-dismisss
// after a duration. Uses A11y for aria-* state, role="alert" for
// screen reader announcement, and a timer effect for auto-dismiss.
//   title       -> primary text
//   subtitle    -> secondary text (optional)
//   status      -> 'success' | 'error' | 'warning' | 'info'
//   onClose     -> close handler (called on close or auto-dismiss)
//   duration    -> milliseconds before auto-dismiss (default 3000)


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ToastNotification molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ToastNotification component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  const STATUS_BG = {
    success: 'background_support_success',
    error: 'background_support_error',
    warning: 'background_support_warning',
    info: 'background_support_info'
  };

  const STATUS_ICON = {
    success: 'checkmark',
    error: 'error',
    warning: 'warning',
    info: 'information'
  };
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ToastNotification = function ToastNotification (props) {


    const {
      title, subtitle, status, onClose, duration, style,
      ...rest
    } = props;

    const React = Lib.React;
    const resolvedStatus = status || 'info';
    const bgKey = STATUS_BG[resolvedStatus] || STATUS_BG.info;
    const iconName = STATUS_ICON[resolvedStatus] || STATUS_ICON.info;
    const dismissMs = Lib.Utils.isNumber(duration) ? duration : 3000;

    // Auto-dismiss timer
    React.useEffect(function () {

      if (!Lib.Utils.isFunction(onClose)) {
        return undefined;
      }

      const timer = setTimeout(function () {
        onClose();
      }, dismissMs);

      return function () {
        clearTimeout(timer);
      };

    }, [dismissMs, onClose]);

    // Build the close button if onClose is provided
    const closeButton = Lib.Utils.isFunction(onClose)
      ? React.createElement(
        Pressable,
        Object.assign({
          onPress: onClose,
          accessibilityRole: 'button',
          accessibilityLabel: 'Close toast'
        }, Parts.A11y.state({}), Parts.PressKeys({
          role: 'button',
          onActivate: onClose,
          disabled: false
        }), {
          style: Style.utilities['p_a_spacing_01']
        }),
        React.createElement(Registry.Icon, {
          name: 'close',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      )
      : null;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'alert',
        style: [
          Style.utilities[bgKey],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['p_a_spacing_05'],
          Style.utilities['flex_row'],
          Style.utilities['align_start'],
          style
        ]
      }, rest),
      // Status icon
      React.createElement(Registry.Icon, {
        name: iconName,
        typeSet: 'body01',
        color: 'text_secondary',
        style: Style.utilities['m_e_spacing_03']
      }),
      // Title and subtitle column
      React.createElement(
        Registry.View,
        { style: Style.utilities['flex_1'] },
        title
          ? React.createElement(Registry.Text, {
            typeSet: 'body01',
            color: 'text_primary',
            weight: 'medium'
          }, title)
          : null,
        subtitle
          ? React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: 'text_secondary',
            style: Style.utilities['m_t_spacing_01']
          }, subtitle)
          : null
      ),
      closeButton
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ToastNotification = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ToastNotification;

}/////////////////////////// Component Factory END /////////////////////////////
