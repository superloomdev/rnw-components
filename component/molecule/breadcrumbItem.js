// Info: BreadcrumbItem molecule [S2 interactive]. A single breadcrumb link
// with role="link". Uses A11y for aria-current when the item is the
// current page, and PressKeys for keyboard activation.
//   href          -> string (optional URL)
//   onPress       -> function (press handler)
//   children      -> label content
//   isCurrentPage -> boolean, whether this is the current page
//   style         -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the BreadcrumbItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The BreadcrumbItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const BreadcrumbItem = function BreadcrumbItem (props) {


    const {
      href, onPress, children, isCurrentPage, style,
      ...rest
    } = props;

    const React = Lib.React;
    const isCurrent = !!isCurrentPage;

    // Handle press
    const handlePress = function () {
      if (Lib.Utils.isFunction(onPress)) {
        onPress();
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      current: isCurrent ? 'page' : undefined
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'link',
      onActivate: handlePress,
      disabled: isCurrent
    });

    // Current page is non-interactive (static text)
    if (isCurrent || !Lib.Utils.isFunction(onPress)) {
      return React.createElement(
        RNView,
        Object.assign({
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center'],
            style
          ]
        }, ariaProps, rest),
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_primary',
          weight: 'medium'
        }, children)
      );
    }

    return React.createElement(
      RNView,
      Object.assign({
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          style
        ]
      }, rest),
      React.createElement(
        Pressable,
        Object.assign({
          onPress: handlePress,
          accessibilityRole: 'link',
          accessibilityLabel: typeof children === 'string' ? children : undefined,
          href: href,
          style: Style.utilities['m_r_spacing_01']
        }, ariaProps, pressKeysProps),
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'interactive'
        }, children)
      ),
      // Separator chevron
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: 'text_secondary',
        style: Style.utilities['m_h_spacing_01']
      }, '/')
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _BreadcrumbItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return BreadcrumbItem;

}/////////////////////////// Component Factory END /////////////////////////////
