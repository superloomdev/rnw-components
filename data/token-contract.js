// Info: Token contract computation for rnw-components.
//
// Computes the required and supported token lists from the Themer contract.
// Because the contract is injected from the engine, this is a function that
// takes the contract and returns the two lists. Called once in createSystem.
//
// Class I data module. Pure function, no side effects.


/********************************************************************
Build the required and supported token lists from the Themer contract.

The required set follows D8: every value-tier token except color.tag_* and
color.ai_*, plus every structure-tier token. The group tier is read from
contract.groups[<group>].tier.

@param {Object} contract - The Themer contract from Themer.getContract()

@return {Object} - { REQUIRED_TOKENS: String[], SUPPORTED_TOKENS: String[] }
*********************************************************************/
export default function buildTokenContract (contract) {

  // The supported set is every token name the contract defines
  const SUPPORTED_TOKENS = Object.keys(contract.tokens);

  // The required set follows D8: every value-tier token except
  // color.tag_* and color.ai_*, plus every structure-tier token.
  const REQUIRED_TOKENS = SUPPORTED_TOKENS.filter(function (name) {
    const def = contract.tokens[name];
    if (!def || !def.group) {
      return false;
    }
    const groupDef = contract.groups[def.group];
    if (!groupDef || !groupDef.tier) {
      return false;
    }
    if (groupDef.tier === 'structure') {
      return true;
    }
    if (groupDef.tier === 'value') {
      // Exclude color.tag_* and color.ai_* from the required set
      if (name.indexOf('color.tag_') === 0 || name.indexOf('color.ai_') === 0) {
        return false;
      }
      return true;
    }
    return false;
  });

  return {
    REQUIRED_TOKENS: REQUIRED_TOKENS,
    SUPPORTED_TOKENS: SUPPORTED_TOKENS
  };

}
