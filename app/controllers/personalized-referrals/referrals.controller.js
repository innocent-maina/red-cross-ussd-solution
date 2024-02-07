/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const { sms } = require('../../config/africastalking');

const { menu } = require('../../config/menu-builder');

const {
  fetchPlaceDetails, fetchDirections, fetchPlaceId,
} = require('../../utils/maps_query');

const { fetchPossibleReferrals } = require('../../utils/controller_queries');

const { formatTextDirections } = require('../../utils/formatted_texts');

const { getSelectedText } = require('../../utils/dynamic_response');

let selectedOption = '';

let userLocation = '';

let origin = '';

let responseMessage = '';

let destination = '';

let specialistResults = '';

const clearState = () => {
  origin = '';
  destination = '';
  responseMessage = '';
  selectedOption = '';
  userLocation = '';
  specialistResults = '';
};

module.exports = async function ManualController(req, res) {
  try {
    /** ---------------------------------------------------
     *   ──────┤ Entry -- select care to search referral for ├──────    ***********
     ---------------------------------------------------* */
    menu.state('entry-point-to-referrals-controller', {
      run: () => {
        clearState();
        menu.con(`Select referral option:
          1. Surgeon
          2. Pediatrician
          3. Cardiologist
          4. Emergency Medicine Physician
          5. Other (specify)
          `);
      },
      next: {
        '*': 'specify-user-controller',
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Specify location ├──────    ***********
     ---------------------------------------------------* */
    menu.state('specify-user-controller', {
      run: async () => {
        selectedOption = menu.val === '1' || menu.val === '2' || menu.val === '3' || menu.val === '4' ? 'specified' : menu.val;

        if (selectedOption === 'specified') {
          switch (menu.val) {
            case '1':
              selectedOption = 'Surgeon';
              break;
            case '2':
              selectedOption = 'Pediatrician';
              break;
            case '3':
              selectedOption = 'Cardiologist';
              break;
            case '4':
              selectedOption = 'Emergency Medicine Physician';
              break;
            default:
              selectedOption = menu.val && menu.val.value;
              break;
          }
        }
        menu.con('Please enter your current location for accurate results (city, town or area):');
      },

      next: {
        '*': 'referral-results',
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Possible facilities display ├──────    ***********
     ---------------------------------------------------* */
    menu.state('referral-results', {
      run: async () => {
        userLocation = menu.val === '1' ? 'Juja' : menu.val;

        origin = userLocation;

        specialistResults = await fetchPossibleReferrals(selectedOption, userLocation);

        for (let i = 0; i < 5 && i < specialistResults.length; i++) {
          responseMessage += `${i + 1}. ${specialistResults[i].name}\n`;
        }

        userLocation = '';

        specialistResults = '';

        menu.con(responseMessage);
      },
      next: {
        '*': 'final-output',
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Return output ├──────    ***********
     ---------------------------------------------------* */
    menu.state('final-output', {
      run: async () => {
        destination = getSelectedText(responseMessage, menu.val);

        const destinationID = await fetchPlaceId(destination);

        const originID = await fetchPlaceId(origin);

        const facilityDetails = await fetchPlaceDetails(destinationID);

        const directions = await fetchDirections(originID, destinationID);

        menu.end(`
        ${facilityDetails.name}.\n
        Address: ${facilityDetails.formatted_address}
        Contact: ${facilityDetails.phoneNumber} \n
        More details and directions will be sent to your phone number
        `);

        const formattedDirections = formatTextDirections(directions);

        const moreDetails = {};

        if (facilityDetails.website !== undefined) {
          moreDetails.Website = facilityDetails.website;
        }

        if (facilityDetails.mapPin !== undefined) {
          moreDetails.Location = facilityDetails.mapPin;
        }

        if (facilityDetails.phoneNumber !== undefined) {
          moreDetails.Phone = facilityDetails.phoneNumber;
        }

        if (facilityDetails.rating !== undefined) {
          moreDetails.Rating = facilityDetails.rating;
        }

        const formattedMoreDetails = Object.entries(moreDetails)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

        try {
          await sms.send({
            to: menu.args.phoneNumber,
            message: `${formattedMoreDetails} \n\n ${formattedDirections}`,
          });
        } catch (error) {
          console.error(error);
        }

        clearState();
      },
    });

    menu.run(req.body, (ussdResult) => {
      res.send(ussdResult);
    });
  } catch (error) {
    console.error(error);
  }
};
