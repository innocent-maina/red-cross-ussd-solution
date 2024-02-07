/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const { sms } = require('../../config/africastalking');

const { menu } = require('../../config/menu-builder');

const {
  fetchPlaceDetails,
  fetchDirections,
  fetchPlaceId,
} = require('../../utils/maps_query');

const { fetchEmergencyHospitals } = require('../../utils/controller_queries');

const { formatTextDirections } = require('../../utils/formatted_texts');

const { getSelectedText } = require('../../utils/dynamic_response');

let origin = '';

let destination = '';

let responseMessage = '';

let emergencyHospitals = '';

const clearState = () => {
  origin = '';
  destination = '';
  responseMessage = '';
  emergencyHospitals = '';
};

module.exports = async function ManualController(req, res) {
  try {
    /** ---------------------------------------------------
     *   ──────┤ Entry ├──────    ***********
     ---------------------------------------------------* */
    menu.state('entry-point-to-emergency-controller', {
      run: () => {
        clearState();

        menu.con('Please enter your exact location for accurate results');
      },
      next: {
        '*': 'emergency-controller',
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Emergency display ├──────    ***********
     ---------------------------------------------------* */
    menu.state('emergency-controller', {
      run: async () => {
        let userLocation = menu.val === '1' ? 'Juja' : menu.val;

        origin = userLocation;

        emergencyHospitals = await fetchEmergencyHospitals(userLocation);

        for (let i = 0; i < 5 && i < emergencyHospitals.length; i++) {
          responseMessage += `${i + 1}. ${emergencyHospitals[i].name}\n`;
        }

        userLocation = '';

        emergencyHospitals = '';

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

        menu.end(`Contact: ${facilityDetails.phoneNumber} now to request an ambulance to your location.
        More details and directions will be sent to your phone number
        `);

        const formattedDirections = formatTextDirections(directions);

        console.log('formattedDirections', formattedDirections);

        const moreDetails = {};

        if (facilityDetails.mapPin !== undefined) {
          moreDetails.Location = facilityDetails.mapPin;
        }

        if (facilityDetails.phoneNumber !== undefined) {
          moreDetails.Phone = facilityDetails.phoneNumber;
        }

        const formattedMoreDetails = Object.entries(moreDetails)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

        try {
          await sms.send({
            to: menu.args.phoneNumber,
            message: `${formattedMoreDetails}\n\n${formattedDirections}`,
          });
        } catch (error) {
          console.error('Error in the try catch of sending message', error);
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
