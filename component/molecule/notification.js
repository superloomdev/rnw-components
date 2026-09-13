// Info: Notification molecule [S1/S2]. A themed notification banner with
// title, subtitle, status icon, and an optional close button. Uses M1
// (a11y) for aria-* state and role="alert" for screen reader announcement.
//   title       -> primary text
//   subtitle    -> secondary text (optional)
//   status      -> 'success' | 'error' | 'warning' | 'info'
//   onClose     -> close handler (optional; when absent, no close button)
//   children    -> additional content (optional)


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Notification molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Notification component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // Carbon notification colors: notification_background_* for the fill,
  // support_* for the icon and border accent. Text uses text_primary.
  const STATUS_BG = {
    success: 'background_notification_background_success',
    error: 'background_notification_background_error',
    warning: 'background_notification_background_warning',
    info: 'background_notification_background_info'
  };

  const STATUS_BORDER = {
    success: 'border_color_support_success',
    error: 'border_color_support_error',
    warning: 'border_color_support_warning',
    info: 'border_color_support_info'
  };

  const STATUS_ICON_COLOR = {
    success: 'support_success',
    error: 'support_error',
    warning: 'support_warning',
    info: 'support_info'
  };

  const STATUS_ICON = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Notification = function Notification (props) {


    const {
      title, subtitle, status, onClose, children, style,
      ...rest
    } = props;

    const React = Lib.React;
    const resolvedStatus = status || 'info';
    const bgKey = STATUS_BG[resolvedStatus] || STATUS_BG.info;
    const borderKey = STATUS_BORDER[resolvedStatus] || STATUS_BORDER.info;
    const iconColorKey = STATUS_ICON_COLOR[resolvedStatus] || STATUS_ICON_COLOR.info;
    const iconName = STATUS_ICON[resolvedStatus] || STATUS_ICON.info;

    // Resolve spec sheet values
    const notifSpec = Parts.Spec('notification');
    const dismissSize = notifSpec.dismissTargetSize;

    // Build the close button if onClose is provided
    const closeButton = Lib.Utils.isFunction(onClose)
      ? React.createElement(
        Pressable,
        Object.assign({
          onPress: onClose,
          accessibilityRole: 'button',
          accessibilityLabel: 'Close notification'
        }, Parts.A11y.state({}), Parts.PressKeys({
          role: 'button',
          onActivate: onClose,
          disabled: false
        }), {
          style: [Style.utilities['p_a_spacing_01'], { minWidth: dismissSize, minHeight: dismissSize, alignItems: 'center', justifyContent: 'center' }]
        }),
        React.createElement(Registry.Icon, {
          name: 'close',
          size: 'sm',
          color: 'text_primary'
        })
      )
      : null;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'alert',
        style: [
          Style.utilities[bgKey],
          Style.utilities['br_radius_04'],
          Style.utilities['border_w_l_width_01'],
          Style.utilities[borderKey],
          Style.utilities['p_a_spacing_05'],
          Style.utilities['flex_row'],
          Style.utilities['align_start'],
          style
        ]
      }, rest),
      // Status icon
      React.createElement(Registry.Icon, {
        name: iconName,
        size: 'md',
        color: iconColorKey,
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
          : null,
        children || null
      ),
      closeButton
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Notification = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Notification;

}/////////////////////////// Component Factory END /////////////////////////////
