// Info: ModalHeader molecule [S1 presentational]. Header section of a
// ComposedModal. Uses CompoundContext to coordinate with
// ComposedModal. Composes Text and View atoms.
//   title       -> string
//   subtitle    -> string (optional)
//   closeOnPress-> function (optional close handler)
//   children    -> additional content
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ModalHeader molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ModalHeader component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ModalHeader = function ModalHeader (props) {


    const {
      title, subtitle, closeOnPress, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    return React.createElement(
      RNView,
      Object.assign({
        style: [
          Style.utilities['p_h_spacing_06'],
          Style.utilities['p_v_spacing_05'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          { ...Style.utilities['border_w_b_width_01'] },
          style
        ]
      }, rest),
      React.createElement(
        RNView,
        { style: [Style.utilities['flex_row'], Style.utilities['align_center'], Style.utilities['justify_between']] },
        React.createElement(RNView, { style: { flex: 1 } },
          title
            ? React.createElement(Registry.Text, {
              typeSet: 'heading01',
              color: 'text_primary',
              weight: 'semibold'
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
        closeOnPress
          ? React.createElement(
            Pressable,
            {
              onPress: closeOnPress,
              accessibilityRole: 'button',
              accessibilityLabel: 'Close',
              style: Style.utilities['m_s_spacing_03']
            },
            React.createElement(Registry.Text, {
              typeSet: 'body02',
              color: 'text_secondary'
            }, '\u00d7')
          )
          : null
      ),
      children
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ModalHeader = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ModalHeader;

}/////////////////////////// Component Factory END /////////////////////////////
