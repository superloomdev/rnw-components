// Info: TreeNode molecule [S2 interactive]. A tree node with role="treeitem"
// that can expand/collapse to reveal child nodes. Uses A11y for
// aria-expanded, aria-selected, and aria-level, and PressKeys for
// keyboard activation. Can optionally consume TreeView context for selection
// coordination.
//   label       -> string (node label)
//   children    -> child TreeNode elements (optional)
//   expanded    -> boolean, whether the node is expanded
//   onToggle    -> function (called when expand/collapse is pressed)
//   selected    -> boolean, whether this node is selected
//   level       -> number (depth in the tree, 1-based)
//   style       -> custom style overrides


// Imports
import getSharedContext from '../context/sharedContext.js';
import { View as RNView, Pressable } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the TreeNode molecule.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The TreeNode component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////


  // Get the shared TreeView context (cached per Lib instance)
  const treeViewCtx = getSharedContext(Lib, 'TreeView');

  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const TreeNode = function TreeNode (props) {


    const {
      label, children, expanded, onToggle, selected, level, style,
      ...rest
    } = props;

    const React = Lib.React;

    // Read TreeView context if available
    const ctxValue = React.useContext(treeViewCtx.Context);

    const isExpanded = !!expanded;
    const isSelected = ctxValue ? (ctxValue.selectedKey === ctxValue.nodeKey) : !!selected;
    const nodeLevel = Lib.Utils.isNumber(level) ? level : 1;
    const hasChildren = React.Children.count(children) > 0;

    // Handle selection
    const handleSelect = function () {
      if (Lib.Utils.isFunction(onToggle) && hasChildren) {
        onToggle(!isExpanded);
      }
      if (ctxValue && Lib.Utils.isFunction(ctxValue.onSelect)) {
        ctxValue.onSelect(ctxValue.nodeKey);
      }
    };

    // Build aria state props through the a11y translator
    const ariaProps = Parts.A11y.state({
      expanded: hasChildren ? isExpanded : undefined,
      selected: isSelected
    });

    // Build position props for tree level
    const positionProps = Parts.A11y.position({
      level: nodeLevel
    });

    // Build keyboard activation props
    const pressKeysProps = Parts.PressKeys({
      role: 'treeitem',
      onActivate: handleSelect,
      disabled: false
    });

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'treeitem',
        style: [style]
      }, ariaProps, positionProps, pressKeysProps, rest),
      // Node row
      React.createElement(
        Pressable,
        {
          onPress: handleSelect,
          accessibilityRole: 'button',
          accessibilityLabel: label,
          style: [
            Style.utilities['flex_row'],
            Style.utilities['align_center'],
            Style.utilities['p_h_spacing_03'],
            Style.utilities['p_v_spacing_01'],
            {
              marginLeft: (nodeLevel - 1) * 20,
              backgroundColor: isSelected
                ? Style.utilities['background_background'].backgroundColor
                : 'transparent'
            }
          ]
        },
        // Expand/collapse indicator (only if has children)
        hasChildren
          ? React.createElement(Registry.Text, {
            typeSet: 'caption01',
            color: 'text_secondary',
            style: Style.utilities['m_r_spacing_01']
          }, isExpanded ? '\u25BC' : '\u25B6')
          : React.createElement(RNView, {
            style: { width: 12, marginRight: 4 }
          }),
        // Label
        React.createElement(Registry.Text, {
          typeSet: 'label01',
          color: isSelected ? 'interactive' : 'text_primary',
          weight: isSelected ? 'medium' : 'regular'
        }, label)
      ),
      // Child nodes (only when expanded)
      isExpanded && hasChildren
        ? React.createElement(RNView, null, children)
        : null
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _TreeNode = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return TreeNode;

}/////////////////////////// Component Factory END /////////////////////////////
