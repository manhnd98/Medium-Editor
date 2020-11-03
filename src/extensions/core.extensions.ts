import { Extension, ExtensionsNamespace } from '../models/extensions.model';

@ExtensionsNamespace.register('CoreExtensionsName')
export class CoreExtensions extends Extension {

  constructor(otps: any) {
    super(otps);
    console.log(this.name, otps);
  }

  init(): void {}
}
