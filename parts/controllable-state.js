// Info: Controlled/uncontrolled state hook.
//
// Every form component supports both controlled and uncontrolled
// use. This hook implements the pattern once. Controlled when `value` is
// not undefined, uncontrolled otherwise. Warns once through Lib.Debug.warn
// when a component switches modes between renders. Never warns on every
// render.


/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils, Debug, React
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Function} - useControllableState hook
*********************************************************************/
export default function (shared_libs, config, errors) { // eslint-disable-line no-unused-vars

  // Extract the libraries needed by this part
  const Lib = { Utils: shared_libs.Utils, Debug: shared_libs.Debug, React: shared_libs.React };

  // Return the hook factory for the parent module
  return createInterface(Lib);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Build the useControllableState hook.

@param {Object} Lib - The shared Lib container (requires React, Debug)

@return {Function} - useControllableState({ value, defaultValue, onChange })
                         -> [resolvedValue, setValue]
*********************************************************************/
const createInterface = function (Lib) {


  ///////////////////////////Public Functions START//////////////////////////////

  const useControllableState = function (options) {

    // Destructure controlled/uncontrolled state options
    const value = options.value;
    const defaultValue = options.defaultValue;
    const onChange = options.onChange;


    // Track whether we started in controlled mode
    const controlledRef = Lib.React.useRef(value !== undefined);


    // Internal state for uncontrolled mode
    const internalState = Lib.React.useState(defaultValue);
    const internalValue = internalState[0];
    const setInternalValue = internalState[1];


    // Warn once if the component switches between controlled and uncontrolled
    const warnedRef = Lib.React.useRef(false);

    // Detect mode switches between renders and warn once
    Lib.React.useEffect(function () {

      // Skip if we have already warned about a mode switch
      if (warnedRef.current) {
        // Exit early since the warning was already shown
        return;
      }

      // Determine the current controlled state for this render
      const isControlled = value !== undefined;

      // Warn once when the mode differs from the initial mode
      if (controlledRef.current !== isControlled) {
        warnedRef.current = true;
        Lib.Debug.warn(
          'useControllableState: component switched from ' +
          (controlledRef.current ? 'controlled' : 'uncontrolled') +
          ' to ' + (isControlled ? 'controlled' : 'uncontrolled') +
          ' mode. This is likely a bug.'
        );
      }

    }, [value]);


    // The resolved value: external when controlled, internal when not
    const resolvedValue = value !== undefined ? value : internalValue;


    // Setter: calls onChange for controlled, updates internal for uncontrolled
    const setValue = Lib.React.useCallback(function (nextValue) {

      // Allow functional updates: setValue(prev => prev + 1)
      let actualNext = nextValue;

      // Branch on controlled vs uncontrolled to route the update
      if (value !== undefined) {
        // Controlled mode: delegate to onChange
        if (Lib.Utils.isFunction(onChange)) {
          onChange(actualNext);
        }
      } else {
        // Uncontrolled mode: update internal state and call onChange
        if (Lib.Utils.isFunction(actualNext)) {
          actualNext = actualNext(internalValue);
        }

        // Commit the new value to internal state
        setInternalValue(actualNext);

        // Notify the listener of the uncontrolled state change
        if (Lib.Utils.isFunction(onChange)) {
          onChange(actualNext);
        }
      }

    }, [value, onChange, internalValue]);


    // Return the resolved value and setter as a tuple
    return [resolvedValue, setValue];

  };


  // Expose the hook as the module's interface
  return useControllableState;

};/////////////////////////// createInterface END //////////////////////////////
