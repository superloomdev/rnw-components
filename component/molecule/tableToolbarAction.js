// Info: TableToolbarAction molecule [S2 interactive]. A single action button
// in the table toolbar. Uses role="button" for screen reader semantics and
// PressKeys for keyboard activation. Composes Icon and Text atoms.
//   icon        -> string (icon glyph name)
//   onPress     -> function (press handler)
//   label       -> string (button text / accessibility label)
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableToolbarAction molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableToolbarAction component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableToolbarAction = function TableToolbarAction (props) {


    const {
      icon, onPress, label, style,
      ...rest
    } = props;

    const React = Lib.React;

    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: onPress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: onPress,
        accessibilityRole: 'button',
        accessibilityLabel: label,
        style: [
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['br_radius_08'],
          style
        ]
      }, pressKeysProps, rest),
      icon
        ? React.createElement(Registry.Icon, {
          name: icon,
          typeSet: 'body01',
          color: 'text_primary'
        })
        : null,
      label
        ? React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_primary'
        }, label)
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableToolbarAction = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableToolbarAction;

}/////////////////////////// Component Factory END /////////////////////////////
