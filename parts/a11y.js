// Info: The single translator from semantic state to aria-* props.
//
// This is the ONLY module in the package allowed to emit accessibility
// state/value/relation/position props. Components call a11y.state(),
// a11y.value(), a11y.relation(), a11y.position(), and a11y.id() to get
// props that they spread onto their host element.
//
// Never emits the deprecated RN accessibility state/value/hint props or
// the view-is-modal/elements-hidden/important-for-accessibility props.
// Those are silent no-ops on web. accessibilityRole and accessibilityLabel
// remain correct and are passed directly by components, not through this
// module.
//
// Omits keys whose value is null or undefined so the DOM never receives
// aria-checked="undefined".


/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils, Debug, React
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - { state, value, relation, position, id }
*********************************************************************/
export default function (shared_libs, config, errors) { // eslint-disable-line no-unused-vars

  // Build the Lib container from shared_libs
  const Lib = { Utils: shared_libs.Utils, Debug: shared_libs.Debug, React: shared_libs.React };

  // Return the public a11y translator interface
  return createInterface(Lib);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Build the a11y translator. Closes over Lib for the id generator's
counter storage.

@param {Object} Lib - The shared Lib container (requires React for refs)

@return {Object} - { state, value, relation, position, id }
*********************************************************************/
const createInterface = function (Lib) {


  ///////////////////////////Public Functions START//////////////////////////////

  // Monotonic id counter, stable per loader instance
  let idCounter = 0;


  // Semantic state -> aria-* props. Omits keys whose value is null/undefined.
  // checked accepts true | false | 'mixed'.
  const state = function (opts) {

    // Validate: return empty object if no options provided
    if (!opts) {
      return {};
    }

    // Init: prepare the props accumulator
    const props = {};

    // checked: true, false, or 'mixed' (for indeterminate checkboxes)
    if (!Lib.Utils.isNullOrUndefined(opts.checked)) {
      props['aria-checked'] = opts.checked;
    }

    // disabled: boolean
    if (!Lib.Utils.isNullOrUndefined(opts.disabled)) {
      props['aria-disabled'] = !!opts.disabled;
    }

    // expanded: boolean
    if (!Lib.Utils.isNullOrUndefined(opts.expanded)) {
      props['aria-expanded'] = !!opts.expanded;
    }

    // selected: boolean
    if (!Lib.Utils.isNullOrUndefined(opts.selected)) {
      props['aria-selected'] = !!opts.selected;
    }

    // invalid: boolean
    if (!Lib.Utils.isNullOrUndefined(opts.invalid)) {
      props['aria-invalid'] = !!opts.invalid;
    }

    // required: boolean
    if (!Lib.Utils.isNullOrUndefined(opts.required)) {
      props['aria-required'] = !!opts.required;
    }

    // readonly: boolean
    if (!Lib.Utils.isNullOrUndefined(opts.readonly)) {
      props['aria-readonly'] = !!opts.readonly;
    }

    // busy: boolean
    if (!Lib.Utils.isNullOrUndefined(opts.busy)) {
      props['aria-busy'] = !!opts.busy;
    }

    // pressed: boolean (for toggle buttons)
    if (!Lib.Utils.isNullOrUndefined(opts.pressed)) {
      props['aria-pressed'] = !!opts.pressed;
    }

    // current: 'page' | 'step' | 'location' | 'date' | 'time' | true | false
    if (!Lib.Utils.isNullOrUndefined(opts.current)) {
      props['aria-current'] = opts.current;
    }

    // hidden: boolean
    if (!Lib.Utils.isNullOrUndefined(opts.hidden)) {
      props['aria-hidden'] = !!opts.hidden;
    }

    // modal: boolean (for overlay containers)
    if (!Lib.Utils.isNullOrUndefined(opts.modal)) {
      props['aria-modal'] = !!opts.modal;
    }

    // Return the accumulated aria-* props
    return props;

  };


  // Numeric value semantics for slider, progressbar, spinbutton.
  const value = function (opts) {

    // Validate: return empty object if no options provided
    if (!opts) {
      return {};
    }

    // Init: prepare the props accumulator
    const props = {};

    // min: minimum value for range widgets
    if (!Lib.Utils.isNullOrUndefined(opts.min)) {
      props['aria-valuemin'] = opts.min;
    }

    // max: maximum value for range widgets
    if (!Lib.Utils.isNullOrUndefined(opts.max)) {
      props['aria-valuemax'] = opts.max;
    }

    // now: current value for range widgets
    if (!Lib.Utils.isNullOrUndefined(opts.now)) {
      props['aria-valuenow'] = opts.now;
    }

    // text: human-readable text alternative for the current value
    if (!Lib.Utils.isNullOrUndefined(opts.text)) {
      props['aria-valuetext'] = opts.text;
    }

    // Return the accumulated aria-value* props
    return props;

  };


  // Relationship props. Web-only in effect; harmless on native.
  const relation = function (opts) {

    // Validate: return empty object if no options provided
    if (!opts) {
      return {};
    }

    // Init: prepare the props accumulator
    const props = {};

    // controls: id of element(s) controlled by this element
    if (opts.controls) {
      props['aria-controls'] = opts.controls;
    }

    // describedby: id of element(s) that describe this element
    if (opts.describedby) {
      props['aria-describedby'] = opts.describedby;
    }

    // labelledby: id of element(s) that label this element
    if (opts.labelledby) {
      props['aria-labelledby'] = opts.labelledby;
    }

    // owns: id of element(s) owned by this element (not a DOM child)
    if (opts.owns) {
      props['aria-owns'] = opts.owns;
    }

    // activedescendant: id of the active descendant when focus is delegated
    if (opts.activedescendant) {
      props['aria-activedescendant'] = opts.activedescendant;
    }

    // Return the accumulated aria-relation props
    return props;

  };


  // Position-in-set for list/option/step semantics.
  const position = function (opts) {

    // Validate: return empty object if no options provided
    if (!opts) {
      return {};
    }

    // Init: prepare the props accumulator
    const props = {};

    // posinset: position of the item within the set
    if (!Lib.Utils.isNullOrUndefined(opts.posinset)) {
      props['aria-posinset'] = opts.posinset;
    }

    // setsize: total number of items in the set
    if (!Lib.Utils.isNullOrUndefined(opts.setsize)) {
      props['aria-setsize'] = opts.setsize;
    }

    // level: hierarchy level for tree/nested list items
    if (!Lib.Utils.isNullOrUndefined(opts.level)) {
      props['aria-level'] = opts.level;
    }

    // Return the accumulated aria-position props
    return props;

  };


  // Monotonic id generator for labelledby/describedby wiring.
  // Callers hold the result in a ref so it is stable across re-renders.
  const id = function (prefix) {

    // Advance the monotonic counter
    idCounter += 1;

    // Return the prefixed id
    return (prefix || 'sl') + '-' + idCounter;

  };


  // Return the public a11y translator interface
  return {
    state: state,
    value: value,
    relation: relation,
    position: position,
    id: id
  };

};/////////////////////////// createInterface END //////////////////////////////
