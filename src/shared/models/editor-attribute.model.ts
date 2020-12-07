export enum MediumEditorAttribute {
  MEDIUM_EDITOR_ELEMENT = 'medium-editor-element',
  MEDIUM_EDITOR_ID = 'medium-editor-id',
  MEDIUM_EDITOR_UNIQUE_ID = 'medium-editor-'
}

export enum EditorClass {
  /**
   * H3 element
   */
  H3 = 'graf graf--h3',

  TITLE = 'graf--title',

  /**
   * Element leading in section
   */
  LEADING = 'graf--leading',

  /**
   * P element
   */
  P = 'graf graf--p',
  /**
   * Element is selected
   */
  SELECTED = 'is-selected',

  /**
   * Current element is after element ?
   * Ex: graf-after--p
   * That mean previousSibling is a P element
   */
  AFTER = 'graf-after--',

  SECTION_FIRST = 'section--first',

  SECTION_LAST = 'section--last',

  SECTION = 'section',

  DEFAULT_VALUE = 'defaultValue'
}