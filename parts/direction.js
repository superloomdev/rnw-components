// Info: Text direction resolution for rnw-components.
//
// Provides a single RTL boolean derived from the platform. On web it reads
// a locale config flag; on native it reads I18nManager.isRTL. Components
// that genuinely need direction (Text on iOS) call Parts.Direction.isRtl()
// instead of receiving it through a HOC prop.
//
// Loader pattern: FACTORY part. Uniform parts signature.
import { I18nManager, Platform } from 'react-native';


/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Factory part loader. Uniform parts signature.

@param {Object} shared_libs - Lib container with Utils, Debug, React
@param {Object} config - Merged config from the parent module
@param {Object} errors - Frozen error catalog from the parent module

@return {Object} - Public Direction interface
*********************************************************************/
export default function (shared_libs, config, errors) { // eslint-disable-line no-unused-vars

  // Resolve direction once per build.
  // Web: check config for locale IS_RTL flag (if available)
  // Native: read I18nManager.isRTL
  let rtlActive = false;

  if (Platform.OS === 'web') {
    if (config && config.locale && config.locale.IS_RTL) {
      rtlActive = true;
    }
  } else {
    rtlActive = I18nManager.isRTL;
  }

  // Return the Direction interface built from the resolved RTL state
  return createInterface(rtlActive);

}/////////////////////////// Module-Loader END /////////////////////////////////



/////////////////////////// createInterface START //////////////////////////////

/********************************************************************
Build the Direction interface over the resolved RTL state.

@param {Boolean} rtlActive - Whether RTL layout is active

@return {Object} - Public Direction interface
*********************************************************************/
const createInterface = function (rtlActive) {


  ///////////////////////////Public Functions START//////////////////////////////

  const Direction = {
    // Public Direction interface: RTL state accessor


    /********************************************************************
    Returns true when RTL layout is active.

    @return {Boolean} - True for RTL, false for LTR
    *********************************************************************/
    isRtl: function () {

      // Return the resolved RTL state
      return rtlActive;

    }


  };///////////////////////////Public Functions END//////////////////////////////


  // Return the public Direction interface
  return Direction;

};/////////////////////////// createInterface END //////////////////////////////
