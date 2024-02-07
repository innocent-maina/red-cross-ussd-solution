/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const { sms } = require('../../config/africastalking');

const { menu } = require('../../config/menu-builder');

const {
  fetchPlaceId,
  fetchPlaceDetails,
  fetchDirections,
} = require('../../utils/maps_query');

const { fetchMedicineSearch } = require('../../utils/controller_queries');

const { formatTextDirections } = require('../../utils/formatted_texts');

const { getSelectedText } = require('../../utils/dynamic_response');

let medicineToSearch = '';

let medicineResults = '';

let userLocation = '';

let origin = '';

let responseMessage = '';

let destination = '';

const clearState = () => {
  origin = '';
  destination = '';
  responseMessage = '';
  medicineToSearch = '';
  userLocation = '';
  medicineResults = '';
};

module.exports = async function ManualController(req, res) {
  try {
    /** ---------------------------------------------------
     *   ──────┤ Select medicine ├──────    ***********
     ---------------------------------------------------* */
    menu.state('entry-point-to-medicine-search-controller', {
      run: () => {
        clearState();
        menu.con('Search for medicine here');
      },
      next: {
        '*': 'specify-user-location',
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Specify user location ├──────    ***********
     ---------------------------------------------------* */
    menu.state('specify-user-location', {
      run: async () => {
        medicineToSearch = menu.val;

        menu.con('Please enter your current location for accurate results (city, town or area):');
      },

      next: {
        '*': 'medicine-search-results',
      },
    });

    /** ---------------------------------------------------
     *   ──────┤ Specialist location display ├──────    ***********
     ---------------------------------------------------* */
    menu.state('medicine-search-results', {
      run: async () => {
        userLocation = menu.val === '1' ? 'Juja' : menu.val;

        origin = userLocation;

        medicineResults = await fetchMedicineSearch(
          medicineToSearch,
          userLocation,
        );

        for (let i = 0; i < 5 && i < medicineResults.length; i++) {
          responseMessage += `${i + 1}. ${medicineResults[i].name}\n`;
        }

        userLocation = '';

        medicineResults = '';

        menu.con(`${medicineToSearch} can be found in the following places\n ${responseMessage}`);
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
        ${facilityDetails.name}.
        Address: ${facilityDetails.formatted_address}
        Contact: ${facilityDetails.phoneNumber}
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

        medicineResults = '';

        try {
          await sms.send({
            to: menu.args.phoneNumber,
            message: `${formattedMoreDetails}\n\n${formattedDirections}`,
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
