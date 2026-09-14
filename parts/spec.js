// Info: Component spec sheet accessor.
//
// Provides Parts.Spec(name) so component implementations can resolve
// geometry, frame style, states, targets, and icon names from the shared
// spec sheet in data/component-spec.js. Tests read the same data file
// directly and assert the DOM against it.
//
// Loader pattern: FACTORY part. Uniform parts signature.

/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils and Debug
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - Public Spec interface
*********************************************************************/
import SPEC from '../data/component-spec.js';

export default function (shared_libs, config, errors) {

  const ERRORS = errors; // eslint-disable-line no-unused-vars

  /********************************************************************
  Resolve a component spec by name. Returns a frozen object or undefined.
  *********************************************************************/
  function Spec (name) {
    return SPEC[name];
  }

  // Return the function directly so Parts.Spec('icon') works.
  // The function is frozen to prevent mutation.
  return Object.freeze(Spec);

}/////////////////////////// Module-Loader END /////////////////////////////////
