import { IEditorOptions } from '@model';
import { Utils } from 'src/helpers/utils';
import { BaseStateService } from 'src/shared/base-state.service';
import { singleton } from 'tsyringe';

function initializeState(): IEditorOptions {
  return {
    activeButtonClass: 'medium-editor-button-active',
    buttonLabels: false,
    delay: 0,
    disableReturn: false,
    disableDoubleReturn: false,
    disableExtraSpaces: false,
    disableEditing: false,
    autoLink: false,
    elementsContainer: document.body,
    contentWindow: window,
    ownerDocument: document,
    targetBlank: false,
    extensions: [],
    spellcheck: false,
    placeholder: {
      title: 'Title',
      body: 'Tell your story...',
      image: 'Type caption for image (optional)',
      media: 'Type caption for embed (optional)'
    }
  };
}

@singleton()
export class OptionService extends BaseStateService<IEditorOptions> {
  constructor(private utils: Utils) {
    super(initializeState());
  }

  /**
   * Update option and merge new option to current option
   * @param option : Medium editor option
   */
  updateOption(option: Partial<IEditorOptions>) {
    const currentOption = this.state;
    const newOption = this.utils.defaults({}, option, currentOption);
    this.setState(newOption);
    return this.state;
  }
}
