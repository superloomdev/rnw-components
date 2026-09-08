// Info: ProgressStep molecule [S1 presentational]. A single step in a ProgressIndicator
// navigation component with role="listitem". Uses A11y for
// aria-current when the step is the current step.
//   label       -> string (step label)
//   status      -> 'complete' | 'current' | 'incomplete'
//   stepNumber  -> number (1-based step position)
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the ProgressStep molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The ProgressStep component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const ProgressStep = function ProgressStep (props) {


    const {
      label, status, stepNumber, style,
      ...rest
    } = props;

    const React = Lib.React;
    const currentStatus = status || 'incomplete';

    // Determine the indicator color based on status
    const indicatorColor = currentStatus === 'complete'
      ? (Style.tokens.Color.support_success)
      : currentStatus === 'current'
        ? (Style.tokens.Color.interactive)
        : (Style.tokens.Color.border_subtle_01);

    // Build aria state props
    const ariaProps = Parts.A11y.state({
      current: currentStatus === 'current' ? 'step' : undefined
    });

    // Build position props
    const positionProps = Parts.A11y.position({
      posinset: Lib.Utils.isNumber(stepNumber) ? stepNumber : undefined
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'listitem',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          Style.utilities['m_r_spacing_06'],
          style
        ]
      }, ariaProps, positionProps, rest),
      // ProgressStep indicator circle
      React.createElement(RNView, {
        style: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: indicatorColor,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8
        }
      },
      React.createElement(Registry.Text, {
        typeSet: 'label01',
        color: 'text_on_color',
        weight: 'medium'
      }, currentStatus === 'complete' ? '\u2713' : String(stepNumber || ''))
      ),
      // ProgressStep label
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: currentStatus === 'current' ? 'text_primary' : 'text_secondary',
        weight: currentStatus === 'current' ? 'medium' : 'regular'
      }, label)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _ProgressStep = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return ProgressStep;

}/////////////////////////// Component Factory END /////////////////////////////
