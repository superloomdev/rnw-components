// Info: ButtonPrimaryOutlined (STRUCTURED VARIANT). An outlined/ghost variant
// of the canonical ButtonPrimary: transparent surface, primary border +
// primary label, subtle primary tint on hover/press. It DEVIATES in
// composition but still consumes the token system, so it stays in sync with
// theme changes. Registered in the variant registry (Component.variant) -
// discoverable, not a loose one-off.


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ButtonPrimaryOutlined variant.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ButtonPrimaryOutlined component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ButtonPrimaryOutlined = function ButtonPrimaryOutlined (props) {


    // Destructure props
    const { title, icon, onPress, disabled, fullWidth, style, ...rest } = props;

    const React = Lib.React;
    const [hovered, setHovered] = React.useState(false);

    // Container base styles
    const containerBase = [
      Style.utilities['br_radius_08'],
      Style.utilities['p_h_spacing_06'],
      Style.utilities['p_v_spacing_05'],
      Style.utilities['border_w_width_01'], Style.utilities['border_color_interactive'],
      Style.utilities['flex_center'],
      fullWidth ? Style.utilities['flex_stretch'] : null
    ];

    // Resolve background from state
    const resolveBackground = function (pressed) {

      if (disabled) {
        return null;
      }

      if (pressed || hovered) {
        return Style.utilities['background_background'];
      }

      return Style.utilities['background_layer_02'];

    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled
    });

    return Lib.React.createElement(
      Pressable,
      Object.assign({
        onPress: disabled ? null : onPress,
        disabled: disabled,
        accessibilityRole: 'button',
        accessibilityLabel: title,
        onHoverIn: function () {
          setHovered(true);
        },
        onHoverOut: function () {
          setHovered(false);
        },
        style: function (state) {
          return [...containerBase, resolveBackground(state.pressed), style];
        }
      }, ariaProps, rest),
      icon
        ? Lib.React.createElement(Registry.Icon, {
          name: icon, typeSet: 'body01', color: 'interactive', style: Style.utilities['m_e_spacing_03']
        })
        : null,
      Lib.React.createElement(Registry.Text, {
        color: 'interactive', weight: 'semibold', typeSet: 'body01'
      }, title)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ButtonPrimaryOutlined = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ButtonPrimaryOutlined;

}/////////////////////////// Component Factory END /////////////////////////////
