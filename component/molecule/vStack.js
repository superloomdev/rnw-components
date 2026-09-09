// Info: VStack molecule [S1 presentational]. A vertical stack container.
// Uses role="group" for screen reader semantics.
//   spacing     -> string (space token, default 'md')
//   children    -> content to stack
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the VStack molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The VStack component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const VStack = function VStack (props) {


    const {
      spacing, children, style,
      ...rest
    } = props;

    const React = Lib.React;
    const gapToken = spacing || 'spacing_03';

    // Map gap token to margin utility
    const gapStyle = Style.utilities['m_b_' + gapToken];

    // Apply gap to all children except the last
    const childArray = React.Children.toArray(children);
    const spacedChildren = childArray.map(function (child, index) {
      if (index < childArray.length - 1) {
        return React.cloneElement(child, {
          key: index,
          style: [gapStyle, child.props && child.props.style]
        });
      }
      return child;
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'group',
        style: [
          Style.utilities['flex_col'],
          style
        ]
      }, rest),
      spacedChildren
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _VStack = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return VStack;

}/////////////////////////// Component Factory END /////////////////////////////
