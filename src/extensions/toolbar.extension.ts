import { Extension, ExtensionsContainer } from '@model/extensions.model';
import {
  editorBold,
  editorItalic,
  editorLink,
  editorQuote,
  editorSubTitle,
  editorTitle
} from '@model/icon.model';
import { ButtonId, IToolbarButton, ToolbarButton } from '@model/toolbar.model';
import { KeyService } from '@state/ui/key.service';
import { OptionService } from '@state/data/option.service';
import { ToolbarStateService } from '@state/ui/toolbar.service';
import { Utils } from 'src/helpers/utils';
import { injectable } from 'tsyringe';
import { Observable } from 'rxjs';

@ExtensionsContainer.register('toolbar')
@injectable()
export class ToolbarExtension extends Extension {
  buttons: IToolbarButton[] = [];

  /**
   * toolbar element
   */
  toolbar!: HTMLElement;

  extensionOption: any;

  /**
   * Extension init toolbar base on user options
   */
  constructor(
    private optionService: OptionService,
    private utils: Utils,
    private toolbarStateService: ToolbarStateService,
    private keypressService: KeyService
  ) {
    super(optionService.state);
    this.extensionOption = optionService.state.extensions.toolbar;
    this.initDefaultButtons();
    this.init();
    this.attachEventListener();
  }

  init() {
    const selector = this.extensionOption.selector;
    let elementTemp: HTMLElement | null;
    // if selector is a Html Node return its as array
    if (this.utils.isElement(selector)) {
      elementTemp = selector as HTMLElement;
    } else {
      elementTemp = this.ownerDocument.getElementById(selector);
    }

    if (!elementTemp) {
      return this.createFloatToolbar();
    }

    this.appendActionButtons(elementTemp);

    this.toolbar = elementTemp;
  }

  attachEventListener() {
    this.toolbarStateService.display$.subscribe((isDisplay) => {
      if (isDisplay) {
        return this.toolbar.classList.add('active');
      }

      return this.toolbar.classList.remove('active');
    });

    this.keypressService.editorFocus$.subscribe((event) => {
      console.log('focus');
    });

    this.keypressService.editorBlur$.subscribe((event) => {
      console.log('blur');
    });
  }

  /**
   * Create default buttons if user config not existed
   */
  initDefaultButtons() {
    const bold = new ToolbarButton(ButtonId.B, '', editorBold.data);
    const italic = new ToolbarButton(ButtonId.I, '', editorItalic.data);
    const link = new ToolbarButton(ButtonId.LINK, '', editorLink.data, 21, true);
    const title = new ToolbarButton(ButtonId.TITLE, '', editorTitle.data);
    const subTitle = new ToolbarButton(ButtonId.SUB_TITLE, '', editorSubTitle.data);
    const quote = new ToolbarButton(ButtonId.QUOTE, '', editorQuote.data);
    this.buttons = [bold, italic, link, title, subTitle, quote];
  }

  createFloatToolbar() {
    // Create arrow clip
    const arrow = this.utils.createElement(this.ownerDocument, 'span', '', 'highlightMenu-arrow');
    const arrowClip = this.utils.createElement(
      this.ownerDocument,
      'div',
      arrow,
      'highlightMenu-arrowClip'
    );

    // Create element list set of button
    const buttonSet = this.utils.createElement(this.ownerDocument, 'div', '', 'buttonSet');
    this.appendActionButtons(buttonSet);
    const toolbarInner = this.utils.createElement(
      this.ownerDocument,
      'div',
      buttonSet,
      'highlightMenu-inner'
    );
    const toolbar = this.utils.createElement(
      this.ownerDocument,
      'div',
      toolbarInner,
      'highlightMenu'
    );
    toolbar.appendChild(arrowClip);

    // append toolbar to document body
    this.ownerDocument.body.appendChild(toolbar);

    this.toolbar = toolbar;
  }

  appendActionButtons(container: HTMLElement) {
    this.buttons.forEach((button) => {
      const buttonElement = this.createToolbarButton(button);
      container.appendChild(buttonElement);

      // Add separator on the right of button
      if (button.separator) {
        const separator = this.utils.createElement(
          this.ownerDocument,
          'div',
          '',
          'buttonSet-separator'
        );
        container.appendChild(separator);
      }
    });
  }

  createToolbarButton(button: ToolbarButton): HTMLButtonElement {
    // Create button with setting
    const buttonClassName = 'button button--chromeless button--highlightMenu' + button.style;
    const span = this.utils.createElement(this.ownerDocument, 'span', button.icon, 'svgIcon');
    const buttonElement = this.utils.createElement(
      this.ownerDocument,
      'button',
      span,
      buttonClassName
    ) as HTMLButtonElement;
    buttonElement.setAttribute('data-action', button.id);

    // Add button with and height
    span.style.width = button.size + 'px';
    span.style.height = button.size + 'px';

    return buttonElement;
  }

  /**
   * Attach event to toolbar button base on id
   * @param id : Button id
   * @param button : Button element
   */
  attachEventHandler(id: ButtonId, button: HTMLButtonElement) {}
}
