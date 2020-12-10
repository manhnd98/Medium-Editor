import { InjectToken } from '../editor.constant';
import { Extension, ExtensionsContainer } from '../shared/models/extensions.model';
import { IEditorOptions } from '../shared/models/medium-editor.model';
import { inject, injectable } from 'tsyringe';
import { KeypressService } from '../shared';
import { Observable } from 'rxjs';
import { SelectionHelper } from '../helpers/selection';
import { EditorClass } from '../shared/models/editor-attribute.model';
import { Utils } from '../helpers/utils';

@ExtensionsContainer.register('placeholder')
@injectable()
/**
 * Handle placeholder events
 */
export class PlaceholderExtension extends Extension {

  /**
   * Editor key printable
   */
  editorKeyPrint$: Observable<KeyboardEvent>;

  constructor(
    @inject(InjectToken.OPTION_PREFIX + 'placeholder') private otps: IEditorOptions,
    private keypressService: KeypressService,
    private selection: SelectionHelper,
    private utils: Utils
  ) {
    super(otps);
    this.editorKeyPrint$ = keypressService.editorKeyPrint$;
    this.init();
    console.log('placeholder');
  }

  init() {
    this.editorKeyPrint$.subscribe((event) => {
      this.onPlaceholderKeydown();
    });
  }

  /**
   * When user type key on placeholder, we will remove placeholder and start typing
   */
  onPlaceholderKeydown() {
    const element = this.selection.getSelectionStart(this.ownerDocument);
    /**
     * element is contain default value;
     */
    if (element.classList.contains(EditorClass.DEFAULT_VALUE)) {
      const parentElement = element.parentElement;
      parentElement?.removeChild(element);
    }
  }
}
