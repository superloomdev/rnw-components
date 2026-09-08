// Info: InlineNotification molecule [S1 presentational]. An inline notification
// banner. Uses role="alert" for screen reader announcement.
//   title       -> primary text
//   subtitle    -> secondary text (optional)
//   kind        -> 'info' | 'success' | 'warning' | 'error'
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the InlineNotification molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The InlineNotification component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  const KIND_BG = {
    success: 'background_support_success',
    error: 'background_support_error',
    warning: 'background_support_warning',
    info: 'background_support_info'
  };

  const KIND_ICON = {
    success: 'checkmark',
    error: 'error',
    warning: 'warning',
    info: 'information'
  };
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const InlineNotification = function InlineNotification (props) {


    const {
      title, subtitle, kind, style,
      ...rest
    } = props;

    const React = Lib.React;
    const resolvedKind = kind || 'info';
    const bgKey = KIND_BG[resolvedKind] || KIND_BG.info;
    const iconName = KIND_ICON[resolvedKind] || KIND_ICON.info;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'alert',
        style: [
          Style.utilities[bgKey] || Style.utilities['background_layer_02'],
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
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _InlineNotification = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return InlineNotification;

}/////////////////////////// Component Factory END /////////////////////////////
