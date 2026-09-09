// Info: Heading atom [S1 presentational]. A text element with role="header"
// and a level prop. Uses the A11y mechanism for aria-* level.
//   level       -> 1-6 (default 1, maps to aria-level)
//   typeSet     -> type set name (heading_01, heading_02, etc.)
//   children    -> heading text content
//   style       -> custom style overrides
//
// When typeSet is provided, the full type style is used. Otherwise,
// the fallback size map is used as a fallback.


// Imports


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Heading atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Heading component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Heading = function Heading (props) {

    const {
      level, typeSet, children, style,
      ...rest
    } = props;

    const React = Lib.React;
    const lvl = Lib.Utils.isNumber(level) ? level : 1;

    // Map level to type set name (heading_01 through heading_06)
    const typeSetMap = { 1: 'heading_01', 2: 'heading_02', 3: 'heading_03', 4: 'heading_04', 5: 'heading_05', 6: 'heading_06' };
    const resolvedTypeSet = typeSet || typeSetMap[lvl] || 'heading_01';

    // Fallback size map when type set utility is not available
    const sizeMap = { 1: 'xxl', 2: 'xl', 3: 'lg', 4: 'md', 5: 'sm', 6: 'xs' };
    const sizeToken = sizeMap[lvl] || 'xl';

    // Build aria position props for level through the a11y translator
    const ariaProps = Parts.A11y.position({
      level: lvl
    });

    // Check if the type set utility exists; if not, fall back to fallback size
    const typeKey = 'type_' + resolvedTypeSet;
    const hasTypeSet = Object.prototype.hasOwnProperty.call(Style.utilities, typeKey);
    const textProps = hasTypeSet
      ? { typeSet: resolvedTypeSet, color: 'text_primary' }
      : { size: sizeToken, color: 'text_primary', weight: 'semibold' };

    return React.createElement(
      Registry.Text,
      Object.assign({
        accessibilityRole: 'header',
        style: [style]
      }, textProps, ariaProps, rest),
      children
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Heading = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Heading;

}/////////////////////////// Component Factory END /////////////////////////////
