import { Browser } from '../shared/models/browser.model';

export class Utils {
  constructor() {}

  isInternetExplorer(): boolean {
    return (
      navigator.appName === 'Microsoft Internet Explorer' ||
      (navigator.appName === 'Netscape' &&
        new RegExp('Trident/.*rv:([0-9]{1,}[.0-9]{0,})').exec(navigator.userAgent) !== null)
    );
  }

  isEdge(): boolean {
    return /Edge\/\d+/.exec(navigator.userAgent) !== null;
  }

  isFireFox(): boolean {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }

  isMac(): boolean {
    return window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }

  isMobile(): boolean {
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
  }

  /**
   * Get current browser type
   * If function cannot detect browser type, its will return undefined
   */
  getBrower(): Browser | undefined {
    if (this.isInternetExplorer()) {
      return Browser.InternetExplorer;
    }

    if (this.isEdge()) {
      return Browser.Edge;
    }

    if (this.isFireFox()) {
      return Browser.Firefox;
    }

    if (this.isMac()) {
      return Browser.Mac;
    }

    if (this.isMobile()) {
      return Browser.Mobile;
    }

    return undefined;
  }

  /**
   * Check parameter is a HTML element or not
   * @param element : HTML element or selector
   */
  // https://github.com/jashkenas/underscore
  isElement(obj: any): boolean {
    return !!(obj && obj.nodeType === 1);
  }

  /**
   * https://stackoverflow.com/questions/7238177/how-to-detect-htmlcollection-nodelist-in-javascript
   *
   * Check parameter is html nodelist or not
   */
  isNodeList(obj: any): boolean {
    return NodeList.prototype.isPrototypeOf(obj);
  }

  /**
   * https://stackoverflow.com/questions/7238177/how-to-detect-htmlcollection-nodelist-in-javascript
   *
   * Check element is html collection or not
   */
  isHTMLCollection(obj: any): boolean {
    return HTMLCollection.prototype.isPrototypeOf(obj);
  }

  defaults(dest: any, source1: any, source2: any): any {
    const args = [false].concat(Array.prototype.slice.call(arguments));
    return this.copyInto.apply(this, args as any);
  }

  copyInto(overwrite: any, dest: any): any {
    const sources = Array.prototype.slice.call(arguments, 2);
    dest = dest || {};
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      if (source) {
        for (const prop in source) {
          if (
            source.hasOwnProperty(prop) &&
            typeof source[prop] !== 'undefined' &&
            (overwrite || dest.hasOwnProperty(prop) === false)
          ) {
            dest[prop] = source[prop];
          }
        }
      }
    }
    return dest;
  }
}
