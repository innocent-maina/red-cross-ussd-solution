/** ------------------------------------------------------
 *  Params
 * ************* response: string
 * *************  chosenNumber: string
 * ---------------------------------------
 * This function receives a response from the maps and the number the user chooses
 *  then gives the selected item in the number    *
 * ---------------------------------------
 ------------------------------------------------------* */
function getSelectedText(response, chosenNumber) {
  if (typeof response !== 'string' || !response.trim()) {
    return 'Invalid response format';
  }

  const options = response.split('\n').map((option) => option.trim());

  if (chosenNumber >= 1 && chosenNumber <= options.length) {
    const selectedText = options[chosenNumber - 1];
    const strippedText = selectedText.replace(/^\d+[:.]\s*/, ''); // Removes numbering and colon/dot
    return strippedText;
  }

  return 'Invalid choice';
}

module.exports = { getSelectedText };
