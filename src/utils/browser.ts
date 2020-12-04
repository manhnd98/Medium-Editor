import { Browser } from 'src/shared/models/browser.model';

const isInternetExplorer = () => {
  return (
    navigator.appName === 'Microsoft Internet Explorer' ||
    (navigator.appName === 'Netscape' &&
      new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null)
  );
};

const isEdge = () => /Edge\/\d+/.exec(navigator.userAgent) !== null;

const isFireFox = () => navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

const isMac = () => window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const isMobile = () => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return (
    toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    }) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

/**
 * Get current browser type
 * If function cannot detect browser type, its will return undefined
 */
const getBrower = (): Browser | undefined => {
  if (isInternetExplorer()) {
    return Browser.InternetExplorer;
  }

  if (isEdge()) {
    return Browser.Edge;
  }

  if (isFireFox()) {
    return Browser.Firefox;
  }

  if (isMac()) {
    return Browser.Mac;
  }

  if (isMobile()) {
    return Browser.Mobile;
  }

  return undefined;
};

export { isMobile, isMac, isInternetExplorer, isFireFox, isEdge, getBrower };
