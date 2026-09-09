// Info: Heading atom [S1 presentational]. A text element with role="header"
// and a level prop. Uses the A11y mechanism for aria-* level.
//   level       -> 1-6 (default 1, maps to aria-level)
//   typeSet     -> type set name (heading01 through heading07)
//   children    -> heading text content
//   style       -> custom style overrides
//
// When typeSet is provided, it is used directly. Otherwise, level maps to
// a type set by the D14 table: 1 -> heading06, 2 -> heading05, 3 -> heading04,
// 4 -> heading03, 5 -> heading02, 6 -> heading01. heading07 is a display size
// reached only through an explicit typeSet prop.


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
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) { // eslint-disable-line no-unused-vars

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

    // Map level to type set name by the D14 table
    const typeSetMap = { 1: 'heading06', 2: 'heading05', 3: 'heading04', 4: 'heading03', 5: 'heading02', 6: 'heading01' };
    const resolvedTypeSet = typeSet || typeSetMap[lvl] || 'heading01';

    // Build aria position props for level through the a11y translator
    const ariaProps = Parts.A11y.position({
      level: lvl
    });

    // Pass the resolved type set to Text unconditionally
    const textProps = { typeSet: resolvedTypeSet, color: 'text_primary' };

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
