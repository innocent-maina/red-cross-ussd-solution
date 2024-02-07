/* eslint-disable no-console */
const axios = require('axios');

const MAP_API = 'https://maps.googleapis.com/maps/api/place/textsearch';

/**
 * Retrieves the placeId of a specified place using a text search.
 *
 * @param {string} placeName - The name of the place to search for.
 *
 * @returns {Promise<string>} - A Promise that resolves with the placeId if found,
 * or a string indicating that the place ID was not found.
 *
 * @throws {Error} - Throws an error if there is a problem fetching the place ID.
 */
async function fetchPlaceId(placeName) {
  try {
    const encodedPlaceName = encodeURIComponent(placeName);
    const url = `${MAP_API}/json?query=${encodedPlaceName}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    if (
      response.data
      && response.data.results
      && response.data.results.length > 0
    ) {
      return response.data.results[0].place_id;
    }
    return 'Place ID not found';
  } catch (error) {
    console.error('Error fetching place ID.', error);
    throw error;
  }
}

/**
 * Retrieves detailed information about a place based on its placeId.
 *
 * @param {string} placeId - The unique identifier of the place.
 *
 * @returns {Promise<object>|string} - A Promise that resolves
 * with an object containing formatted place details, or a string
 * indicating no results were found.
 *
 * @throws {Error} - Throws an error if there is a problem fetching
 * the place details.
 */
async function fetchPlaceDetails(placeId) {
  try {
    // Construct the URL using placeId
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);

    if (
      response.data
      && response.data.result
    ) {
      const { result } = response.data;
      return {
        formatted_address: result.formatted_address,
        name: result.name,
        rating: result.rating,
        business_status: result.business_status,
        geometry: result.geometry,
        phoneNumber: result.formatted_phone_number,
        offersDelivery: result.delivery,
        isWheelChairAccessible: result.wheelchair_accessible_entrance,
        website: result.website,
        mapsPin: result.url,
      }; // Return the details of the place
    }

    return 'No place details available';
  } catch (error) {
    console.error('Error fetching place details.', error);
    throw error;
  }
}

/** ------------------------------------------------------
 *  Params
 * ************* placeName: string
 * *************  location: string
 * ---------------------------------------
 * This function receives a placename and location and returns
 *  formatted results     *
 * ---------------------------------------
 ------------------------------------------------------* */
const generateSMSFromDirections = (response) => {
  try {
    console.log('called generateSMSFromDirections', response);
    if (response.status === 'OK' && response.routes.length !== 0) {
      console.log('response is valid');
      const route = response.routes[0];
      // const summary = route.summary || '';
      const duration = route.legs[0]?.duration?.text || '';
      const distance = route.legs[0]?.distance?.text || '';
      const startLocation = route.legs[0]?.start_address || '';
      const endLocation = route.legs[0]?.end_address || '';

      let directions = `Directions from ${startLocation} to ${endLocation}:`;
      directions += `Duration: ${duration}\nDistance: ${distance}\nStart: ${startLocation}\nEnd: ${endLocation}\n\n`;

      if (route.legs[0]?.steps) {
        directions += `${route.legs[0].steps
          .map((step) => step.html_instructions.replace(/<[^>]*>/g, ''))
          .join('. ')}.`;
      }
      return directions;
    }

    return 'Unable to find directions';
  } catch (error) {
    console.error('Error in generateSMSFromDirections', error);
  }
};

/**
 * Retrieves directions from an origin to a destination specified by placeId.
 *
 * @param {string} origin - The starting point for the directions.
 * @param {string} destinationPlaceId - The unique identifier of the destination place.
 *
 * @returns {Promise<string>|string} - A Promise that resolves with formatted directions,
 * or a string indicating no directions were found.
 *
 * @throws {Error} - Throws an error if there is a problem fetching the directions.
 */
const fetchDirections = async (originID, destinationID) => {
  try {
    console.log('origin', originID);
    console.log('destination', destinationID);
    // Encode the destination placeId and origin
    // const encodedDestination = encodeURIComponent(destination);
    // const encodedOrigin = encodeURIComponent(origin);
    const url = `https://maps.googleapis.com/maps/api/directions/json?destination=place_id:${destinationID}&origin=place_id:${originID}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    // Make a request to the Google Directions API to fetch directions
    const response = await axios.get(url);

    if (response && response.data && response.data.status === 'OK') {
      // Generate SMS from the directions and return
      return generateSMSFromDirections(response.data);
    }

    return 'No directions available';
  } catch (error) {
    console.error('Error in fetchDirections function.', error);
  }
};

module.exports = {
  fetchPlaceDetails,
  fetchDirections,
  fetchPlaceId,
};
