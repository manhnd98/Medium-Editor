import {
  ALT,
  CAPS_LOCK,
  CONTEXT_MENU,
  CONTROL,
  DOWN_ARROW,
  END,
  ESCAPE,
  F1,
  F10,
  F11,
  F12,
  F2,
  F3,
  F4,
  F5,
  F6,
  F7,
  F8,
  F9,
  FF_MINUS,
  FF_MUTE,
  FF_VOLUME_DOWN,
  FF_VOLUME_UP,
  FIRST_MEDIA,
  HOME,
  INSERT,
  LAST_MEDIA,
  LEFT_ARROW,
  MAC_META,
  MAC_WK_CMD_LEFT,
  MAC_WK_CMD_RIGHT,
  META,
  MUTE,
  NUM_LOCK,
  PAGE_DOWN,
  PAGE_UP,
  PAUSE,
  PRINT_SCREEN,
  RIGHT_ARROW,
  SCROLL_LOCK,
  SHIFT,
  UP_ARROW,
  VOLUME_DOWN,
  VOLUME_UP
} from './keycodes';

const NON_PRINTABLE_KEYS = [
  SHIFT,
  CONTROL,
  ALT,
  PAUSE,
  CAPS_LOCK,
  ESCAPE,
  PAGE_UP,
  PAGE_DOWN,
  END,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  UP_ARROW,
  DOWN_ARROW,
  INSERT,
  PRINT_SCREEN,
  META,
  MAC_WK_CMD_LEFT,
  MAC_WK_CMD_RIGHT,
  CONTEXT_MENU,
  F1,
  F2,
  F3,
  F4,
  F5,
  F6,
  F7,
  F8,
  F9,
  F10,
  F11,
  F12,
  NUM_LOCK,
  SCROLL_LOCK,
  FIRST_MEDIA,
  FF_MINUS,
  MUTE,
  VOLUME_UP,
  VOLUME_DOWN,
  FF_MUTE,
  FF_VOLUME_DOWN,
  LAST_MEDIA,
  FF_VOLUME_UP,
  MAC_META
];

/**
 * @description
 * Check keyboard event is printable key
 * Sometime, with non-latin language, their keyboard
 * have some special character that return key code not in list
 * Example: Vietnamese Telex on Mac OS
 * ```
 * Character `Ư` need to press U and W
 * javascript event return key 229 for both of them
 * ```
 */
export function isKeyPrintable(e: KeyboardEvent): boolean {
  // Check that keyboard is event is non-printable key
  return NON_PRINTABLE_KEYS.indexOf(e.keyCode) === -1;
}
