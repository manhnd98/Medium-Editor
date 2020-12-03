import { injectable, singleton } from 'tsyringe';

@injectable()
export class Events {
  randomNumber: number;
  constructor() {
    this.randomNumber = Math.random();
  }

  setupListener(): void {}

  logRandomNumber(): void {
    console.log(this.randomNumber);
  }
}
