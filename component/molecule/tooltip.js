// Info: Tooltip molecule [S3 overlay]. A floating tooltip with content
// accessible via aria-describedby. Triggers on hover and focus on web,
// long-press on native. Uses A11y, Overlay, AnchoredPosition.
//   content     -> string or node (tooltip content)
//   children    -> trigger element
//   placement   -> string (default 'top')
//   style       -> custom style overrides


// Imports
import { View as RNView, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Tooltip molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Tooltip component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Tooltip = function Tooltip (props) {


    const {
      content, children, placement, style,
      ...rest
    } = props;

    const React = Lib.React;
    const [isVisible, setIsVisible] = React.useState(false);
    const anchorRef = React.useRef(null);

    // Anchored position calculation
    const anchoredPos = Parts.AnchoredPosition({
      placement: placement || 'top',
      offset: 8,
      flip: true,
      anchorRef: anchorRef
    });

    // Measure on show
    React.useEffect(function () {
      if (isVisible) {
        anchoredPos.measure();
      }
    }, [isVisible]);

    // Generate stable id for aria-describedby
    const tooltipId = React.useRef(Parts.A11y.id('tooltip')).current;

    // Build aria relation props
    const ariaProps = Parts.A11y.relation({
      describedby: tooltipId
    });

    // Show/hide handlers
    const showTooltip = function () {
      setIsVisible(true);
    };
    const hideTooltip = function () {
      setIsVisible(false);
    };

    // Web: hover + focus; Native: long-press
    const triggerProps = Platform.OS === 'web'
      ? {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip
      }
      : {
        onLongPress: showTooltip,
        onPressOut: hideTooltip
      };

    // Render tooltip content
    const renderTooltip = function () {
      const pos = anchoredPos.position || { top: 0, left: 0 };
      return React.createElement(
        RNView,
        Object.assign({
          id: tooltipId,
          accessibilityRole: 'tooltip',
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_04'],
            Style.utilities['p_h_spacing_03'],
            Style.utilities['p_v_spacing_01'],
            {
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              zIndex: Parts.Stacking.floating
            },
            style
          ]
        }, rest),
        React.createElement(Registry.Text, {
          typeSet: 'caption01',
          color: 'text_primary'
        }, content)
      );
    };

    // Guard: children must be a valid React element for cloneElement
    if (!children || !React.isValidElement(children)) {
      return null;
    }

    // Clone trigger with aria + event props
    const trigger = React.cloneElement(children, Object.assign({
      ref: anchorRef
    }, ariaProps, triggerProps));

    return React.createElement(
      RNView,
      { style: { position: 'relative' } },
      trigger,
      isVisible ? renderTooltip() : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Tooltip = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Tooltip;

}/////////////////////////// Component Factory END /////////////////////////////
