// Info: Token contract computation for rnw-components.
//
// Computes the required and supported token lists from the Themer contract.
// Because the contract is injected from the engine, this is a function that
// takes the contract and returns the two lists. Called once in createSystem.
//
// Class I data module. Pure function, no side effects.


/********************************************************************
Build the required and supported token lists from the Themer contract.

@param {Object} contract - The Themer contract from Themer.getContract()

@return {Object} - { REQUIRED_TOKENS: String[], SUPPORTED_TOKENS: String[] }
*********************************************************************/
export default function buildTokenContract (contract) {

  // The supported set is every token name the contract defines
  const SUPPORTED_TOKENS = Object.keys(contract.tokens);

  // The required set is every token that is not marked optional.
  // The contract marks optional tokens with `optional: true` in their
  // token definition. A token without `optional` is required.
  const REQUIRED_TOKENS = SUPPORTED_TOKENS.filter(function (name) {
    const def = contract.tokens[name];
    return !def || !def.optional;
  });

  return {
    REQUIRED_TOKENS: REQUIRED_TOKENS,
    SUPPORTED_TOKENS: SUPPORTED_TOKENS
  };

}
