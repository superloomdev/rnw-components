// Info: StaticNotification molecule [S1]. A themed alert banner with title, kind, and
// optional children content. Uses role="alert" for screen reader
// announcement. Similar to Notification but more urgent.
//   title       -> primary text
//   kind        -> 'info' | 'success' | 'warning' | 'error'
//   children    -> additional content (optional)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the StaticNotification molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The StaticNotification component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
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
  const StaticNotification = function StaticNotification (props) {


    const {
      title, kind, children, style,
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

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'alert',
        style: [
          Style.utilities[bgKey],
          Style.utilities['br_radius_04'],
          Style.utilities['border_w_l_width_01'], Style.utilities[borderKey],
          Style.utilities['p_a_spacing_05'],
          style
        ]
      }, rest),
      // Title row with icon
      React.createElement(
        RNView,
        {
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center']
          ]
        },
        React.createElement(Registry.Icon, {
          name: iconName,
          size: notifSpec.iconSize,
          color: iconColorKey,
          style: Style.utilities['m_e_spacing_03']
        }),
        title
          ? React.createElement(Registry.Text, {
            typeSet: 'body01',
            color: 'text_primary',
            weight: 'medium'
          }, title)
          : null
      ),
      children
        ? React.createElement(
          Registry.View,
          { style: Style.utilities['m_t_spacing_03'] },
          children
        )
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _StaticNotification = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return StaticNotification;

}/////////////////////////// Component Factory END /////////////////////////////
