import { Extension, ExtensionsNameSpace } from '../models/extensions.model';

@ExtensionsNameSpace.register('CoreExtensionsName')
export class CoreExtensions extends Extension {
  name = 'CoreExtensions';

  constructor(otps: any) {
    super(otps);
    console.log(this.name, otps);
  }

  init(): void {}
}
