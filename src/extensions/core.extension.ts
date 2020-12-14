import { Utils } from '../helpers/utils';
import { autoInjectable, delay, inject, injectable } from 'tsyringe';
import {
  Extension,
  ExtensionsContainer,
  IExtensionOption
} from '../shared/models/extensions.model';
import { InjectToken } from '../editor.constant';
import { IEditorOptions } from '../shared/models/medium-editor.model';
import { EditorClass, MediumEditorAttribute } from '../shared/models/editor-attribute.model';
import { PlaceholderExtension } from '.';

@ExtensionsContainer.register('core')
@injectable()
export class CoreExtension extends Extension {

  /**
   * Editor option
   */
  option: IEditorOptions;

  constructor(
    @inject(InjectToken.OPTION_PREFIX + 'core') private otps: IEditorOptions,
    @inject(InjectToken.EDITOR_ID) private editorId: string,
    private utils: Utils
  ) {
    super(otps);
    this.option = otps;
    this.init();
  }

  init(): void {
    const editor = this.ownerDocument.querySelector(`[${MediumEditorAttribute.MEDIUM_EDITOR_ID}="${this.editorId}"]`);
    const section = this.createSection(true);
    editor?.appendChild(section);
  }

  /**
   * A section is a place to type content
   * In editor can have many section
   * Between section have a section divider DOM at the top of each section
   * @param isFirst: first section will create with header
   * @return section Element with placeholder
   */
  createSection(isFirst: boolean): HTMLElement {
    const innerSection = this.utils.createElement(
      this.ownerDocument,
      'div',
      '',
      'section-inner sectionLayout--insetColumn'
    );

    if (isFirst) {
      // Create H3 title element
      const { span, br } = this.utils.createPlaceholder(this.ownerDocument, this.option.placeholder.title);
      const h3 = this.utils.createElement(
        this.ownerDocument,
        'h3',
        span,
        `${EditorClass.H3} ${EditorClass.LEADING} ${EditorClass.TITLE}`
      );

      h3.appendChild(br);

      // append h3 to section inner
      innerSection.appendChild(h3);
    }
    // const section = this.utils.createElement(this.ownerDocument, 'section')
    const defaultP = this.utils.createPlaceholder(this.ownerDocument, this.option.placeholder.body);
    const p = this.utils.createElement(this.ownerDocument, 'p', defaultP.span, EditorClass.P);
    p.appendChild(defaultP.br);

    innerSection.appendChild(p);
    const sectionContent = this.utils.createElement(
      this.ownerDocument,
      'div',
      innerSection,
      'section-content'
    );
    const sectionDivider = this.utils.createSectionDivider(this.ownerDocument);

    /**
     * Init first section in editor also is last section
     * When we create another section, remove @SECTION_LAST class and append to new one
     */
    const sectionClass = isFirst
      ? `${EditorClass.SECTION} ${EditorClass.SECTION_FIRST} ${EditorClass.SECTION_LAST} section--body`
      : `${EditorClass.SECTION} ${EditorClass.SECTION_LAST} section--body`;
    const section = this.utils.createElement(
      this.ownerDocument,
      'section',
      sectionDivider,
      sectionClass
    );

    section.appendChild(sectionContent);

    return section;
  }
}
