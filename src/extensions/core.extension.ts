import { Utils } from '../helpers/utils';
import { autoInjectable, inject, injectable } from 'tsyringe';
import {
  Extension,
  ExtensionsContainer,
  IExtensionOption
} from '../shared/models/extensions.model';
import { InjectToken } from '../editor.constant';

@ExtensionsContainer.register('core')
@injectable()
export class CoreExtension extends Extension {
  constructor(@inject(InjectToken.OPTION_PREFIX + 'core') otps: IExtensionOption, utils: Utils) {
    super(otps);
    console.log(utils);
  }

  init(): void {}

  /**
   * A section is a place to type content
   * In editor can have many section
   * Between section have a section divider DOM at the top of each section
   */
  createSection() {}

  createDefaultValueElement(value: string) {}
}
