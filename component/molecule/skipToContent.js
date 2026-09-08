// Info: SkipToContent molecule [S2 interactive]. A skip-to-content link for
// accessibility. Uses role="link" for screen reader semantics. Platform:
// web-primary (renders null on native).
//   href        -> string (link target, optional)
//   targetId    -> string (id of the content to skip to)
//   style       -> custom style overrides


// Imports
import { Pressable, Platform } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the SkipToContent molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The SkipToContent component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const SkipToContent = function SkipToContent (props) {


    const {
      href, targetId, style,
      ...rest
    } = props;

    const React = Lib.React;

    // On native, render null
    if (Platform.OS !== 'web') {
      return null;
    }

    // Resolve the link target: href takes precedence, else build from targetId
    const resolvedHref = href || (targetId ? ('#' + targetId) : '#main-content');

    // Handle activation: navigate to the target
    const handlePress = function () {
      if (typeof document !== 'undefined' && targetId) {
        const el = document.getElementById(targetId);
        if (el && Lib.Utils.isFunction(el.focus)) {
          el.focus();
        }
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({});

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'link',
      onActivate: handlePress,
      disabled: false
    });

    return React.createElement(
      Pressable,
      Object.assign({
        onPress: handlePress,
        accessibilityRole: 'link',
        accessibilityLabel: 'Skip to content',
        href: resolvedHref
      }, ariaProps, pressKeysProps, {
        style: [
          Style.utilities['p_h_spacing_05'],
          Style.utilities['p_v_spacing_03'],
          Style.utilities['background_layer_02'],
          style
        ]
      }, rest),
      React.createElement(Registry.Text, {
        typeSet: 'body01',
        color: 'interactive',
        weight: 'medium'
      }, 'Skip to content')
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _SkipToContent = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return SkipToContent;

}/////////////////////////// Component Factory END /////////////////////////////
