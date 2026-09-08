// Info: Font weight-to-face resolution for rnw-components.
//
// Owns the contract between the themer (names font roles), the font module
// (loads and registers faces), and the components (request a weight). When
// Lib.Font is injected the resolver can map a role+weight to the concrete
// family the font module registered. When Lib.Font is absent, the part
// falls back to the pre-existing behavior: pair fontWeight with the
// theme's Font.family.primary.
//
// Loader pattern: FACTORY part. Uniform parts signature.

/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils, Debug, and
                                  optionally Font
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - Public Typeface interface
*********************************************************************/
export default function (shared_libs, config, errors) {

  // Dependencies for this part, by reference from the shared container
  const Lib = {
    Utils: shared_libs.Utils,
    Debug: shared_libs.Debug,
    Font: shared_libs.Font || null
  };

  // Frozen error catalog, held for parity with every other part
  const ERRORS = errors; // eslint-disable-line no-unused-vars

  // Build the public interface from the injected dependencies
  return createInterface(Lib);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Build the Typeface interface over one instance's injected dependencies.

@param {Object} Lib - Dependency container with Utils, Debug, and
                          optionally Font

@return {Object} - Public Typeface interface
*********************************************************************/
const createInterface = function (Lib) {


  // Families that synthesize weight via the platform font renderer.
  // These families do not carry per-weight face files; the OS draws
  // bold/semibold by thickening the outline. Pairing fontWeight with
  // these families is correct and expected.
  const SYNTHESIZING_FAMILIES = [
    'System',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Helvetica',
    'Arial',
    'sans-serif',
    'serif',
    'monospace'
  ];


  ///////////////////////////Public Functions START//////////////////////////////

  const Typeface = {
    // Public Typeface interface: font role/weight resolution and style fragments


    /********************************************************************
    Resolve a font role and weight to the concrete family name.

    When Lib.Font is available, delegates to Font.resolveFamily to get
    the family registered for the given role. When absent, returns the
    theme family directly.

    @param {String} role   - Font role key (e.g. 'primary', 'secondary')
    @param {String} weight - Weight key (e.g. 'regular', 'bold')
    @param {Object} Font   - Theme Font contract { family, weight }

    @return {String} - Concrete family name
    *********************************************************************/
    resolve: function (role, weight, Font) {

      // When the font module is injected, resolve through it
      if (Lib.Font) {

        const result = Lib.Font.resolveFamily(role);

        // Use the font module's family when it confirms a resolution
        if (result.success && result.family) {
          return result.family;
        }

      }

      // Fall back to the theme's declared family for the role
      return Font.family[role] || Font.family.primary;

    },


    /********************************************************************
    Return the full style fragment for a role and weight.

    For synthesizing families (System, web-safe stacks), the fragment
    includes both fontFamily and fontWeight - the platform renderer
    synthesizes the weight. For per-weight-face families (e.g.
    Poppins_400Regular), the fragment includes only fontFamily - the
    weight is baked into the face file.

    @param {String} role   - Font role key (e.g. 'primary', 'secondary')
    @param {String} weight - Weight value (e.g. '400', '700')
    @param {Object} Font   - Theme Font contract { family, weight }

    @return {Object} - Style fragment { fontFamily } or { fontFamily, fontWeight }
    *********************************************************************/
    styleFor: function (role, weight, Font) {

      // Resolve the concrete family for this role
      const family = Typeface.resolve(role, weight, Font);

      // Synthesizing families need fontWeight to tell the OS which weight
      if (Typeface.isSynthesizing(family)) {
        return { fontFamily: family, fontWeight: weight };
      }

      // Per-weight-face families: weight is in the face name, not in CSS
      return { fontFamily: family };

    },


    /********************************************************************
    True when the family synthesizes weight via the platform renderer.

    @param {String} family - Font family name

    @return {Boolean} - True for System and web-safe stack families
    *********************************************************************/
    isSynthesizing: function (family) {

      // Guard against invalid input
      if (!Lib.Utils.isString(family)) {
        return true;
      }

      // Check against the known synthesizing families
      for (let i = 0; i < SYNTHESIZING_FAMILIES.length; i++) {
        if (family === SYNTHESIZING_FAMILIES[i]) {
          return true;
        }
      }

      // Not a known synthesizing family, so it carries per-weight faces
      return false;

    }


  };///////////////////////////Public Functions END//////////////////////////////


  // Return the public Typeface interface
  return Typeface;

};/////////////////////////// createInterface END //////////////////////////////
