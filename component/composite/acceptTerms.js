// Info: AcceptTerms composite [S4 compound]. A legal terms acceptance flow
// with a DocumentViewer, a BottomToolbar (agree/disagree), and a
// confirmation Modal when the user tries to disagree. Uses role="main"
// for screen reader semantics.
//   title           -> document title
//   source          -> URL or HTML content for DocumentViewer
//   resultsCallback -> called with true (agree) or false (disagree)
//   textStrings     -> { disagree, agree, modalTitle, modalBody,
//                        modalSecondaryAction, modalPrimaryAction }
//   style           -> custom style overrides


// Imports
import { View as RNView } from 'react-native';


/////////////////////////// Component Factory START ////////////////////////////

/********************************************************************
Build the AcceptTerms composite.

@param {Object} Lib      - { Utils, Debug, React }
@param {Object} CONFIG   - Package configuration
@param {Object} ERRORS   - Frozen error catalog
@param {Object} Parts    - Mechanisms: { A11y, PressKeys, ControllableState, Units, Overlay, AnchoredPosition }
@param {Object} Registry - Component registry (for atom composition)
@param {Object} Style   - { utilities, tokens, breakpoint }

@return {Function} - The AcceptTerms component
*********************************************************************/
export default function (Lib, CONFIG, ERRORS, Parts, Registry, Style) {

  /////////////////////////// Static Constants START ////////////////////////////
  // None.
  /////////////////////////// Static Constants END //////////////////////////////



  /////////////////////////// Public Functions START ////////////////////////////
  const AcceptTerms = function AcceptTerms (props) {


    // Destructure props
    const {
      title, source, resultsCallback, textStrings,
      style,
      ...rest
    } = props;

    const React = Lib.React;

    // Track whether the disagree confirmation modal is open
    const showModalState = React.useState(false);
    const showModal = showModalState[0];
    const setShowModal = showModalState[1];

    // Agree handler
    const handleAgree = function () {
      if (Lib.Utils.isFunction(resultsCallback)) {
        resultsCallback(true);
      }
    };

    // Disagree handler - opens confirmation modal
    const handleDisagree = function () {
      setShowModal(true);
    };

    // Modal: user confirmed they want to disagree
    const handleConfirmDisagree = function () {
      setShowModal(false);
      if (Lib.Utils.isFunction(resultsCallback)) {
        resultsCallback(false);
      }
    };

    // Modal: user chose to continue reading terms
    const handleContinue = function () {
      setShowModal(false);
    };

    // Default text strings
    const strings = textStrings || {};
    const disagreeText = strings.disagree || 'Disagree';
    const agreeText = strings.agree || 'Agree';
    const modalTitle = strings.modalTitle || 'Are you sure?';
    const modalBody = strings.modalBody || 'You must agree to continue.';
    const modalSecondary = strings.modalSecondaryAction || disagreeText;
    const modalPrimary = strings.modalPrimaryAction || 'Continue';

    // Build the toolbar items
    const toolbarItems = [
      { text: disagreeText, onPress: handleDisagree },
      { text: agreeText, onPress: handleAgree }
    ];

    // Build the modal
    const modal = showModal ? React.createElement(
      Registry.Modal,
      { open: true, onRequestClose: handleContinue },
      React.createElement(Registry.ModalHeader, { title: modalTitle }),
      React.createElement(Registry.ModalBody, null,
        React.createElement(Registry.Text, null, modalBody)
      ),
      React.createElement(Registry.ModalFooter, null,
        React.createElement(Registry.Button, { kind: 'ghost', children: modalSecondary, onPress: handleConfirmDisagree }),
        React.createElement(Registry.Button, { kind: 'primary', children: modalPrimary, onPress: handleContinue })
      )
    ) : null;

    return React.createElement(
      RNView,
      Object.assign({
        accessibilityRole: 'main',
        style: [
          Style.utilities['flex_1'],
          Style.utilities['flex_col'],
          style
        ]
      }, rest),
      React.createElement(Registry.Text, { style: { fontSize: 18, fontWeight: 'bold' } }, title || ''),
      React.createElement(Registry.DocumentViewer, { source: source }),
      React.createElement(Registry.BottomToolbar, { items: toolbarItems }),
      modal
    );
  };////////////////////////// Public Functions END ////////////////////////////



  ////////////////////////// Private Functions START ///////////////////////////
  const _AcceptTerms = { // eslint-disable-line no-unused-vars
    // None.
  };////////////////////////// Private Functions END ///////////////////////////



  // Return the public component
  return AcceptTerms;

}/////////////////////////// Component Factory END /////////////////////////////
