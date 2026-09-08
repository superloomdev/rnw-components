// Info: DefinitionTooltip molecule [S3 overlay]. A tooltip that shows a
// definition on hover/focus. Uses A11y, AnchoredPosition.
//   term        -> string (the term being defined, shown inline)
//   definition  -> string (the definition content)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the DefinitionTooltip molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The DefinitionTooltip component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const DefinitionTooltip = function DefinitionTooltip (props) {


    const {
      term, definition, style, // eslint-disable-line no-unused-vars
      ...rest
    } = props;

    const React = Lib.React;
    const [isVisible, setIsVisible] = React.useState(false);
    const anchorRef = React.useRef(null);

    // Anchored position
    const anchoredPos = Parts.AnchoredPosition({
      placement: 'bottom',
      offset: 4,
      flip: true,
      anchorRef: anchorRef
    });

    React.useEffect(function () {
      if (isVisible) {
        anchoredPos.measure();
      }
    }, [isVisible]);

    // Generate stable id
    const defId = React.useRef(Parts.A11y.id('definition')).current;

    // Build aria relation props
    const ariaProps = Parts.A11y.relation({
      describedby: defId
    });

    const showDef = function () {
      setIsVisible(true);
    };
    const hideDef = function () {
      setIsVisible(false);
    };

    const triggerProps = Platform.OS === 'web'
      ? { onMouseEnter: showDef, onMouseLeave: hideDef, onFocus: showDef, onBlur: hideDef }
      : { onLongPress: showDef, onPressOut: hideDef };

    // Render definition panel
    const renderDefinition = function () {
      const pos = anchoredPos.position || { top: 0, left: 0 };
      return React.createElement(
        RNView,
        {
          id: defId,
          accessibilityRole: 'tooltip',
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_04'],
            Style.utilities['p_a_spacing_03'],
            {
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              maxWidth: 300,
              zIndex: Parts.Stacking.floating
            }
          ]
        },
        React.createElement(Registry.Text, {
          typeSet: 'caption01',
          color: 'text_primary'
        }, definition)
      );
    };

    return React.createElement(
      RNView,
      Object.assign({ style: { position: 'relative', flexDirection: 'row' } }, rest),
      React.createElement(
        Pressable,
        Object.assign({
          ref: anchorRef,
          accessibilityRole: 'button',
          accessibilityLabel: term
        }, ariaProps, triggerProps),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: 'interactive',
          weight: 'medium',
          style: { textDecorationLine: 'underline' }
        }, term)
      ),
      isVisible ? renderDefinition() : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _DefinitionTooltip = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return DefinitionTooltip;

}/////////////////////////// Component Factory END /////////////////////////////
