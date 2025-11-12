/**
 * Parse browser information from a User-Agent string
 * @param {string} uaString - The User-Agent string
 * @returns {Object} Browser information
 */
function parseBrowser(uaString) {
  let browser = { name: "Unknown", version: "" };

  const cfNetworkAppMatch = uaString.match(/^([^\/]+)\/([\d.]+)\s+CFNetwork/);
  const chromeMatch = uaString.match(/Chrome\/([\d.]+)/);
  const edgeMatch = uaString.match(/Edg(e)?\/([\d.]+)/);
  const firefoxMatch = uaString.match(/Firefox\/([\d.]+)/);
  const safariMatch = uaString.match(/Safari\/([\d.]+)/);
  const operaMatch = uaString.match(/OPR\/([\d.]+)/);
  const ieMatch =
    uaString.match(/MSIE ([\d.]+)/) || uaString.match(/Trident.*rv:([\d.]+)/);

  if (cfNetworkAppMatch) {
    browser = { name: cfNetworkAppMatch[1], version: cfNetworkAppMatch[2] };
  } else if (operaMatch) {
    browser = { name: "Opera", version: operaMatch[1] };
  } else if (edgeMatch) {
    browser = { name: "Edge", version: edgeMatch[2] || edgeMatch[1] };
  } else if (chromeMatch && safariMatch && !uaString.includes("Chromium")) {
    browser = { name: "Chrome", version: chromeMatch[1] };
  } else if (firefoxMatch) {
    browser = { name: "Firefox", version: firefoxMatch[1] };
  } else if (safariMatch && !chromeMatch && uaString.includes("Safari")) {
    const versionMatch = uaString.match(/Version\/([\d.]+)/);
    browser = { name: "Safari", version: versionMatch ? versionMatch[1] : "" };
  } else if (ieMatch) {
    browser = { name: "Internet Explorer", version: ieMatch[1] };
  }

  return browser;
}

module.exports = { parseBrowser };

