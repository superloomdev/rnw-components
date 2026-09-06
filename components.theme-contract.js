// Info: Bridge between the themer engine and the component theme contract.
//
// Reshapes the flat emitted token map from Lib.Themer.buildTheme() into the
// nested { Color, Dimension, Font, Breakpoint, TypeSet, Shadow, Motion, Layer }
// structure the component library consumes. Also adds the Breakpoint group,
// which the themer does not own (breakpoints are a layout concern, not a
// design token).
//
// Pure function, no side effects. Called at build time.


// Default breakpoint definitions. These are layout boundaries, not design
// tokens, so they live here rather than in the themer template.
const DEFAULT_BREAKPOINTS = {
  base: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280
};


/********************************************************************
Convert a snake_case string to camelCase.

@pString {String} s - The snake_case string

@return {String} - The camelCase version
*********************************************************************/
function toCamelCase (s) {

  return s.replace(/_([a-z])/g, function (_, c) {
    return c.toUpperCase();
  });

}


/********************************************************************
Reshape the themer's flat emitted token map into the nested
{ Color, Dimension, Font, Breakpoint, TypeSet, Shadow, Motion, Layer }
structure the components expect.

Tokens named color.APP_PRIMARY -> Color.APP_PRIMARY
Tokens named dimension.font_size.xs -> Dimension.fontSize.xs
Tokens named font.family.primary -> Font.family.primary
Tokens named type.body_01 -> TypeSet.body01
Tokens named shadow.card -> Shadow.card
Tokens named motion.duration_fast_01 -> Motion.durationFast01
Tokens named layer.background -> Layer.background

Raw `typeof` is used deliberately: this is a standalone pure function
with no `Lib` injection, so the Utils type primitives are not available.

@param {Object} themer_output - Result from Lib.Themer.buildTheme(), or
                                 a flat token map directly

@return {Object} - { Color, Dimension, Font, Breakpoint, TypeSet, Shadow, Motion, Layer }
*********************************************************************/
export default function buildThemeContract (themer_output) {

  // Accept either the full buildTheme result or just the tokens map
  const flat = (themer_output && themer_output.tokens) ? themer_output.tokens : themer_output;

  // Guard against null/undefined input
  if (!flat || typeof flat !== 'object') {
    return {
      Color: {},
      Dimension: {},
      Font: { family: {}, weight: {} },
      Breakpoint: { ...DEFAULT_BREAKPOINTS },
      TypeSet: {},
      Shadow: {},
      Motion: {},
      Layer: {}
    };
  }

  // Initialize the nested token group containers
  const Color = {};
  const Dimension = {};
  const Font = { family: {}, weight: {} };
  const TypeSet = {};
  const Shadow = {};
  const Motion = {};
  const Layer = {};
  const containers = new WeakSet([Font.family, Font.weight]);

  // Walk the flat token map and partition by prefix
  const flatKeys = Object.keys(flat);

  // Partition each flat token into its nested group by prefix
  for (let i = 0; i < flatKeys.length; i++) {
    const key = flatKeys[i];
    const value = flat[key];

    // Skip helper tokens (prefixed with _)
    if (key.charAt(0) === '_') {
      continue;
    }

    // Split the dotted key into parts
    const parts = key.split('.');

    // Color tokens: color.APP_PRIMARY -> Color.APP_PRIMARY
    if (parts[0] === 'color') {
      assignToken(Color, parts.slice(1), value, containers);

    // Dimension tokens: dimension.font_size.xs -> Dimension.fontSize.xs
    } else if (parts[0] === 'dimension') {

      if (parts.length >= 3) {
        // Convert snake_case sub-group to camelCase: font_size -> fontSize
        const scaleName = toCamelCase(parts[1]);

        // Round font sizes to integers for clean native rendering
        const emittedValue = (scaleName === 'fontSize') ? Math.round(value) : value;
        assignToken(Dimension, [scaleName, ...parts.slice(2)], emittedValue, containers);

      } else {
        // Scalar dimension: dimension.line_height_ratio -> Dimension.lineHeightRatio
        assignToken(Dimension, parts.slice(1).map(toCamelCase), value, containers);

      }

    // Font tokens: font.family.primary -> Font.family.primary
    } else if (parts[0] === 'font') {

      assignToken(Font, parts.slice(1), value, containers);

    // Type set tokens: type.body_01 -> TypeSet.body01
    } else if (parts[0] === 'type') {

      // Convert snake_case key to camelCase: body_01 -> body01
      const typeKey = parts.slice(1).map(toCamelCase);
      assignToken(TypeSet, typeKey, value, containers);

    // Shadow tokens: shadow.card -> Shadow.card
    } else if (parts[0] === 'shadow') {

      assignToken(Shadow, parts.slice(1), value, containers);

    // Motion tokens: motion.duration_fast_01 -> Motion.durationFast01
    } else if (parts[0] === 'motion') {

      assignToken(Motion, parts.slice(1).map(toCamelCase), value, containers);

    // Layer tokens: layer.background -> Layer.background
    } else if (parts[0] === 'layer') {

      assignToken(Layer, parts.slice(1), value, containers);

    }

  }

  // Return the nested structure with breakpoints
  return {
    Color: Color,
    Dimension: Dimension,
    Font: Font,
    Breakpoint: { ...DEFAULT_BREAKPOINTS },
    TypeSet: TypeSet,
    Shadow: Shadow,
    Motion: Motion,
    Layer: Layer
  };

}


function assignToken (group, path, value, containers) {

  if (!path.length || path.some(function (part) {
    return !part || ['__proto__', 'constructor', 'prototype'].includes(part);
  })) {
    throw new TypeError('rnw-components-carbon: invalid token path ' + path.join('.'));
  }

  let target = group;
  for (let i = 0; i < path.length - 1; i++) {
    const part = path[i];
    if (!Object.prototype.hasOwnProperty.call(target, part)) {
      target[part] = {};
      containers.add(target[part]);
    } else if (!containers.has(target[part])) {
      throw new TypeError('rnw-components-carbon: colliding token path ' + path.join('.'));
    }
    target = target[part];
  }

  const leaf = path[path.length - 1];
  if (Object.prototype.hasOwnProperty.call(target, leaf)) {
    throw new TypeError('rnw-components-carbon: colliding token path ' + path.join('.'));
  }
  target[leaf] = value;

}
