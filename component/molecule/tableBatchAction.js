// Info: TableBatchAction molecule [S2 interactive]. A single action button used
// within TableBatchActions for batch operations. Uses A11y for aria-* state
// and PressKeys for keyboard activation.
//   label       -> button text
//   onPress     -> press handler
//   disabled    -> boolean
//   style       -> custom style overrides


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TableBatchAction molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TableBatchAction component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TableBatchAction = function TableBatchAction (props) {


    const {
      label, onPress, disabled, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: onPress,
      disabled: !!disabled
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: disabled ? null : onPress,
        disabled: !!disabled,
        accessibilityRole: 'button',
        accessibilityLabel: label,
        style: [
          Style.utilities['p_h_spacing_03'],
          Style.utilities['p_v_spacing_01'],
          Style.utilities['br_radius_08'],
          style
        ]
      }, ariaProps, pressKeysProps, rest),
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: 'text_primary',
        weight: 'medium'
      }, label)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TableBatchAction = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TableBatchAction;

}/////////////////////////// Component Factory END /////////////////////////////
