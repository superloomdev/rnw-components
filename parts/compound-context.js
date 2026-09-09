// Info: Context factory for compound components.
//
// The upstream design system has 14 Context modules. A naive "render children in a View" port
// breaks the parent-child contract for Tabs, Accordion, RadioButtonGroup,
// Menu, TreeView, DataTable, ContentSwitcher, ComposedModal, Card, Layer,
// FluidForm.
//
// Contexts are created once per loader call, in createInterface, and
// stored on state.contexts. They are NOT created inside build. If they
// were created inside build, a rebuild would produce a new Context
// identity and every mounted Consumer would fall back to its default
// value, silently breaking every compound component on a theme change.
//
// useContext throws a TypeError naming the required parent when called
// outside its Provider. That turns "AccordionItem rendered outside
// Accordion" from a blank render into a clear boot-time error.
//
// Do not port the upstream React.Children.map plus cloneElement pattern.
// It inspects child.type and breaks the moment a child is wrapped in
// React.memo or forwardRef, which our HOC does. Use Context for every
// parent-child coordination.


/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils, Debug, React
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Function} - (displayName) -> { Provider, useContext, Context }
*********************************************************************/
export default function (shared_libs, config, errors) { // eslint-disable-line no-unused-vars

  // Extract the shared libraries needed by this factory
  const Lib = { Utils: shared_libs.Utils, Debug: shared_libs.Debug, React: shared_libs.React };

  // Return the context factory so callers can create compound context pairs
  return createInterface(Lib);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Create a compound context pair: a Provider and a useContext hook.

@param {Object} Lib - The shared Lib container (requires React)

@return {Function} - (displayName) -> { Provider, useContext, Context }
*********************************************************************/
const createInterface = function (Lib) {


  ///////////////////////////Public Functions START//////////////////////////////

  /********************************************************************
  Return a context factory bound to the given display name.

  @param {String} displayName - Human-readable name for error messages

  @return {Object} - { Provider, useContext, Context }
  *********************************************************************/
  const makeCompoundContext = function (displayName) {

    // Create a React context with the given display name for compound components
    const React = Lib.React;
    const createContext = Lib.React.createContext;


    // The context holds the compound state; default is undefined so
    // useContext can detect "outside provider" and throw
    const Context = createContext(undefined);


    // Set displayName for React DevTools
    Context.displayName = displayName + 'Context';


    // Hook that throws when used outside its Provider
    const useContext = function () {

      // Read the current context value from the nearest Provider
      const value = React.useContext(Context);

      // undefined means no Provider is mounted above this consumer
      if (value === undefined) {
        throw new TypeError(
          displayName + ': this component must be rendered inside a ' +
          displayName + ' Provider. Rendering it standalone is not supported.'
        );
      }

      // Return the resolved context value to the calling component
      return value;

    };


    // Return the Provider, useContext hook, and Context object
    return {
      Provider: Context.Provider,
      useContext: useContext,
      Context: Context
    };

  };


  // Return the context factory for compound components
  return makeCompoundContext;

};/////////////////////////// createInterface END //////////////////////////////
