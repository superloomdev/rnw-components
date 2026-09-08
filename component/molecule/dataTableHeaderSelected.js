// Info: DataTableHeaderSelected molecule [S1 presentational]. A header shown
// when rows are selected, displaying the selected count and batch actions.
// Uses role="row" for screen reader semantics. Renders the count and batch
// action buttons on the leading edge and a cancel button on the trailing edge.
//   selectedCount -> number of selected rows
//   batchActions  -> array of action objects { label, onPress, kind }
//   onCancel      -> function invoked when the cancel button is pressed
//   style         -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DataTableHeaderSelected molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DataTableHeaderSelected component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DataTableHeaderSelected = function DataTableHeaderSelected (props) {


    const {
      selectedCount, batchActions, onCancel, style,
      ...rest
    } = props;

    const React = Lib.React;

    const count = selectedCount || 0;
    const countText = count + ' item' + (count === 1 ? '' : 's') + ' selected';

    const actions = (batchActions || []).map(function (action, index) {
      return React.createElement(Registry.Button, {
        key: 'batch-' + index,
        kind: action.kind || 'secondary',
        onPress: action.onPress,
        accessibilityLabel: action.label,
        style: Style.utilities['m_s_spacing_01']
      }, action.label);
    });

    const cancelButton = onCancel
      ? React.createElement(
        Pressable,
        {
          onPress: onCancel,
          accessibilityRole: 'button',
          accessibilityLabel: 'Cancel',
          style: Style.utilities['m_s_spacing_01']
        },
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_primary'
        }, 'Cancel')
      )
      : null;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'row',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['justify_between'],
          Style.utilities['background_layer_01'],
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, rest),
      React.createElement(
        RNView,
        { style: Style.utilities['flex_row'] },
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_primary',
          weight: 'medium'
        }, countText),
        actions
      ),
      cancelButton
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DataTableHeaderSelected = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DataTableHeaderSelected;

}/////////////////////////// Component Factory END /////////////////////////////
