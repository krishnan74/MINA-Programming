import { Field, state, State, SmartContract, method } from 'o1js';

export class Square extends SmartContract {
  @state(Field) number = State<Field>();
  init() {
    super.init();
    this.number.set(Field(3));
  }

  @method async update(square: Field) {
    const currentState = this.number.get();
    this.number.requireEquals(currentState);
    square.assertEquals(currentState.mul(currentState));
    this.number.set(square);
  }
}
