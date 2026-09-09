// Info: Pagination composite [S4 compound]. A pagination navigation container
// with role="navigation" that renders page selector and prev/next buttons.
// Uses A11y, PressKeys. Composes PaginationNav molecule and
// Button atom.
//   page        -> number (current page, 1-based)
//   totalPage   -> number (total number of pages)
//   onChange    -> function (called with new page number)
//   pageSize    -> number (items per page, optional)
//   style       -> custom style overrides


// Imports
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the Pagination composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The Pagination component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const Pagination = function Pagination (props) {


    const {
      page, totalPage, onChange, pageSize, style, // eslint-disable-line no-unused-vars
      ...rest
    } = props;

    const React = Lib.React;

    const currentPage = Lib.Utils.isNumber(page) ? page : 1;
    const totalPages = Lib.Utils.isNumber(totalPage) ? totalPage : 1;

    // Handle page change
    const handlePageChange = function (newPage) {
      if (Lib.Utils.isFunction(onChange)) {
        onChange(newPage);
      }
    };

    // Prev button
    const prevDisabled = currentPage <= 1;

    const prevAriaProps = Parts.A11y.state({
      disabled: prevDisabled
    });

    const prevPressKeys = Parts.PressKeys({
      role: 'button',
      onActivate: function () {
        if (!prevDisabled) {
          handlePageChange(currentPage - 1);
        }
      },
      disabled: prevDisabled
    });

    // Next button
    const nextDisabled = currentPage >= totalPages;

    const nextAriaProps = Parts.A11y.state({
      disabled: nextDisabled
    });

    const nextPressKeys = Parts.PressKeys({
      role: 'button',
      onActivate: function () {
        if (!nextDisabled) {
          handlePageChange(currentPage + 1);
        }
      },
      disabled: nextDisabled
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'navigation',
        style: [
          Style.utilities['flex_row'],
          Style.utilities['align_center'],
          style
        ]
      }, rest),
      // Previous button
      React.createElement(
        Pressable,
        Object.assign({
          onPress: prevDisabled ? null : function () {
            handlePageChange(currentPage - 1);
          },
          disabled: prevDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: 'Previous page',
          style: [
            Style.utilities['br_radius_04'],
            Style.utilities['p_h_spacing_03'],
            Style.utilities['p_v_spacing_03'],
            Style.utilities['m_r_spacing_03'],
            {
              backgroundColor: prevDisabled
                ? Style.utilities['background_layer_01'].backgroundColor
                : 'transparent'
            }
          ]
        }, prevAriaProps, prevPressKeys),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: prevDisabled ? 'text_disabled' : 'text_primary'
        }, '\u2039')
      ),
      // Page selector
      React.createElement(Registry.PaginationNav, {
        currentPage: currentPage,
        totalPages: totalPages,
        onChange: handlePageChange
      }),
      // Next button
      React.createElement(
        Pressable,
        Object.assign({
          onPress: nextDisabled ? null : function () {
            handlePageChange(currentPage + 1);
          },
          disabled: nextDisabled,
          accessibilityRole: 'button',
          accessibilityLabel: 'Next page',
          style: [
            Style.utilities['br_radius_04'],
            Style.utilities['p_h_spacing_03'],
            Style.utilities['p_v_spacing_03'],
            Style.utilities['m_l_spacing_03'],
            {
              backgroundColor: nextDisabled
                ? Style.utilities['background_layer_01'].backgroundColor
                : 'transparent'
            }
          ]
        }, nextAriaProps, nextPressKeys),
        React.createElement(Registry.Text, {
          typeSet: 'body01',
          color: nextDisabled ? 'text_disabled' : 'text_primary'
        }, '\u203A')
      )
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _Pagination = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return Pagination;

}/////////////////////////// Component Factory END /////////////////////////////
