/**
 * UA-Friendly Parser
 * Parses User-Agent strings into structured data
 */

const { parseBrowser } = require("./parsers/browser");
const { parseOS } = require("./parsers/os");
const { parseDevice } = require("./parsers/device");

/**
 * Parse a User-Agent string into its components
 * @param {string} uaString - The User-Agent string to parse
 * @returns {Object} An object containing parsed UA information
 */
function parseUserAgent(uaString) {
  if (!uaString) {
    return {
      browser: { name: "Unknown", version: "" },
      os: { name: "Unknown", version: "" },
      device: { type: "Unknown", brand: "", model: "" },
    };
  }

  return {
    browser: parseBrowser(uaString),
    os: parseOS(uaString),
    device: parseDevice(uaString),
  };
}

module.exports = {
  parseUserAgent,
  parseBrowser,
  parseOS,
  parseDevice,
};
