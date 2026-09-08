// Info: Default configuration for rnw-components.
//
// All keys can be overridden by passing a config object to the loader.

export default {

  // Default type set when a component receives no typeSet prop
  DEFAULT_TYPE_SET: 'body01',

  // Default font color token when a component receives no color prop
  DEFAULT_FONT_COLOR: 'text_primary',

  // Default font family role when a component receives no family prop
  DEFAULT_FONT_FAMILY: 'sans',

  // Minimum accessible hit target in points (iOS HIG 44, Android Material 48)
  MIN_HIT_TARGET: 44,

  // Breakpoint keys in ascending order, matching the contract v2 names
  BREAKPOINT_ORDER: ['sm', 'md', 'lg', 'xlg', 'max'],

  // Throw on a utility lookup that names a key the theme did not produce.
  // Off by default so a server-driven theme degrades rather than crashing;
  // test tiers and CI turn it on, which is where a dead token must fail.
  STRICT_TOKENS: false

};
