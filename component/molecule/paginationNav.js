// Info: PaginationNav molecule [S2 interactive]. A page navigation control
// with role="group" that renders page number buttons for pagination. Uses
// A11y for aria-current on the active page, and PressKeys for
// keyboard activation on each page button.
//   currentPage -> number (the active page, 1-based)
//   totalPages  -> number (total number of pages)
//   onChange    -> function (called with selected page number)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the PaginationNav molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The PaginationNav component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const PaginationNav = function PaginationNav (props) {


    const {
      currentPage, totalPages, onChange, style,
      ...rest
    } = props;

    const React = Lib.React;

    const current = Lib.Utils.isNumber(currentPage) ? currentPage : 1;
    const total = Lib.Utils.isNumber(totalPages) ? totalPages : 1;

    // Build the list of page numbers to display
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }

    // Render a single page button
    const renderPageButton = function (pageNum) {

      const isActive = pageNum === current;

      const ariaProps = Parts.A11y.state({
        current: isActive ? 'page' : undefined
      });

      const pressKeysProps = Parts.PressKeys({
        role: 'button',
        onActivate: function () {
          if (Lib.Utils.isFunction(onChange)) {
            onChange(pageNum);
          }
        },
        disabled: false
      });

      return React.createElement(
        Pressable,
        Object.assign({
          key: 'page-' + pageNum,
          onPress: function () {
            if (Lib.Utils.isFunction(onChange)) {
              onChange(pageNum);
            }
          },
          accessibilityRole: 'button',
          accessibilityLabel: 'Page ' + pageNum,
          style: [
            Style.utilities['br_radius_04'],
            {
              minWidth: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 2,
              backgroundColor: isActive
                ? Style.utilities['background_interactive'].backgroundColor
                : 'transparent'
            }
          ]
        }, ariaProps, pressKeysProps),
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: isActive ? 'text_on_color' : 'text_secondary'
        }, String(pageNum))
      );
    };

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'group',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          style
        ]
      }, rest),
      pages.map(renderPageButton)
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _PaginationNav = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return PaginationNav;

}/////////////////////////// Component Factory END /////////////////////////////
