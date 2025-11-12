/**
 * Parse device information from a User-Agent string
 * @param {string} uaString - The User-Agent string
 * @returns {Object} Device information
 */
function parseDevice(uaString) {
  let device = { type: "Desktop", brand: "", model: "" };

  const isMobile = /Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(
    uaString
  );
  const isTablet = /Tablet|iPad/i.test(uaString);

  const iPhoneMatch = uaString.match(/iPhone/);
  const iPadMatch = uaString.match(/iPad/);
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

module.exports = { parseDevice };

