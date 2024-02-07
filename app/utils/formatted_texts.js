/* eslint-disable no-console */
function formatTextDirections(directions) {
  const formattedLines = [];

  try {
    // Split the directions into lines based on newline characters
    const lines = directions.split('\n');

    // Format the directions by splitting at specific points and adding 2 line breaks

    let isFirstColonProcessed = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const line of lines) {
      const cleanedLine = line.replace(/-/g, '\n\n');
      if (!isFirstColonProcessed && cleanedLine.includes(':')) {
        formattedLines.push(cleanedLine.replace(/:/, ':\n\n'));
        isFirstColonProcessed = true;
      } else {
        formattedLines.push(cleanedLine);
      }
    }

    return formattedLines.join('\n');
  } catch (error) {
    console.error('Error in formatTextDirections', error);
  }
  return formattedLines.join('\n');
}

module.exports = { formatTextDirections };
