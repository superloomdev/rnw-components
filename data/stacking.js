// Info: Frozen stacking order table for the component system.
//
// Stacking order is component anatomy, not a theme token (Section 14.4 rule 3).
// Every zIndex literal in component/ reads from this table.
export default Object.freeze({
  hidden: -1,
  overflow_hidden: -1,
  header: 8000,
  footer: 8000,
  overlay: 8000,
  modal: 9000,
  dropdown: 9100,
  floating: 10000
});
