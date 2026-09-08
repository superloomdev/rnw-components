// Info: Token reshaping for rnw-components.
//
// Reshapes the Themer's flat emitted token map into the internal groups
// the components consume: { Color, Spacing, Size, Shape, Border, Focus,
// Motion, Feedback, Shadow, TypeSet, Font, Breakpoint }.
//
// The group is the first segment of the dotted token name; the rest is the
// leaf name, kept verbatim (no camelCase conversion). Multi-segment leaves
// create nested objects: font.family.sans -> Font.family.sans.
//
// Path hardening rejects __proto__, constructor, prototype, empty segments,
// and key collisions. Carried over from the old theme-contract bridge.
//
// Loader pattern: FACTORY part. Uniform parts signature.

/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils and Debug
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - Public Tokens interface
*********************************************************************/
export default function (shared_libs, config, errors) {

  const Lib = {
    Utils: shared_libs.Utils,
    Debug: shared_libs.Debug
  };

  const ERRORS = errors;

  return createInterface(Lib, ERRORS);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

const createInterface = function (Lib, ERRORS) {

  // The group name mapping: first segment of the dotted token name -> internal
  // PascalCase group name. Every token in the contract belongs to exactly one
  // of these groups.
  const GROUP_MAP = {
    color: 'Color',
    spacing: 'Spacing',
    size: 'Size',
    shape: 'Shape',
    border: 'Border',
    focus: 'Focus',
    motion: 'Motion',
    feedback: 'Feedback',
    shadow: 'Shadow',
    type: 'TypeSet',
    font: 'Font',
    breakpoint: 'Breakpoint',
    grid: 'Grid',
    state: 'State',
    tint: 'Tint',
    easing: 'Easing'
  };

  // Segments that must never appear as object keys (prototype pollution)
  const UNSAFE_SEGMENTS = { __proto__: 1, constructor: 1, prototype: 1 };


  ///////////////////////////Public Functions START//////////////////////////////

  const Tokens = {
    // Public Tokens interface: flat-to-nested reshaping


    /********************************************************************
    Reshape a flat token map into the internal groups.

    @param {Object} flat - Flat token map from Themer.buildTheme().tokens

    @return {Object} - { Color, Spacing, Size, Shape, Border, Focus, Motion,
                        Feedback, Shadow, TypeSet, Font, Breakpoint, ... }
    *********************************************************************/
    reshape: function (flat) {

      // Guard: the flat map must be a plain object
      if (!Lib.Utils.isObject(flat)) {
        throw new TypeError(ERRORS.THEME_MISSING_TOKENS);
      }

      // Build the internal groups
      const groups = {};
      const names = Object.keys(flat);

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const value = flat[name];

        // Skip private keys (underscore-prefixed)
        if (name.charAt(0) === '_') {
          continue;
        }

        // Split the dotted name into segments
        const segments = name.split('.');

        // The first segment is the group; the rest is the leaf path
        const groupKey = segments[0];
        const leafSegments = segments.slice(1);

        // Map the group key to the internal PascalCase name
        const groupName = GROUP_MAP[groupKey] || groupKey.charAt(0).toUpperCase() + groupKey.slice(1);

        // Ensure the group container exists
        if (!groups[groupName]) {
          groups[groupName] = {};
        }

        // Assign the token into the group at the leaf path
        _Tokens.assignToken(groups[groupName], leafSegments, value, name);
      }

      return groups;
    }


  };///////////////////////////Public Functions END//////////////////////////////


  ///////////////////////////Private Functions START////////////////////////////
  const _Tokens = {

    /********************************************************************
    Assign a value into a container at a multi-segment leaf path.
    Rejects unsafe segments, empty segments, and key collisions.

    @param {Object} container - The group container object
    @param {Array} segments - Leaf path segments (e.g. ['family', 'sans'])
    @param {*} value - The token value
    @param {String} fullName - The full dotted name (for error messages)
    *********************************************************************/
    assignToken: function (container, segments, value, fullName) {

      // Reject empty segment lists (a bare group name with no leaf)
      if (Lib.Utils.isEmptyArray(segments)) {
        throw new TypeError('rnw-components: token "' + fullName + '" has no leaf path');
      }

      // Walk the segments, creating nested containers as needed
      let current = container;

      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];

        // Reject empty segments (consecutive dots)
        if (!seg) {
          throw new TypeError('rnw-components: token "' + fullName + '" has an empty segment');
        }

        // Reject prototype pollution attempts
        if (UNSAFE_SEGMENTS[seg]) {
          throw new TypeError('rnw-components: token "' + fullName + '" uses a reserved segment');
        }

        // The last segment is the leaf: assign the value
        if (i === segments.length - 1) {

          // Reject collisions: a key that already exists as a non-object
          // means two tokens map to the same path
          if (current[seg] !== undefined && !Lib.Utils.isObject(current[seg])) {
            throw new TypeError('rnw-components: token "' + fullName + '" collides with an existing key');
          }

          current[seg] = value;
          break;
        }

        // Intermediate segment: create a nested container if absent
        if (current[seg] === undefined) {
          current[seg] = {};
        } else if (!Lib.Utils.isObject(current[seg])) {

          // A scalar value already occupies this path: collision
          throw new TypeError('rnw-components: token "' + fullName + '" collides with an existing value');
        }

        current = current[seg];
      }
    }

  };///////////////////////////Private Functions END/////////////////////////////


  return Tokens;

};/////////////////////////// createInterface END ///////////////////////////////
