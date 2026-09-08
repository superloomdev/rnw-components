// Info: View atom [S1 presentational]. The base layout box. Convenience props
// map to generated utility classes (background / radius / border); anything
// else falls through `style`.
//
// The layer prop accepts a layer token name (layer_01, layer_02,
// layer_03, background) and resolves it to the corresponding background
// utility. This is the layer-aware surface selection point for components
// that need to paint the correct layer background.


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
    // The layer prop takes precedence over background for layer selection
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
    // The border prop accepts a contract border width name (width_01, etc.)
    // or true for a default 1px subtle border.
    if (border) {
      if (border === true) {
        // Default: 1px width + subtle border color
        classes.push(Style.utilities['border_w_width_01']);
        classes.push(Style.utilities['border_color_border_subtle_01']);
      } else {
        // Named border width
        const borderWClass = Style.utilities['border_w_' + border];
        if (borderWClass) {
          classes.push(borderWClass);
          classes.push(Style.utilities['border_color_border_subtle_01']);
        } else {
          Lib.Debug.warn('unknown border token, ignoring', { border: border });
        }
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
