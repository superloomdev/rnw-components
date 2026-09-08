// Info: Default configuration for rnw-components.
//
// All keys can be overridden by passing a config object to the loader.

export default {

  // Default font size token when a component receives no size prop
  DEFAULT_FONT_SIZE: 'md',

  // Default font color token when a component receives no color prop
  DEFAULT_FONT_COLOR: 'text_primary',

  // Default font weight token when a component receives no weight prop
  DEFAULT_FONT_WEIGHT: 'regular',

  // Minimum accessible hit target in points (iOS HIG 44, Android Material 48)
  MIN_HIT_TARGET: 44,

  // Breakpoint keys in ascending order, matching the theme contract
  BREAKPOINT_ORDER: ['base', 'sm', 'md', 'lg', 'xl'],

  // Throw on a utility lookup that names a key the theme did not produce.
  // Off by default so a server-driven theme degrades rather than crashing;
  // test tiers and CI turn it on, which is where a dead token must fail.
  STRICT_TOKENS: false

};
