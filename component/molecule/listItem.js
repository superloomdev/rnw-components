// Info: ListItem molecule [S2 interactive] (CANONICAL). A selectable row with
// an optional leading icon, a title, an optional subtitle, and an optional
// trailing element. Composes View, Text, Icon, and Separator atoms.
//   title        -> primary text
//   subtitle     -> secondary text (optional)
//   icon         -> leading icon name (optional)
//   trailing     -> trailing element (optional)
//   onPress      -> press handler (optional; when absent, item is static)
//   selected     -> boolean, whether the item is selected


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ListItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ListItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ListItem = function ListItem (props) {


    // Destructure props
    const {
      title, subtitle, icon, trailing, onPress, selected, disabled,
      style, ...rest
    } = props;

    const React = Lib.React;
    const [pressed, setPressed] = React.useState(false);

    // Build the row content (shared between pressable and static variants)
    const rowContent = Lib.React.createElement(
      React.Fragment,
      null,
      // Leading icon
      icon
        ? Lib.React.createElement(Registry.Icon, {
          name: icon,
          typeSet: 'body01',
          color: 'text_secondary',
          style: Style.utilities['m_e_spacing_05']
        })
        : null,
      // Title and subtitle column
      Lib.React.createElement(
        Registry.View,
        { style: Style.utilities['flex_1'] },
        Lib.React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary',
          weight: 'medium'
        }, title),
        subtitle
          ? Lib.React.createElement(Registry.Text, {
            typeSet: 'label01',
            color: 'text_secondary',
            style: Style.utilities['m_t_spacing_01']
          }, subtitle)
          : null
      ),
      // Trailing element
      trailing || null
    );

    // Container styles
    const containerStyle = [
      Style.utilities['p_h_spacing_05'],
      Style.utilities['p_v_spacing_05'],
      Style.utilities['flex_row'],
      Style.utilities['align_center'],
      pressed ? Style.utilities['background_layer_01'] : null,
      style
    ];

    // Static (non-pressable) list item
    if (!Lib.Utils.isFunction(onPress)) {
      return Lib.React.createElement(
        Registry.View,
        Object.assign({ style: containerStyle }, rest),
        rowContent
      );

    }

    // Pressable list item
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      selected: !!selected
    });

    return Lib.React.createElement(
      Pressable,
      Object.assign({
        onPress: disabled ? null : onPress,
        disabled: disabled,
        accessibilityRole: 'button',
        accessibilityLabel: title,
        onPressIn: function () {
          setPressed(true);
        },
        onPressOut: function () {
          setPressed(false);
        },
        style: function () {
          return containerStyle;
        }
      }, ariaProps, rest),
      rowContent
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ListItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ListItem;

}/////////////////////////// Component Factory END /////////////////////////////
