import { InjectToken } from '../editor.constant';
import { Extension, ExtensionsContainer } from '../shared/models/extensions.model';
import { IEditorOptions } from '../shared/models/medium-editor.model';
import { inject, injectable } from 'tsyringe';
import { KeypressService } from '../shared';
import { Observable } from 'rxjs';
import { SelectionHelper } from '../helpers/selection';
import { EditorClass, MediumEditorAttribute } from '@model/editor-attribute.model';
import { Utils } from '../helpers/utils';
import { SelectEventService } from '@state/ui/select.service';

@ExtensionsContainer.register('placeholder')
@injectable()
/**
 * Handle placeholder events
 */
export class PlaceholderExtension extends Extension {
  /**
   * Document keypress
   */
  keypress$: Observable<KeyboardEvent>;

  /**
   * User click on element in editor DOM
   */
  editorClick$: Observable<Event>;

  constructor(
    @inject(InjectToken.OPTION_PREFIX + 'placeholder') private otps: IEditorOptions,
    keypressService: KeypressService,
    selectService: SelectEventService,
    private selection: SelectionHelper,
    private utils: Utils
  ) {
    super(otps);

    this.keypress$ = keypressService.keypress$;
    this.editorClick$ = selectService.editorClick$;
    keypressService.keydown$.subscribe(event => console.log(event));

    this.init();
  }

  init() {
    this.keypress$.subscribe((event) => this.onPlaceholderKeydown(event));
    this.editorClick$.subscribe((event) => this.onPlaceholderClick(event));
  }

  /**
   * When user type key on placeholder, we will remove placeholder and start typing
   * We need to listen to document event keydown instead of element keydown to solve issuse
   * https://github.com/manhnd98/Medium-Editor/issues/2
   */
  onPlaceholderKeydown(event: Event) {
    const element = this.selection.getSelectionStart(this.ownerDocument);

    // Check is default element
    if (element.classList.contains(EditorClass.DEFAULT_VALUE)) {
      const parentElement = element.parentElement;
      parentElement?.removeChild(element);
    }
  }

  /**
   * Handle event when user click on placeholder element
   */
  onPlaceholderClick(event: Event) {
    // const target = event.target as HTMLElement;
    // if (target.className.indexOf(EditorClass.DEFAULT_VALUE) > -1) {
    //   event.stopPropagation();
    //   event.preventDefault();
    //   this.selection.moveCursor(this.ownerDocument, target, 0);
    // }
  }
}
