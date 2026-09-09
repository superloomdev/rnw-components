// Info: AccordionItem molecule [S2 interactive]. A collapsible section with
// a button header (role="button") and a content region (role="region"). Uses
// A11y for aria-expanded, and PressKeys for keyboard activation.
// Can optionally consume Accordion context for expanded state coordination.
//   title       -> string (header label)
//   children    -> expandable content
//   expanded    -> boolean, whether the item is expanded
//   onToggle    -> function (called when header is pressed)
//   style       -> custom style overrides


// Imports
import getSharedContext from '../context/sharedContext.js';
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the AccordionItem molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The AccordionItem component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////


  // Get the shared Accordion context (cached per Lib instance)
  const accordionCtx = getSharedContext(Lib, 'Accordion');

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const AccordionItem = function AccordionItem (props) {


    const {
      title, children, expanded, onToggle, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Read Accordion context if available
    const ctxValue = React.useContext(accordionCtx.Context);

    // Determine expanded state: context overrides props
    const isExpanded = ctxValue
      ? (ctxValue.expandedKeys && ctxValue.expandedKeys.indexOf(ctxValue.itemKey) !== -1)
      : !!expanded;

    // Handle toggle
    const handleToggle = function () {
      if (Lib.Utils.isFunction(onToggle)) {
        onToggle(!isExpanded);
      }
      if (ctxValue && Lib.Utils.isFunction(ctxValue.onChange)) {
        ctxValue.onChange(ctxValue.itemKey);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      expanded: isExpanded
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'button',
      onActivate: handleToggle,
      disabled: false
    });

    return React.createElement(
      RNView,
      Object.assign({
        style: [
          Style.utilities['border_w_width_01'], Style.utilities['border_color_border_subtle_01'],
          { ...Style.utilities['border_w_b_width_01'] },
          style
        ]
      }, rest),
      // Header button
      React.createElement(
        Pressable,
        Object.assign({
          onPress: handleToggle,
          accessibilityRole: 'button',
          accessibilityLabel: title,
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center'],
            Style.utilities['justify_between'],
            Style.utilities['p_h_spacing_05'],
            Style.utilities['p_v_spacing_05']
          ]
        }, ariaProps, pressKeysProps),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_primary',
          weight: 'medium'
        }, title),
        // Expand/collapse chevron
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'text_secondary'
        }, isExpanded ? '\u25B2' : '\u25BC')
      ),
      // Content region (only when expanded)
      isExpanded
        ? React.createElement(
          RNView,
          {
            accessibilityRole: 'region',
            style: [
              Style.utilities['p_h_spacing_05'],
              Style.utilities['p_v_spacing_05'],
              { ...Style.utilities['background_layer_01'] }
            ]
          },
          children
        )
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _AccordionItem = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return AccordionItem;

}/////////////////////////// Component Factory END /////////////////////////////
