/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const { menu } = require('../config/menu-builder');

const EmergencyResponseController = require('./emergency-response/emergency.controller');
const HealthCareFacilitiesController = require('./healthcare-facilities/facilities.controller');
const SpecializedCareFacilitiesController = require('./specialized-clinics/specialists.controller');
const MedicineSearchController = require('./medicine-search/medicine.controller');
const ReferralsController = require('./personalized-referrals/referrals.controller');
const SettingsController = require('./settings/settings.controller');

module.exports = async function AppController(req, res) {
  try {
    /** ------------------------------------------------------
     *  ---------------------------------------
     *  App entry point
     * ---------------------------------------
 ------------------------------------------------------* */
    menu.startState({
      run: async () => {
        try {
          /** ------------------------------------------------------
           *  ---------------------------------------
           *  First screen
           * ---------------------------------------
          ------------------------------------------------------* */
          menu.con('AfriCareLink helps you find healthcare services near you!\n'
              + '\n1. Emergency response'
              + '\n2. Healthcare Facility Locator'
              + '\n3. Specialized Clinics'
              + '\n4. Personalized Referrals'
              + '\n5. Medicine Search');
        } catch (error) {
          console.error(error);
        }
      },
      /** ------------------------------------------------------
     *  ---------------------------------------
     *  Entry points to other modules
     * ---------------------------------------
     ------------------------------------------------------* */
      next: {
        1: 'entry-point-to-emergency-controller',
        2: 'entry-point-to-healthcare-facilities-controller',
        3: 'entry-point-to-specialized-care-controller',
        4: 'entry-point-to-referrals-controller',
        5: 'entry-point-to-medicine-search-controller',
        6: 'entry-point-to-settings-controller',
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  Emergency response  controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-emergency-controller', {
      run() {
        EmergencyResponseController(req, res);
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  Healthcare facility locator controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-healthcare-facilities-controller', {
      run() {
        HealthCareFacilitiesController(req, res);
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  Specialized clinics controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-specialized-care-controller', {
      run() {
        SpecializedCareFacilitiesController(req, res);
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  Personalized referrals controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-referrals-controller', {
      run() {
        ReferralsController(req, res);
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  Medicine search controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-medicine-search-controller', {
      run() {
        MedicineSearchController(req, res);
      },
    });

    /** ------------------------------------------------------
     *  ---------------------------------------
     *  Settings controller
     * ---------------------------------------
     ------------------------------------------------------* */
    menu.state('entry-point-to-settings-controller', {
      run() {
        SettingsController(req, res);
      },
    });

    menu.run(req.body, (ussdResult) => {
      res.send(ussdResult);
    });
  } catch (error) {
    console.error(error);
  }
};
