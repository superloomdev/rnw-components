// Info: ActionableNotification molecule [S2 interactive]. A notification with
// action buttons. Uses role="alert" for screen reader announcement. Uses M1
// (a11y) for aria-* state and PressKeys for keyboard activation.
//   title       -> primary text
//   subtitle    -> secondary text (optional)
//   actionText  -> string (action button label, optional)
//   onAction    -> function (action handler, optional)
//   onDismiss   -> function (dismiss handler, optional)
//   kind        -> 'info' | 'success' | 'warning' | 'error'
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ActionableNotification molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ActionableNotification component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // Notification colors: notification_background_* for the fill,
  // support_* for the icon and border accent. Text uses text_primary.
  const KIND_BG = {
    success: 'background_notification_background_success',
    error: 'background_notification_background_error',
    warning: 'background_notification_background_warning',
    info: 'background_notification_background_info'
  };

  const KIND_BORDER = {
    success: 'border_color_support_success',
    error: 'border_color_support_error',
    warning: 'border_color_support_warning',
    info: 'border_color_support_info'
  };

  const KIND_ICON_COLOR = {
    success: 'support_success',
    error: 'support_error',
    warning: 'support_warning',
    info: 'support_info'
  };

  const KIND_ICON = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ActionableNotification = function ActionableNotification (props) {


    const {
      title, subtitle, actionText, onAction, onDismiss, kind, style,
      ...rest
    } = props;

    const React = Lib.React;
    const resolvedKind = kind || 'info';
    const bgKey = KIND_BG[resolvedKind] || KIND_BG.info;
    const borderKey = KIND_BORDER[resolvedKind] || KIND_BORDER.info;
    const iconColorKey = KIND_ICON_COLOR[resolvedKind] || KIND_ICON_COLOR.info;
    const iconName = KIND_ICON[resolvedKind] || KIND_ICON.info;

    // Resolve spec sheet values
    const notifSpec = Parts.Spec('notification');
    const dismissSize = notifSpec.dismissTargetSize;

    // Build the action button if actionText and onAction are provided
    const actionButton = (actionText && Lib.Utils.isFunction(onAction))
      ? React.createElement(
        Pressable,
        Object.assign({
          onPress: onAction,
          accessibilityRole: 'button',
          accessibilityLabel: actionText
        }, Parts.A11y.state({}), Parts.PressKeys({
          role: 'button',
          onActivate: onAction,
          disabled: false
        }), {
          style: [
            Style.utilities['p_h_spacing_03'],
            Style.utilities['p_v_spacing_01'],
            Style.utilities['m_e_spacing_03']
          ]
        }),
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_primary',
          weight: 'medium'
        }, actionText)
      )
      : null;

    // Build the dismiss button if onDismiss is provided
    const dismissButton = Lib.Utils.isFunction(onDismiss)
      ? React.createElement(
        Pressable,
        Object.assign({
          onPress: onDismiss,
          accessibilityRole: 'button',
          accessibilityLabel: 'Dismiss notification'
        }, Parts.A11y.state({}), Parts.PressKeys({
          role: 'button',
          onActivate: onDismiss,
          disabled: false
        }), {
          style: [
            { minWidth: dismissSize, minHeight: dismissSize, alignItems: 'center', justifyContent: 'center' }
          ]
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
          : null
      ),
      actionButton,
      dismissButton
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ActionableNotification = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ActionableNotification;

}/////////////////////////// Component Factory END /////////////////////////////
