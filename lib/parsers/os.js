/**
 * Parse OS information from a User-Agent string
 * @param {string} uaString - The User-Agent string
 * @returns {Object} OS information
 */
function parseOS(uaString) {
  let os = { name: "Unknown", version: "" };

  const windowsMatch = uaString.match(/Windows NT ([\d.]+)/);
  const macOSMatch = uaString.match(/Mac OS X ([\d_.]+)/);
  const iOSMatch =
    uaString.match(/iPhone OS ([\d_]+)/) || uaString.match(/iPad.*OS ([\d_]+)/);
  const androidMatch = uaString.match(/Android ([\d.]+)/);
  const linuxMatch = uaString.match(/Linux/);
  const darwinMatch = uaString.match(/Darwin\/([\d.]+)/);

  if (windowsMatch) {
    const version = windowsMatch[1];
    let windowsVersion = "Windows";

    const windowsVersions = {
      "10.0": "Windows 10",
      6.3: "Windows 8.1",
      6.2: "Windows 8",
      6.1: "Windows 7",
      "6.0": "Windows Vista",
      5.2: "Windows XP x64",
      5.1: "Windows XP",
      "5.0": "Windows 2000",
    };

    windowsVersion = windowsVersions[version] || `Windows (NT ${version})`;
    os = { name: windowsVersion, version };
  } else if (macOSMatch) {
    const version = macOSMatch[1].replace(/_/g, ".");
    os = { name: "macOS", version };
  } else if (iOSMatch) {
    const version = iOSMatch[1].replace(/_/g, ".");
    os = { name: "iOS", version };
  } else if (androidMatch) {
    os = { name: "Android", version: androidMatch[1] };
  } else if (darwinMatch) {
    const darwinVersion = darwinMatch[1];
    const majorVersion = parseInt(darwinVersion.split(".")[0]);
    
    const darwinToOS = {
      20: { macos: "11", ios: "14" },
      21: { macos: "12", ios: "15" },
      22: { macos: "13", ios: "16" },
      23: { macos: "14", ios: "17" },
      24: { macos: "15", ios: "18" },
      25: { macos: "16", ios: "19" },
    };
    
    const isLikelyiOS = uaString.includes("CFNetwork") && !uaString.match(/Macintosh|Mac OS X/);
    
    if (darwinToOS[majorVersion]) {
      if (isLikelyiOS) {
        os = { name: "iOS", version: darwinToOS[majorVersion].ios };
      } else {
        os = { name: "macOS", version: darwinToOS[majorVersion].macos };
      }
    } else {
      os = { name: isLikelyiOS ? "iOS" : "macOS", version: darwinVersion };
    }
  } else if (linuxMatch) {
    os = { name: "Linux", version: "" };
  }

  return os;
}

module.exports = { parseOS };

