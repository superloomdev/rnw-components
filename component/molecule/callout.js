// Info: Callout molecule [S1]. A themed callout banner with title and
// optional children content. Uses role="note" for screen reader semantics.
// Similar to StaticNotification but less urgent.
//   title       -> primary text
//   kind        -> 'info' | 'success' | 'warning' | 'error'
//   children    -> additional content (optional)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Callout molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Callout component
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
  const Callout = function Callout (props) {


    const {
      title, kind, children, style,
      ...rest
    } = props;

    const React = Lib.React;
    const resolvedKind = kind || 'info';
    const bgKey = KIND_BG[resolvedKind] || KIND_BG.info;
    const iconName = KIND_ICON[resolvedKind] || KIND_ICON.info;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'note',
        style: [
          Style.utilities[bgKey],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
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
          typeSet: 'body01',
          color: 'text_secondary',
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
  const _Callout = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Callout;

}/////////////////////////// Component Factory END /////////////////////////////
