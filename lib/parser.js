/**
 * UA-Friendly Parser
 * Parses User-Agent strings into structured data
 */

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

/**
 * Parse browser information from a User-Agent string
 * @param {string} uaString - The User-Agent string
 * @returns {Object} Browser information
 */
function parseBrowser(uaString) {
  // Default browser info
  let browser = { name: "Unknown", version: "" };

  // CFNetwork app (iOS/macOS native apps)
  const cfNetworkAppMatch = uaString.match(/^([^\/]+)\/([\d.]+)\s+CFNetwork/);
  // Chrome
  const chromeMatch = uaString.match(/Chrome\/([\d.]+)/);
  // Edge
  const edgeMatch = uaString.match(/Edg(e)?\/([\d.]+)/);
  // Firefox
  const firefoxMatch = uaString.match(/Firefox\/([\d.]+)/);
  // Safari
  const safariMatch = uaString.match(/Safari\/([\d.]+)/);
  // Opera
  const operaMatch = uaString.match(/OPR\/([\d.]+)/);
  // IE
  const ieMatch =
    uaString.match(/MSIE ([\d.]+)/) || uaString.match(/Trident.*rv:([\d.]+)/);

  // Order matters here due to UA string patterns
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

/**
 * Parse OS information from a User-Agent string
 * @param {string} uaString - The User-Agent string
 * @returns {Object} OS information
 */
function parseOS(uaString) {
  // Default OS info
  let os = { name: "Unknown", version: "" };

  // Windows
  const windowsMatch = uaString.match(/Windows NT ([\d.]+)/);
  // macOS
  const macOSMatch = uaString.match(/Mac OS X ([\d_.]+)/);
  // iOS
  const iOSMatch =
    uaString.match(/iPhone OS ([\d_]+)/) || uaString.match(/iPad.*OS ([\d_]+)/);
  // Android
  const androidMatch = uaString.match(/Android ([\d.]+)/);
  // Linux
  const linuxMatch = uaString.match(/Linux/);
  // Darwin (CFNetwork - iOS/macOS)
  const darwinMatch = uaString.match(/Darwin\/([\d.]+)/);

  if (windowsMatch) {
    const version = windowsMatch[1];
    let windowsVersion = "Windows";

    // Map Windows NT version to friendly name
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
    
    // Map Darwin version to macOS/iOS version
    // Darwin 20 = macOS 11/iOS 14, Darwin 21 = macOS 12/iOS 15, etc.
    const darwinToOS = {
      20: { macos: "11", ios: "14" },
      21: { macos: "12", ios: "15" },
      22: { macos: "13", ios: "16" },
      23: { macos: "14", ios: "17" },
      24: { macos: "15", ios: "18" },
      25: { macos: "16", ios: "19" },
    };
    
    // Check if it's likely iOS (CFNetwork from mobile app) or macOS
    // If CFNetwork is present, default to iOS unless we have other indicators
    const isLikelyiOS = uaString.includes("CFNetwork") && !uaString.match(/Macintosh|Mac OS X/);
    
    if (darwinToOS[majorVersion]) {
      if (isLikelyiOS) {
        os = { name: "iOS", version: darwinToOS[majorVersion].ios };
      } else {
        os = { name: "macOS", version: darwinToOS[majorVersion].macos };
      }
    } else {
      // Unknown Darwin version, use generic
      os = { name: isLikelyiOS ? "iOS" : "macOS", version: darwinVersion };
    }
  } else if (linuxMatch) {
    os = { name: "Linux", version: "" };
  }

  return os;
}

/**
 * Parse device information from a User-Agent string
 * @param {string} uaString - The User-Agent string
 * @returns {Object} Device information
 */
function parseDevice(uaString) {
  // Default device info
  let device = { type: "Desktop", brand: "", model: "" };

  // Mobile
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(
    uaString
  );
  // Tablet
  const isTablet = /Tablet|iPad/i.test(uaString);

  // iPhone
  const iPhoneMatch = uaString.match(/iPhone/);
  // iPad
  const iPadMatch = uaString.match(/iPad/);
  // Android device
  const androidDeviceMatch = uaString.match(
    /Android [\d.]+;\s*([^;]+)(?:Build|\))/
  );

  if (isTablet) {
    device.type = "Tablet";

    if (iPadMatch) {
      device.brand = "Apple";
      device.model = "iPad";
    } else if (androidDeviceMatch) {
      device.brand = "Android";
      // Try to extract brand from model
      const model = androidDeviceMatch[1].trim();
      const brandMatch = model.match(/^([^\s]+)/);
      if (brandMatch) {
        device.brand = brandMatch[1];
        device.model = model.replace(brandMatch[1], "").trim();
      } else {
        device.model = model;
      }
    }
  } else if (isMobile) {
    device.type = "Mobile";

    if (iPhoneMatch) {
      device.brand = "Apple";
      device.model = "iPhone";
    } else if (androidDeviceMatch) {
      device.brand = "Android";
      // Try to extract brand from model
      const model = androidDeviceMatch[1].trim();
      const brandMatch = model.match(/^([^\s]+)/);
      if (brandMatch) {
        device.brand = brandMatch[1];
        device.model = model.replace(brandMatch[1], "").trim();
      } else {
        device.model = model;
      }
    }
  } else {
    const windowsMatch = uaString.match(/Windows NT/);
    const macOSMatch = uaString.match(/Mac OS X/);
    const linuxMatch = uaString.match(/Linux/);
    const darwinMatch = uaString.match(/Darwin/);
    const cfNetworkMatch = uaString.match(/CFNetwork/);

    if (windowsMatch) {
      device.model = "Windows";
    } else if (macOSMatch) {
      device.model = "Mac";
    } else if (darwinMatch && cfNetworkMatch) {
      const isLikelyiOS = !uaString.match(/Macintosh|Mac OS X/);
      device.type = isLikelyiOS ? "Mobile" : "Desktop";
      device.model = isLikelyiOS ? "iPhone" : "Mac";
      if (isLikelyiOS) {
        device.brand = "Apple";
      }
    } else if (linuxMatch) {
      device.model = "Linux";
    } else {
      device.model = "Desktop";
    }
  }

  return device;
}

module.exports = {
  parseUserAgent,
  parseBrowser,
  parseOS,
  parseDevice,
};
