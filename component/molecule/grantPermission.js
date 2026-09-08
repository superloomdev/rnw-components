// Info: GrantPermission molecule [S2 interactive]. A permission request card
// with an icon, title, subtitle, and grant/deny buttons. Uses
// role="alertdialog" for screen reader semantics.
// Platform: native-primary.
//   title       -> primary text
//   subtitle    -> secondary text (optional)
//   icon        -> icon name (optional)
//   onGrant     -> grant handler
//   onDeny      -> deny handler (optional)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the GrantPermission molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The GrantPermission component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const GrantPermission = function GrantPermission (props) {


    const {
      title, subtitle, icon, onGrant, onDeny, style,
      ...rest
    } = props;

    const React = Lib.React;
    const iconName = icon || 'information--filled';

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'alertdialog',
        style: [
          Style.utilities['background_layer_02'],
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          Style.utilities['p_a_spacing_05'],
          Style.utilities['flex_col'],
          style
        ]
      }, rest),
      // Icon row
      icon
        ? React.createElement(Registry.Icon, {
          name: iconName,
          typeSet: 'body02',
          color: 'text_secondary',
          style: Style.utilities['m_b_spacing_03']
        })
        : null,
      // Title
      title
        ? React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary',
          weight: 'medium'
        }, title)
        : null,
      // Subtitle
      subtitle
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_secondary',
          style: Style.utilities['m_t_spacing_01']
        }, subtitle)
        : null,
      // Button row
      React.createElement(
        Registry.View,
        {
          style: [
            Style.utilities['flex_row'],
            Style.utilities['justify_end'],
            Style.utilities['m_t_spacing_05']
          ]
        },
        // Deny button
        Lib.Utils.isFunction(onDeny)
          ? React.createElement(Registry.Button, {
            kind: 'ghost',
            title: 'Deny',
            onPress: onDeny,
            style: Style.utilities['m_e_spacing_03']
          })
          : null,
        // Grant button
        Lib.Utils.isFunction(onGrant)
          ? React.createElement(Registry.Button, {
            kind: 'primary',
            title: 'Grant',
            onPress: onGrant
          })
          : null
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _GrantPermission = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return GrantPermission;

}/////////////////////////// Component Factory END /////////////////////////////
