// Info: BadgeIndicator atom [S1 presentational]. A small numeric badge
// for counts. Uses the A11y mechanism for aria-* label. Composes Text atom.
//   count       -> number (the count to display)
//   max         -> number (display '99+' when count exceeds max, default 99)
//   color       -> string (color token, default 'interactive')
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the BadgeIndicator atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The BadgeIndicator component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const BadgeIndicator = function BadgeIndicator (props) {

    const {
      count, max, color, style, // eslint-disable-line no-unused-vars
      ...rest
    } = props;

    const React = Lib.React;
    const maxVal = Lib.Utils.isNumber(max) ? max : 99;
    const displayCount = count > maxVal ? maxVal + '+' : String(count || 0);

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityLabel: displayCount + ' items',
        style: [
          {
            backgroundColor: Style.tokens.Color.interactive,
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            paddingHorizontal: 6,
            justifyContent: 'center',
            alignItems: 'center'
          },
          style
        ]
      }, rest),
      React.createElement(Registry.Text, {
        typeSet: 'caption01',
        color: 'text_on_color',
        weight: 'medium'
      }, displayCount)
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _BadgeIndicator = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return BadgeIndicator;

}/////////////////////////// Component Factory END /////////////////////////////
