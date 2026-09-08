// Info: ProgressIndicator composite [S4 compound]. A step navigation container with
// role="list" that coordinates ProgressStep children. Uses A11y, M7
// (createCompoundContext). Wraps each ProgressStep child in a context Provider so
// it can read its index and current status without cloneElement.
//   current     -> number (1-based current step number)
//   children    -> ProgressStep elements
//   style       -> custom style overrides


// Imports
import getSharedContext from '../context/sharedContext.js';
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ProgressIndicator composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ProgressIndicator component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////


  // Get the shared compound context (cached per Lib instance)
  const ctx = getSharedContext(Lib, 'ProgressIndicator');

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ProgressIndicator = function ProgressIndicator (props) {


    const {
      current, children, style,
      ...rest
    } = props;

    const React = Lib.React;

    const currentStep = Lib.Utils.isNumber(current) ? current : 0;
    const childArray = React.Children.toArray(children);

    // Wrap each child in a Provider with its step number and status
    const wrappedChildren = childArray.map(function (child, index) {
      const stepNumber = index + 1;
      const status = stepNumber < currentStep
        ? 'complete'
        : stepNumber === currentStep
          ? 'current'
          : 'incomplete';

      return React.createElement(
        ctx.Provider,
        {
          key: index,
          value: {
            stepNumber: stepNumber,
            status: status,
            current: currentStep
          }
        },
        child
      );
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'list',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['p_v_spacing_03'],
          style
        ]
      }, rest),
      wrappedChildren
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ProgressIndicator = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ProgressIndicator;

}/////////////////////////// Component Factory END /////////////////////////////
