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

  // Map kind to the background token. Carbon models buttons as their own token
  // family, so a kind never borrows a general palette token. Every value here
  // must appear in BACKGROUND_COLOR_TOKENS, or no background is applied.
  const KIND_BACKGROUND = {
    primary: 'button_primary',
    secondary: 'button_secondary',
    danger: 'button_danger_primary',
    ghost: undefined
  };

  // Map kind to the text color token. A filled kind needs an on-color label so
  // it contrasts its fill. Every value must appear in FONT_COLOR_TOKENS.
  const KIND_FONT = {
    primary: 'text_on_primary',
    secondary: 'text_on_primary',
    danger: 'text_on_primary',
    ghost: 'app_primary'
  };

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Button = function Button (props) {

    // Destructure props
    const {
      onPress, disabled, selected, background, kind, radius, style, children, accessibilityLabel,
      ...rest
    } = props;

    // kind overrides background when provided
    const effectiveBackground = kind ? KIND_BACKGROUND[kind] : background;

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

      const stateSuffix = _Button.resolveStateSuffix(props, pressableState);

      // Layout: a button is a centered row with padding and an accessible
      // minimum height. Without these a button renders as a bare text label.
      const classes = [
        Style.utilities['flex_row'],
        Style.utilities['align_center'],
        Style.utilities['justify_center'],
        Style.utilities['p_h_md'],
        Style.utilities['p_v_sm'],
        { minHeight: CONFIG.MIN_HIT_TARGET },
        ...baseClasses
      ];

      // Resolve background with state suffix, falling back to the base token
      // through the same accessor so STRICT_TOKENS governs both lookups
      if (effectiveBackground) {
        const bgKey = 'background_' + effectiveBackground + stateSuffix;
        const bgClass = Style.utilities[bgKey];

        if (bgClass) {
          classes.push(bgClass);
        } else {
          // Fall back to the base background without state suffix
          const baseBgKey = 'background_' + effectiveBackground;
          const baseBgClass = Style.utilities[baseBgKey];

          if (baseBgClass) {
            classes.push(baseBgClass);
          }
        }

      }

      // Focus ring for the focused state
      if (pressableState.focused && !disabled) {
        classes.push(Style.utilities['border_focused']);
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
    Resolve the active interaction state to a token suffix. Priority:
    disabled > pressed > hovered > focused > default.

    @param {Object} props          - Component props (reads disabled)
    @param {Object} pressableState - RN Pressable state { pressed, hovered, focused }

    @return {String} - Token suffix ('_disabled', '_pressed', '_hovered', '_focused', or '')
    *********************************************************************/
    resolveStateSuffix: function (props, pressableState) {

      // Disabled takes precedence over all other states
      if (props.disabled) {
        return '_disabled';
      }

      // Selected is a persistent state, checked before transient press/hover
      if (props.selected) {
        return '_selected';
      }

      // Pressed is transient, checked after persistent states
      if (pressableState.pressed) {
        return '_pressed';
      }

      if (pressableState.hovered) {
        return '_hovered';
      }

      if (pressableState.focused) {
        return '_focused';
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
