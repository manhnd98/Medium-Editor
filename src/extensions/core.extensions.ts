import { Extension, ExtensionsContainer } from '../shared/models/extensions.model';

@ExtensionsContainer.register('CoreExtensionsName')
export class CoreExtensions extends Extension {
  constructor(otps: any) {
    super(otps);
    console.log(this.name, otps);
  }

  init(): void {}
}
