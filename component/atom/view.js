// Info: View atom [S1 presentational]. The base layout box. Convenience props
// map to generated utility classes (background / radius / border); anything
// else falls through `style`.
//
// The layer prop accepts a Carbon layer token name (layer_01, layer_02,
// layer_03, background) and resolves it to the corresponding background
// utility. This is the layer-aware surface selection point for components
// that need to paint the correct Carbon layer background.


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the View atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { Direction, Units, Typeface }
@param {Object} Registry - Component registry (unused by atoms)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The View component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const View = function View (props) {

    // Destructure token props from pass-through props
    const { background, layer, radius, border, style, children, ...rest } = props;

    // Resolve token props to utility classes
    const classes = [];


    // ---- Background ----
    // The layer prop takes precedence over background for Carbon layer selection
    const bgToken = layer || background;

    if (bgToken) {
      const bgClass = Style.utilities['background_' + bgToken];

      if (bgClass) {
        classes.push(bgClass);
      } else {
        Lib.Debug.warn('unknown background token, ignoring', { background: bgToken });
      }

    }


    // ---- Border radius ----
    if (radius) {
      const brClass = Style.utilities['br_' + radius];

      if (brClass) {
        classes.push(brClass);
      } else {
        Lib.Debug.warn('unknown radius token, ignoring', { radius: radius });
      }

    }


    // ---- Border ----
    if (border) {
      const borderKey = border === true ? 'default' : border;
      const borderClass = Style.utilities['border_' + borderKey];

      if (borderClass) {
        classes.push(borderClass);
      } else {
        Lib.Debug.warn('unknown border token, ignoring', { border: border });
      }

    }


    // Render
    return Lib.React.createElement(
      RNView,
      Object.assign({ style: [...classes, style] }, rest),
      children
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _View = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return View;

}/////////////////////////// Component Factory END /////////////////////////////
