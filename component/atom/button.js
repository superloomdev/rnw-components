// Info: Button atom [S2 interactive]. Wraps Pressable, resolves the five
// interaction states (enabled, hovered, pressed, focused, disabled), and
// guarantees the minimum accessible hit target. Applies its own padding,
// centering, and minHeight from CONFIG.MIN_HIT_TARGET. String children are
// wrapped in Registry.Text with a per-kind label color; function children
// receive the interaction state and pass through untouched.
//   kind -> 'primary' | 'secondary' | 'danger' | 'ghost' (maps to button token family background and label color)
//   children -> Node|Function (string wrapped in Text, function passed through)


// Imports
import { Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Button atom.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, Units }
@param {Object} Registry - Component registry (Text for the label)
@param {Object} Style    - { utilities, tokens, breakpoint }

@return {Function} - The Button component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////

  // Map kind to per-state background token names. Each kind declares
  // its base, hover, and active backgrounds. Disabled uses the shared
  // button_disabled token. Selected reuses the active appearance.
  // Focused uses the base plus the focus ring (no focused background).
  const KIND_BG = {
    primary: { base: 'button_primary', hover: 'button_primary_hover', active: 'button_primary_active' },
    secondary: { base: 'button_secondary', hover: 'button_secondary_hover', active: 'button_secondary_active' },
    tertiary: { base: 'button_tertiary', hover: 'button_tertiary_hover', active: 'button_tertiary_active' },
    danger: { base: 'button_danger_primary', hover: 'button_danger_hover', active: 'button_danger_active' },
    ghost: {}
  };

  // Shared disabled background for all button kinds
  const DISABLED_BG = 'button_disabled';

  // Map kind to the text color token. A filled kind needs an on-color label so
  // it contrasts its fill.
  const KIND_FONT = {
    primary: 'text_on_color',
    secondary: 'text_on_color',
    tertiary: 'interactive',
    danger: 'text_on_color',
    ghost: 'interactive'
  };

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Button = function Button (props) {

    // Destructure props
    const {
      onPress, disabled, selected, background, kind, radius, style, children, accessibilityLabel,
      ...rest
    } = props;

    const React = Lib.React;

    // Track visual dimensions for hitSlop calculation
    const layoutRef = React.useRef({ height: 0, width: 0 });


    // ---- Base utility classes ----
    const baseClasses = [];

    if (radius) {
      const brClass = Style.utilities['br_' + radius];
      if (brClass) {
        baseClasses.push(brClass);
      }
    }


    // ---- Style function for Pressable (resolves interaction states) ----
    const styleFn = function (pressableState) {

      const stateKey = _Button.resolveStateKey(props, pressableState);

      // Layout: a button is a centered row with padding and an accessible
      // minimum height. Without these a button renders as a bare text label.
      const classes = [
        Style.utilities['flex_row'],
        Style.utilities['align_center'],
        Style.utilities['justify_center'],
        Style.utilities['p_h_spacing_05'],
        Style.utilities['p_v_spacing_03'],
        { minHeight: CONFIG.MIN_HIT_TARGET },
        ...baseClasses
      ];

      // Resolve background from the kind + state mapping. Kind buttons
      // use per-state token names that match the contract. Generic
      // background props use the base token only, since state variants
      // do not exist for arbitrary caller-provided tokens.
      if (kind) {
        const kindBg = KIND_BG[kind];
        let bgToken;

        if (stateKey === 'disabled') {
          bgToken = DISABLED_BG;
        } else if (stateKey === 'selected') {
          bgToken = kindBg.active || kindBg.base;
        } else if (stateKey === 'focused') {
          bgToken = kindBg.base;
        } else {
          bgToken = kindBg[stateKey] || kindBg.base;
        }

        if (bgToken) {
          classes.push(Style.utilities['background_' + bgToken]);
        }
      } else if (background) {
        classes.push(Style.utilities['background_' + background]);
      }

      // Focus ring for the focused state
      if (pressableState.focused && !disabled) {
        classes.push(Style.utilities['focus_ring']);
      }

      return [...classes, style];

    };


    // ---- Accessibility ----
    const ariaProps = Parts.A11y.state({
      disabled: !!disabled,
      selected: selected !== undefined ? !!selected : undefined
    });


    // Render
    return Lib.React.createElement(
      Pressable,
      Object.assign({
        onPress: disabled ? null : onPress,
        disabled: disabled,
        accessibilityRole: 'button',
        accessibilityLabel: accessibilityLabel,
        hitSlop: _Button.resolveHitSlop(layoutRef.current.height, layoutRef.current.width),
        onLayout: function (e) {
          layoutRef.current = e.nativeEvent.layout;
        },
        style: styleFn
      }, ariaProps, rest),
      Lib.Utils.isFunction(children)
        ? children
        : Lib.React.createElement(
          Registry.Text,
          { color: KIND_FONT[kind || 'primary'] },
          children
        )
    );

  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Button = {

    /********************************************************************
    Resolve the active interaction state to a state key. Priority:
    disabled > selected > pressed > hovered > focused > default.

    @param {Object} props          - Component props (reads disabled, selected)
    @param {Object} pressableState - RN Pressable state { pressed, hovered, focused }

    @return {String} - State key ('disabled', 'selected', 'active', 'hover', 'focused', or '')
    *********************************************************************/
    resolveStateKey: function (props, pressableState) {

      // Disabled takes precedence over all other states
      if (props.disabled) {
        return 'disabled';
      }

      // Selected is a persistent state, checked before transient press/hover
      if (props.selected) {
        return 'selected';
      }

      // Pressed maps to the active state
      if (pressableState.pressed) {
        return 'active';
      }

      // Hovered maps to the hover state
      if (pressableState.hovered) {
        return 'hover';
      }

      // Focused uses the base background plus focus ring
      if (pressableState.focused) {
        return 'focused';
      }

      return '';

    },


    /********************************************************************
    Compute hitSlop so the touch target reaches the accessible minimum.
    Returns undefined when the visual box already clears the minimum on
    both axes.

    @param {Number} height - Current layout height
    @param {Number} width  - Current layout width

    @return {Object|undefined} - Hit slop insets or undefined
    *********************************************************************/
    resolveHitSlop: function (height, width) {

      if (height >= CONFIG.MIN_HIT_TARGET && width >= CONFIG.MIN_HIT_TARGET) {
        return undefined;
      }

      const padV = Parts.Units.clamp(Parts.Units.ceil((CONFIG.MIN_HIT_TARGET - height) / 2), 0, Infinity);
      const padH = Parts.Units.clamp(Parts.Units.ceil((CONFIG.MIN_HIT_TARGET - width) / 2), 0, Infinity);

      return { top: padV, bottom: padV, left: padH, right: padH };

    }

  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Button;

}/////////////////////////// Component Factory END /////////////////////////////
