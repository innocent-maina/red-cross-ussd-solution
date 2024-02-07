/* eslint-disable no-console */
const axios = require('axios');

const MAP_API = 'https://maps.googleapis.com/maps/api/place/textsearch';

/** ------------------------------------------------------
 *  1. Emergency response
 * ------------------------------------------------------
 * *****************************************************
 * ------------------------------------------------------
 * Retrieves a list of emergency hospitals with ambulance services near the specified location.
 *
 * @param {string} location - The location to search for emergency hospitals.
 *
 * @returns {Promise<object[]>|string} - A Promise that resolves with an array of hospital results,
 * or a string indicating no emergency hospitals were found.
 *
 * @throws {Error} - Throws an error if there is a problem fetching emergency hospitals.
 */
async function fetchEmergencyHospitals(location) {
  try {
    const encodedLocation = encodeURIComponent(location);
    const url = `${MAP_API}/json?query=hospital%20with%20emergency%20response%20or%20ambulance%20service%20in%20${encodedLocation}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    if (
      response.data
      && response.data.results
      && response.data.results.length > 0
    ) {
      return response.data.results; // Return the results array
    }

    return 'No emergency hospitals with ambulance services available';
  } catch (error) {
    console.error('Error fetching emergency hospitals.', error);
    throw error;
  }
}

/** ------------------------------------------------------
 *  2. Healthcare facility locator
 * ------------------------------------------------------
 * *****************************************************
 * ------------------------------------------------------
 *  fetchPlaceByFacility
 * ------------------------------------------------------
 * Retrieves detailed information about a specific place
 * based on its name and location.
 *
 * @param {string} placeName - The name of the place.
 * @param {string} location - The location to search for the place.
 *
 * @returns {Promise<object[]>|string} - A Promise that resolves
 * with an array of formatted place details, or a string indicating
 * no results were found.
 * ------------------------------------------------------
 */

async function fetchPlaceByFacility(category, location) {
  const categories = {
    1: 'hospital',
    2: 'pharmacy',
    3: 'clinic',
  };

  try {
    const encodedCategory = encodeURIComponent(
      categories[category.toLowerCase()],
    );
    const encodedLocation = encodeURIComponent(location);
    const url = `${MAP_API}/json?query=${encodedCategory}%20in%20${encodedLocation}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    if (
      response.data
      && response.data.results
      && response.data.results.length > 0
    ) {
      return response.data.results;
    }
    return `No ${category} available`;
  } catch (error) {
    console.error(`Error fetching ${category}.`, error);
    throw error;
  }
}

/** ------------------------------------------------------
 *  3. Specialized care
 * ------------------------------------------------------
 * *****************************************************
 * ------------------------------------------------------
 *  fetchFacilitiesByCare
 * ------------------------------------------------------
 * Retrieves a list of pharmacies near the specified location.
 *
 * @param {string} careOption - The type of care option (e.g., dental, optical, etc.).
 * @param {string} origin - The location of the user when making the request.
 *
 * @returns {Promise<object[]>|string} - A Promise that resolves with an array of pharmacy results,
 * or a string indicating no pharmacies were found.
 *
 * @throws {Error} - Throws an error if there is a problem fetching pharmacies.
 */
async function fetchFacilitiesByCare(careOption, origin) {
  try {
    const encodedLocation = encodeURIComponent(origin);
    const encodedCareOption = encodeURIComponent(careOption);
    const url = `${MAP_API}/json?query=${encodedCareOption}%20in%20${encodedLocation}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    if (
      response.data
      && response.data.results
      && response.data.results.length > 0
    ) {
      return response.data.results; // Return the results array
    }

    return 'No pharmacies available';
  } catch (error) {
    console.error('Error fetching pharmacies.', error);
    throw error;
  }
}

/** ------------------------------------------------------
 *  4. Possible referrals
 * ------------------------------------------------------
 * *****************************************************
 * ------------------------------------------------------
 *  fetchPossibleReferrals
 * ------------------------------------------------------
 * Retrieves a list of referrals for the specified medical profession near the specified location.
 *
 * @param {string} profession - The medical profession (e.g., Surgeon, Pediatrician, etc.).
 * @param {string} location - The location to search for referrals.
 *
 * @returns {Promise<object[]>|string} - A Promise that resolves with an array of referral results,
 * or a string indicating no referrals were found.
 *
 * @throws {Error} - Throws an error if there is a problem fetching referrals.
 */
async function fetchPossibleReferrals(profession, location) {
  try {
    const encodedLocation = encodeURIComponent(location);
    const encodedProfession = encodeURIComponent(profession);
    const url = `${MAP_API}/json?query=${encodedProfession}%20referral%20in%20${encodedLocation}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    if (
      response.data
      && response.data.results
      && response.data.results.length > 0
    ) {
      return response.data.results; // Return the results array
    }

    return `No ${profession} referrals available`;
  } catch (error) {
    console.error(`Error fetching ${profession} referrals.`, error);
    throw error;
  }
}

/** ------------------------------------------------------
 *  5. Medicine search
 * ------------------------------------------------------
 * *****************************************************
 * ------------------------------------------------------
 *  fetchMedicineSearch
 * ------------------------------------------------------
 * Retrieves a list of pharmacies that have the specified medicine near the specified location.
 *
 * @param {string} medicineName - The name of the medicine.
 * @param {string} location - The location to search for pharmacies.
 *
 * @returns {Promise<object[]>|string} - A Promise that resolves with an array of pharmacy results,
 * or a string indicating no pharmacies were found.
 *
 * @throws {Error} - Throws an error if there is a problem fetching pharmacies.
 */
async function fetchMedicineSearch(medicineName, location) {
  try {
    const encodedLocation = encodeURIComponent(location);
    const encodedMedicine = encodeURIComponent(medicineName);
    const url = `${MAP_API}/json?query=${encodedMedicine}%20near%20${encodedLocation}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    if (
      response.data
      && response.data.results
      && response.data.results.length > 0
    ) {
      return response.data.results; // Return the results array
    }

    return `No pharmacies with ${medicineName} available`;
  } catch (error) {
    console.error(`Error fetching pharmacies with ${medicineName}.`, error);
    throw error;
  }
}

module.exports = {
  fetchEmergencyHospitals,
  fetchPlaceByFacility,
  fetchFacilitiesByCare,
  fetchPossibleReferrals,
  fetchMedicineSearch,
};
