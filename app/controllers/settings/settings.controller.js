/* eslint-disable no-console */
const { menu } = require('../../config/menu-builder');

const { userSessionData } = require('../../state/user.state');

const { updateUser } = require('../users/user.controller');

module.exports = async function ManualController(req, res) {
  try {
    /** ---------------------------------------------------
     *   ──────┤ Entry ├──────    **********************
     ---------------------------------------------------* */
    menu.state('entry-point-to-settings-controller', {
      run: () => {
        menu.con(
          'Manage your information for quicker service: \n'
            + '\n1. Set default language - BETA'
            + '\n2. Set emergency contact'
            + '\n3. Show default items',
        );
      },
      next: {
        1: 'set-default-language',
        2: 'set-emergency-contact',
        3: 'show-default-items',
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Set default language ├──────    ***********
     ---------------------------------------------------* */
    menu.state('set-default-language', {
      run: () => {
        menu.con(
          'Choose a language from our available options:'
          + '\n1. English'
          + '\n2. French'
          + '\n3. Swahili',
        );
      },

      next: {
        1: 'save-language',
        2: 'save-language',
        3: 'save-language',
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Set emergency contact ├──────    **********
     ---------------------------------------------------* */
    menu.state('set-emergency-contact', {
      run: () => {
        menu.con('Please enter their phone number in this format: (254...)');
      },

      next: {
        '*': 'save-emergency-contact',
      },
    });

    /** ---------------------------------------------------
        ──────┤ View default items ├──────
     ---------------------------------------------------* */
    menu.state('show-default-items', {
      run: () => {
        menu.end(`Here are your saved preferences. \n
        Language: ${userSessionData.language}
        Emergency contact: ${userSessionData.emergencyContact}
        `);
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Save language ├──────    **********
     ---------------------------------------------------* */
    menu.state('save-language', {
      run: () => {
        const getLanguageWording = (selectedNumber) => {
          // Create a switch case or an if-else block to handle different numbers
          switch (selectedNumber) {
            case 1:
              return 'English';
            case 2:
              return 'French';
            case 3:
              return 'Swahili';
            default:
              return 'Unknown Language';
          }
        };

        userSessionData.language = getLanguageWording(menu.val);

        updateUser(menu.args.phoneNumber.replace(/\+/g, ''), {
          name: userSessionData.name,
          phoneNumber: userSessionData.phoneNumber,
          emergencyContact: userSessionData.emergencyContact,
          language: userSessionData.language,
        });

        menu.end(`Your new preferred language is ${userSessionData.language}`);
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Save emergency contact ├──────    **********
     ---------------------------------------------------* */
    menu.state('save-emergency-contact', {
      run: () => {
        userSessionData.emergencyContact = menu.val;

        updateUser(menu.args.phoneNumber.replace(/\+/g, ''), {
          name: userSessionData.name,
          phoneNumber: userSessionData.phoneNumber,
          emergencyContact: userSessionData.emergencyContact,
          language: userSessionData.language,
        });

        menu.end(`Your new emergency contact is: ${userSessionData.emergencyContact}`);
      },
    });

    menu.run(req.body, (ussdResult) => {
      res.send(ussdResult);
    });
  } catch (error) {
    console.error(error);
  }
};
