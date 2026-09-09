// Info: ExpandableTile molecule [S2 interactive]. A tile that expands to show
// more content. Uses role="button" for screen reader semantics. Uses A11y
// for aria-* state and PressKeys for keyboard activation.
//   title       -> string (tile title)
//   expanded    -> boolean (whether the tile is expanded)
//   onToggle    -> function (called with next boolean)
//   children    -> content (shown when expanded)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ExpandableTile molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ExpandableTile component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ExpandableTile = function ExpandableTile (props) {


    const {
      title, expanded, onToggle, children, style,
      ...rest
    } = props;

    const React = Lib.React;
    const isExpanded = !!expanded;

    // Handle toggle
    const handlePress = function () {
      if (Lib.Utils.isFunction(onToggle)) {
        onToggle(!isExpanded);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      expanded: isExpanded
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      RNView,
      Object.assign({
        style: [
          Style.utilities['br_radius_08'],
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          {
            ...Style.utilities['background_layer_02']
          },
          style
        ]
      }, rest),
      // Toggle header
      React.createElement(
        Pressable,
        Object.assign({
          onPress: handlePress,
          accessibilityRole: 'button',
          accessibilityLabel: title
        }, ariaProps, pressKeysProps, {
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center'],
            Style.utilities['p_a_spacing_05']
          ]
        }),
        title
          ? React.createElement(Registry.Text, {
            typeSet: 'body01',
            color: 'text_primary',
            weight: 'medium',
            style: Style.utilities['flex_1']
          }, title)
          : null,
        React.createElement(Registry.Icon, {
          name: isExpanded ? 'chevron--up' : 'chevron--down',
          typeSet: 'label01',
          color: 'text_secondary'
        })
      ),
      // Expanded content
      isExpanded
        ? React.createElement(
          RNView,
          { style: Style.utilities['p_h_spacing_05'] },
          children || null
        )
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ExpandableTile = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ExpandableTile;

}/////////////////////////// Component Factory END /////////////////////////////
