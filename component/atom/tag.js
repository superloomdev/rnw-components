// Info: Tag atom [S1/S2 presentational or interactive]. A compact label.
// Dismissible tags are S2 with role="button" on the close button. Uses A11y.
//   label       -> string, tag text
//   onDismiss   -> function (when provided, renders a close button)
//   disabled    -> boolean
//   selected    -> boolean (for selectable tags)
//   onPress     -> function (for selectable tags)
//   variant     -> 'default' | 'operational' (color scheme)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Tag atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Tag component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Tag = function Tag (props) {

    const {
      label, onDismiss, disabled, selected, onPress, variant, style,
      accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;
    const isOperational = variant === 'operational';
    const isSelectable = Lib.Utils.isFunction(onPress);
    const isDismissible = Lib.Utils.isFunction(onDismiss);

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      selected: isSelectable ? !!selected : null
    });

    // Tag container style
    const tagStyle = {
      backgroundColor: isOperational
        ? (Style.tokens.Color.interactive)
        : (Style.tokens.Color.layer_01),
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      flexDirection: 'row',
      alignItems: 'center'
    };

    // Build the tag content
    const content = [
      React.createElement(Registry.Text, {
        key: 'label',
        typeSet: 'label01',
        color: isOperational ? 'text_on_color' : 'text_primary',
        weight: 'medium'
      }, label)
    ];

    // Close button for dismissible tags
    if (isDismissible) {
      content.push(React.createElement(
        Pressable,
        {
          key: 'close',
          onPress: disabled ? null : onDismiss,
          disabled: !!disabled,
          accessibilityRole: 'button',
          accessibilityLabel: 'Remove tag',
          style: { marginLeft: 6 }
        },
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: isOperational ? 'text_on_color' : 'text_secondary'
        }, '\u00d7')
      ));
    }

    // If selectable, wrap in Pressable
    if (isSelectable) {
      return React.createElement(
        Pressable,
        Object.assign({
          onPress: disabled ? null : onPress,
          disabled: !!disabled,
          accessibilityRole: 'button',
          accessibilityLabel: accessibilityLabel || label,
          style: [tagStyle, style]
        }, ariaProps, rest),
        content
      );
    }

    // Non-interactive tag
    return React.createElement(
      RNView,
      Object.assign({ style: [tagStyle, style] }, rest),
      content
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Tag = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Tag;

}/////////////////////////// Component Factory END /////////////////////////////
