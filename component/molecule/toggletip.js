// Info: Toggletip molecule [S3 overlay]. A tooltip triggered by press (not
// hover). Uses A11y, Overlay, AnchoredPosition.
//   content     -> string or node (toggletip content)
//   children    -> trigger element
//   placement   -> string (default 'top')
//   style       -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Toggletip molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Toggletip component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Toggletip = function Toggletip (props) {


    const {
      content, children, placement, style
    } = props;

    const React = Lib.React;
    const [isOpen, setIsOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    // Anchored position
    const anchoredPos = Parts.AnchoredPosition({
      placement: placement || 'top',
      offset: 8,
      flip: true,
      anchorRef: anchorRef
    });

    React.useEffect(function () {
      if (isOpen) {
        anchoredPos.measure();
      }
    }, [isOpen]);

    // Generate stable id
    const tipId = React.useRef(Parts.A11y.id('toggletip')).current;

    // Build aria relation props
    const ariaProps = Parts.A11y.relation({
      describedby: tipId
    });

    // Toggle on press
    const handlePress = function () {
      setIsOpen(!isOpen);
    };

    // Render toggletip content
    const renderTip = function () {
      const pos = anchoredPos.position || { top: 0, left: 0 };
      return React.createElement(
        RNView,
        {
          id: tipId,
          style: [
            Style.utilities['background_layer_02'],
            Style.utilities['br_radius_08'],
            Style.utilities['p_a_spacing_03'],
            {
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              maxWidth: 300,
              zIndex: Parts.Stacking.floating
            },
            style
          ]
        },
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: 'text_primary'
        }, content)
      );
    };

    // Guard: children must be a valid React element for cloneElement
    if (!children || !React.isValidElement(children)) {
      return null;
    }

    // Clone trigger with press handler and aria props
    const trigger = React.cloneElement(children, Object.assign({
      ref: anchorRef,
      onPress: handlePress
    }, ariaProps));

    return React.createElement(
      RNView,
      { style: { position: 'relative' } },
      trigger,
      isOpen ? renderTip() : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Toggletip = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Toggletip;

}/////////////////////////// Component Factory END /////////////////////////////
