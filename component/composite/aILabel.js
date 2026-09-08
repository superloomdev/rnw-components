// Info: AILabel composite [S3 overlay]. An AI-generated content label with
// a toggletip that shows details. Uses A11y, AnchoredPosition.
// Composes Icon, Text, Toggletip atoms/molecules.
//   label       -> string (label text, default 'AI')
//   details     -> string (toggletip content)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the AILabel composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The AILabel component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const AILabel = function AILabel (props) {


    const {
      label, details, style,
      ...rest
    } = props;

    const React = Lib.React;
    const [isOpen, setIsOpen] = React.useState(false);

    // Build aria state props
    const ariaProps = Parts.A11y.state({
      expanded: !!isOpen
    });

    return React.createElement(
      RNView,
      Object.assign({ style: [Style.utilities['flex_row'], Style.utilities['align_center'], style] }, rest),
      React.createElement(
        Pressable,
        Object.assign({
          onPress: function () {
            setIsOpen(!isOpen);
          },
          accessibilityRole: 'button',
          accessibilityLabel: 'AI label',
          style: [
            Style.utilities['br_radius_04'],
            Style.utilities['p_h_spacing_01'],
            Style.utilities['p_v_spacing_01'],
            { backgroundColor: Style.tokens.Color.layer_01 }
          ]
        }, ariaProps),
        React.createElement(Registry.Text, {
          typeSet: 'caption01',
          color: 'text_on_color',
          weight: 'medium'
        }, label || 'AI')
      ),
      isOpen
        ? React.createElement(
          RNView,
          {
            style: [
              Style.utilities['background_layer_02'],
              Style.utilities['br_radius_08'],
              Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
              Style.utilities['p_a_spacing_03'],
              { position: 'absolute', top: '100%', left: 0, marginTop: 4, maxWidth: 300, zIndex: Parts.Stacking.floating }
            ]
          },
          React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: 'text_primary'
          }, details || 'AI-generated content')
        )
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _AILabel = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return AILabel;

}/////////////////////////// Component Factory END /////////////////////////////
