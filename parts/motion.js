// Info: Motion curve interpretation for rnw-components.
//
// Implements the three curve interpreters of D18: bezier, spring, and segments.
// Every component animation reads its curve through this part so that a theme
// can change motion values without a component release.
//
// Loader pattern: FACTORY part. Uniform parts signature.

/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils and Debug
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - Public Motion interface
*********************************************************************/
export default function (shared_libs, config, errors) {

  // Dependencies for this part, by reference from the shared container
  const Lib = {
    Utils: shared_libs.Utils,
    Debug: shared_libs.Debug
  };

  // Frozen error catalog, held for parity with every other part
  const ERRORS = errors; // eslint-disable-line no-unused-vars

  // Build the public interface from the injected dependencies
  return createInterface(Lib);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Build the Motion interface over one instance's injected dependencies.

@param {Object} Lib - Dependency container with Utils and Debug

@return {Object} - Public Motion interface
*********************************************************************/
const createInterface = function (Lib) {


  ///////////////////////////Public Functions START//////////////////////////////

  const Motion = {
    // Public Motion interface: curve interpretation for animations


    /********************************************************************
    Convert a motion curve token into a React Native easing or animation
    configuration.

    A motion token is one of three kinds (D18):
    - bezier: { x1, y1, x2, y2 } -> Easing.bezier(x1, y1, x2, y2)
    - spring: { stiffness, damping, mass } -> Animated.spring parameters
    - segments: { segments: true, curves: [[t, [x1, y1, x2, y2]], ...] } -> sequenced bezier list

    @param {Object} token - Motion curve token from the theme

    @return {Object} - { kind, easing, spring } where:
      - bezier: { kind: 'bezier', easing: Easing.bezier(...) }
      - spring: { kind: 'spring', spring: { stiffness, damping, mass } }
      - segments: { kind: 'segments', easing: Easing.sequence(...) }
      - null/undefined: { kind: 'linear', easing: null }
    *********************************************************************/
    toEasing: function (token) {

      // Absent token: the caller animates without a curve (linear on web,
      // default on native). Returning a neutral descriptor lets the caller
      // decide whether to pass easing at all.
      if (Lib.Utils.isNullOrUndefined(token)) {
        return { kind: 'linear', easing: null, spring: null };
      }

      // Bezier: four control numbers. React Native's Easing.bezier accepts
      // exactly the same four numbers as CSS cubic-bezier().
      if (Lib.Utils.isObject(token) && !Lib.Utils.isNullOrUndefined(token.x1) &&
          !Lib.Utils.isNullOrUndefined(token.y1) &&
          !Lib.Utils.isNullOrUndefined(token.x2) &&
          !Lib.Utils.isNullOrUndefined(token.y2)) {
        return {
          kind: 'bezier',
          easing: _Motion.bezier(token.x1, token.y1, token.x2, token.y2),
          spring: null
        };
      }

      // Spring: stiffness, damping, mass. The caller passes these to
      // Animated.spring; the part does not import Animated to stay platform-agnostic.
      if (Lib.Utils.isObject(token) && !Lib.Utils.isNullOrUndefined(token.stiffness) &&
          !Lib.Utils.isNullOrUndefined(token.damping) &&
          !Lib.Utils.isNullOrUndefined(token.mass)) {
        return {
          kind: 'spring',
          easing: null,
          spring: { stiffness: token.stiffness, damping: token.damping, mass: token.mass }
        };
      }

      // Segments: { segments: true, curves: [[t, [x1, y1, x2, y2]], ...] }
      // This is the format themer.validators.js isValidSegments accepts.
      // Some design systems express emphasized curves as multi-segment
      // beziers. React Native runs them as a sequence of Easing.bezier calls.
      if (Lib.Utils.isObject(token) && token.segments === true &&
          Lib.Utils.isArray(token.curves)) {
        return {
          kind: 'segments',
          easing: _Motion.segments(token.curves),
          spring: null
        };
      }

      // Unknown shape: fall back to linear so a bad token never crashes a render
      Lib.Debug.debug('rnw-components: unknown motion curve shape', { token });
      return { kind: 'linear', easing: null, spring: null };
    }


  };///////////////////////////Public Functions END//////////////////////////////


  ///////////////////////////Private Functions START////////////////////////////
  const _Motion = {

    /********************************************************************
    Build a bezier easing function. Lazy-imports Easing from React Native
    so the part stays importable in pure Node (tests).

    @param {Number} x1 - First control point x
    @param {Number} y1 - First control point y
    @param {Number} x2 - Second control point x
    @param {Number} y2 - Second control point y

    @return {Object|null} - Easing function or null when Easing is unavailable
    *********************************************************************/
    bezier: function (x1, y1, x2, y2) {

      // Lazy import: Easing is a React Native API not available in pure Node
      try {
        const Easing = _Motion.requireEasing();
        if (Easing && Lib.Utils.isFunction(Easing.bezier)) {
          return Easing.bezier(x1, y1, x2, y2);
        }
      } catch {
        // Easing not available (pure Node test environment)
      }

      return null;
    },


    /********************************************************************
    Build a sequenced easing from segment curves. Each entry is
    [t, [x1, y1, x2, y2]] where t is the split position in 0..1 and
    [x1, y1, x2, y2] are the bezier control points for that segment.

    @param {Array} curves - Segment curves [[t, [x1, y1, x2, y2]], ...]

    @return {Object|null} - Easing.sequence result, or null when
      Easing.bezier or Easing.sequence is unavailable (pure Node test
      environment). When available, returns the result of
      Easing.sequence(bezier1, bezier2, ...) where each bezier is built
      from the corresponding curve's control points.
    *********************************************************************/
    segments: function (curves) {

      try {
        const Easing = _Motion.requireEasing();
        if (!Easing || !Lib.Utils.isFunction(Easing.bezier) ||
            !Lib.Utils.isFunction(Easing.sequence)) {
          return null;
        }

        // Build a bezier for each curve entry. Each entry is
        // [t, [x1, y1, x2, y2]]; the bezier uses the four control numbers.
        const easings = [];
        for (let i = 0; i < curves.length; i++) {
          const curve = curves[i][1];
          easings.push(Easing.bezier(curve[0], curve[1], curve[2], curve[3]));
        }

        return Easing.sequence.apply(null, easings);
      } catch {
        // Easing not available (pure Node test environment)
      }

      return null;
    },


    /********************************************************************
    Lazy-require React Native's Easing module. Cached after first call.

    @return {Object|null} - Easing module or null when unavailable
    *********************************************************************/
    requireEasing: function () {

      // Cache on first successful resolution
      if (_Motion._easingCache !== undefined) {
        return _Motion._easingCache;
      }

      try {
        // React Native Web exposes Easing through the react-native import
        const RN = require('react-native');
        _Motion._easingCache = RN.Easing || null;
      } catch {
        _Motion._easingCache = null;
      }

      return _Motion._easingCache;
    }


  };///////////////////////////Private Functions END/////////////////////////////


  // Return the public Motion interface
  return Motion;

};/////////////////////////// createInterface END ///////////////////////////////
